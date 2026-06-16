import React, { useEffect, useMemo, useState } from "react";

import "./MovieList.css";
import MovieCard from "./MovieCard";
import FilterGroup from "./FilterGroup";

const MovieList = ({ type, title, emoji }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState({
    by: "default",
    order: "asc",
  });
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, [type]);

  const fetchMovies = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${type}?api_key=183928bab7fc630ed0449e4f66ec21bd`
    );
    const data = await response.json();
    setMovies(data.results || []);
  };

  const fetchGenres = async () => {
    const response = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=183928bab7fc630ed0449e4f66ec21bd"
    );
    const data = await response.json();

    const genreMap = Object.fromEntries(
      (data.genres || []).map((genre) => [genre.id, genre.name])
    );

    setGenres(genreMap);
  };

  const handleFilter = (rate) => {
    setMinRating((prev) => (prev === rate ? 0 : rate));
  };

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort((prev) => ({ ...prev, [name]: value }));
  };

  const handleRate = (movieId, rating) => {
    setUserRatings((prev) => ({
      ...prev,
      [movieId]: rating,
    }));
  };

  const filteredMovies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return movies.filter((movie) => {
      const matchesSearch = !query || movie.original_title.toLowerCase().includes(query);
      const matchesRating = minRating === 0 || movie.vote_average >= minRating;

      return matchesSearch && matchesRating;
    });
  }, [movies, searchTerm, minRating]);

  const visibleMovies = useMemo(() => {
    return [...filteredMovies].sort((a, b) => {
      if (sort.by === "release_date") {
        const dateA = new Date(a.release_date || 0).getTime();
        const dateB = new Date(b.release_date || 0).getTime();
        return sort.order === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (sort.by === "vote_average") {
        return sort.order === "asc"
          ? a.vote_average - b.vote_average
          : b.vote_average - a.vote_average;
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

          <FilterGroup
            minRating={minRating}
            onRatingClick={handleFilter}
            ratings={[8, 7, 6]}
          />

          <select
            name="by"
            id=""
            onChange={handleSort}
            value={sort.by}
            className="movie_sorting"
          >
            <option value="default">SortBy</option>
            <option value="release_date">Date</option>
            <option value="vote_average">Rating</option>
          </select>
          <select
            name="order"
            id=""
            onChange={handleSort}
            value={sort.order}
            className="movie_sorting"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </header>

      <div className="movie_cards">
        {visibleMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            genreMap={genres}
            userRating={userRatings[movie.id] ?? 0}
            onRate={handleRate}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieList;