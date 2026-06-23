import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./MovieDetail.css";
import Star from "../../assets/star.png";

const fallbackPoster = "/movie.png";
const API_KEY = "183928bab7fc630ed0449e4f66ec21bd";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const getPosterUrl = (posterPath) => {
  return posterPath ? `${TMDB_IMAGE_BASE}/w780${posterPath}` : null;
};

const getSavedMovieData = (id) => {
  const saved = JSON.parse(
    localStorage.getItem("filmy-review-movie-data") || "{}"
  );
  return saved[id] || {};
};

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [userRating, setUserRating] = useState(() => getSavedMovieData(id).rating || 0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState(() => {
    const savedReviews = getSavedMovieData(id).reviews;
    return Array.isArray(savedReviews) ? savedReviews : [];
  });

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);
      setError("");
      setImageError(false);

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Unable to load movie details.");
        }

        const data = await response.json();

        // TMDB /movie/{id} does not include credits by default.
        // Fetch credits so cast information is available.
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
        );
        if (creditsResponse.ok) {
          const credits = await creditsResponse.json();
          setMovie({ ...data, credits });
        } else {
          setMovie(data);
        }
      } catch (fetchError) {
        setError(fetchError.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  const saveMovieData = (updatedData) => {
    const current = JSON.parse(localStorage.getItem("filmy-review-movie-data") || "{}");
    const nextData = {
      ...current,
      [id]: {
        ...current[id],
        ...updatedData,
      },
    };

    localStorage.setItem("filmy-review-movie-data", JSON.stringify(nextData));
  };

  const handleRate = (rating) => {
    setUserRating(rating);
    saveMovieData({ rating, reviews });
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();

    if (!reviewText.trim()) {
      return;
    }

    const nextReviews = [
      ...reviews,
      {
        id: Date.now(),
        text: reviewText.trim(),
        createdAt: new Date().toLocaleString(),
      },
    ];

    setReviews(nextReviews);
    setReviewText("");
    saveMovieData({ rating: userRating, reviews: nextReviews });
  };

  if (loading) {
    return <div className="movie_detail_page">Loading movie details...</div>;
  }

  if (error) {
    return (
      <div className="movie_detail_page error_state">
        <p>{error}</p>
        <div className="detail_navigation">
          <Link to="/" className="home_link">
            Home
          </Link>
          <button type="button" className="back_button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const releaseYear = movie?.release_date?.slice(0, 4) || "TBA";
  const posterUrl = getPosterUrl(movie?.poster_path, "w780");
  const imageSrc = !imageError && posterUrl ? posterUrl : fallbackPoster;
  const cast = movie?.credits?.cast?.slice(0, 5) || [];

  return (
    <main className="movie_detail_page">
      <div className="detail_navigation">
        <Link to="/" className="home_link">
          Home
        </Link>
        <button type="button" className="back_button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <section className="movie_detail_content">
        <div className="movie_detail_poster">
          <img
            src={imageSrc}
            alt={`${movie.title || "Movie"} poster`}
            className={imageSrc === fallbackPoster ? "movie_detail_poster_fallback" : ""}
            onError={() => setImageError(true)}
          />
        </div>

        <div className="movie_detail_info">
          <h1>{movie.title || "Untitled"}</h1>
          <p className="movie_detail_meta">
            {releaseYear} • {movie.runtime ? `${movie.runtime} min` : "—"} •{" "}
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            <img src={Star} alt="rating icon" className="detail_star_icon" />
          </p>

          <p className="movie_detail_genres">
            {(movie.genres || []).map((genre) => genre.name).join(", ")}
          </p>

          <div className="movie_detail_overview">
            <h2>Overview</h2>
            <p>{movie.overview || "Overview not available."}</p>
          </div>

          <div className="movie_detail_cast">
            <h2>Cast</h2>
            {cast.length === 0 ? (
              <p>No cast information available.</p>
            ) : (
              <ul>
                {cast.map((actor, index) => (
                  <li key={actor.cast_id || actor.id || index}>
                    <strong>{actor.name}</strong>
                    {actor.character ? ` as ${actor.character}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="movie_detail_actions">
            <div className="movie_detail_rating">
              <span>Your rating</span>
              <div className="movie_detail_stars">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={value <= userRating ? "active" : ""}
                    onClick={() => handleRate(value)}
                    aria-label={`Rate this movie ${value} out of 10`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {userRating > 0 && <p className="movie_detail_rating_text">Rated {userRating} / 10</p>}
            </div>

            <form className="movie_review_form" onSubmit={handleSubmitReview}>
              <label htmlFor="movieReview">Write a review</label>
              <textarea
                id="movieReview"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share what you liked about this movie..."
              />
              <button type="submit">Submit review</button>
            </form>
          </div>

          <div className="movie_review_list">
            <h2>Community reviews</h2>
            {reviews.length === 0 ? (
              <p className="empty_review_state">No reviews yet. Be the first to leave one.</p>
            ) : (
              reviews.map((review) => (
                <article key={review.id} className="movie_review_item">
                  <p>{review.text}</p>
                  <span>{review.createdAt}</span>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MovieDetail;

