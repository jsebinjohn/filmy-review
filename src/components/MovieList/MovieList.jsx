import React, { useEffect, useMemo, useState } from "react";

import "./MovieList.css";
import MovieCard from "./MovieCard";
import FilterGroup from "./FilterGroup";

const API_KEY = "183928bab7fc630ed0449e4f66ec21bd";

const MovieList = ({ type, title, emoji }) => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState({
    by: "default",
    order: "asc",
  });
  const [userRatings, setUserRatings] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovies();
  }, [type]);

  const fetchMovies = async () => {
    try {
      setError("");
      const [moviesResponse, genresResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=${API_KEY}`),
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`),
      ]);

      if (!moviesResponse.ok || !genresResponse.ok) {
        throw new Error("Unable to load movies.");
      }

      const moviesData = await moviesResponse.json();
      const genresData = await genresResponse.json();
      const genreMap = new Map(
        (genresData.genres || []).map((genre) => [genre.id, genre.name])
      );

      setMovies(
        (moviesData.results || []).map((movie) => ({
          ...movie,
          genre_names: (movie.genre_ids || [])
            .map((genreId) => genreMap.get(genreId))
            .filter(Boolean),
        }))
      );
    } catch (fetchError) {
      setError(fetchError.message || "Unable to load movies.");
      setMovies([]);
    }
  };

  const handleFilter = (rate) => {
    setMinRating((prev) => (prev === rate ? 0 : rate));
  };

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleRate = (movieId, rating) => {
    setUserRatings((prev) => ({
      ...prev,
      [movieId]: rating,
    }));
  };

  const yearOptions = useMemo(() => {
    const years = new Set(
      movies
        .map((movie) => (movie.release_date ? movie.release_date.slice(0, 4) : null))
        .filter(Boolean)
    );
    return [...years].sort((a, b) => Number(b) - Number(a));
  }, [movies]);

  const filteredMovies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return movies.filter((movie) => {
      const title = (movie.title || "").toLowerCase();
      const matchesSearch = !query || title.includes(query);
      const matchesRating =
        minRating === 0 || Number(movie.vote_average || 0) / 2 >= minRating;
      const matchesYear =
        selectedYear === "all" || movie.release_date?.slice(0, 4) === selectedYear;

      return matchesSearch && matchesRating && matchesYear;
    });
  }, [movies, searchTerm, minRating, selectedYear]);

  const visibleMovies = useMemo(() => {
    return [...filteredMovies].sort((a, b) => {
      if (sort.by === "year") {
        const dateA = Number(a.release_date?.slice(0, 4) || 0);
        const dateB = Number(b.release_date?.slice(0, 4) || 0);
        return sort.order === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (sort.by === "rating") {
        const ratingA = Number(a.vote_average || 0);
        const ratingB = Number(b.vote_average || 0);
        return sort.order === "asc" ? ratingA - ratingB : ratingB - ratingA;
      }

      if (sort.by === "title") {
        return sort.order === "asc"
          ? (a.title || "").localeCompare(b.title || "")
          : (b.title || "").localeCompare(a.title || "");
      }

      return 0;
    });
  }, [filteredMovies, sort]);

  return (
    <section className="movie_list" id={type}>
      <header className="align_center movie_list_header">
        <h2 className="align_center movie_list_heading">
          {title}{" "}
          <img src={emoji} alt={`${emoji} icon`} className="navbar_emoji" />
        </h2>

        <div className="align_center movie_list_fs">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movies by title"
            className="movie_search_bar"
            aria-label="Search movies by title"
          />

          <label className="sort_label">
            Year
            <select
              name="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="movie_sorting"
            >
              <option value="all">All Years</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="sort_label">
            Rating
            <FilterGroup
              minRating={minRating}
              onRatingClick={handleFilter}
              ratings={[9, 8, 7]}
            />
          </label>

          <div className="sort_group">
            <label className="sort_label">
              Sort by
              <select
                name="by"
                onChange={handleSort}
                value={sort.by}
                className="movie_sorting"
              >
                <option value="default">Default</option>
                <option value="year">Year</option>
                <option value="rating">Rating</option>
                <option value="title">Title</option>
              </select>
            </label>
            <label className="sort_label">
              Order
              <select
                name="order"
                onChange={handleSort}
                value={sort.order}
                className="movie_sorting"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      <div className="movie_cards">
        {error && <p className="movie_empty_state">{error}</p>}
        {visibleMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            userRating={userRatings[movie.id] ?? 0}
            onRate={handleRate}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieList;
