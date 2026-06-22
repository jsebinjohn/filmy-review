import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./MovieCard.css";
import Star from "../../assets/star.png";

const fallbackPoster = "/movie.png";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const getPosterUrl = (posterPath) => {
    return posterPath ? `${TMDB_IMAGE_BASE}/w500${posterPath}` : null;
};

const MovieCard = ({ movie, userRating = 0, onRate = () => {} }) => {
    const [imageError, setImageError] = useState(false);
    const releaseYear = movie.release_date?.slice(0, 4) || "TBA";
    const title = movie.title || "Untitled";
    const movieGenres = movie.genre_names?.join(", ") || "";
    const overviewText = movie.overview
        ? `${movie.overview.slice(0, 100)}...`
        : "Overview not available.";
    const posterUrl = getPosterUrl(movie.poster_path);
    const imageSrc = !imageError && posterUrl ? posterUrl : fallbackPoster;

    useEffect(() => {
        setImageError(false);
    }, [movie.id, posterUrl]);

    return (
        <Link to={`/movie/${movie.id}`} className="movie_card">
            <img
                src={imageSrc}
                alt={`${title} poster`}
                className={`movie_poster ${imageSrc === fallbackPoster ? "movie_poster_fallback" : ""}`}
                onError={() => setImageError(true)}
            />

            <div className="movie_details">
                <h3 className="movie_details_heading">{title}</h3>
                <div className="align_center movie_date_rate">
                    <p>{releaseYear}</p>
                    <p className="align_center">
                        {movie.vote_average ? movie.vote_average.toFixed(1) : "-"}
                        <img src={Star} alt="rating icon" className="card_emoji" />
                    </p>
                </div>
                <p className="movie_description">
                    {movieGenres}
                </p>
                <p className="movie_description">
                    {overviewText}
                </p>
                <div className="movie_rating_block">
                    <span className="movie_rating_label">
                        Your rating /10

                        {userRating > 0 && <span className="movie_rating_value">- {userRating}</span>}
                    </span>
                    <div className="movie_stars" onClick={(e) => e.stopPropagation()}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <button
                                key={value}
                                type="button"
                                className={`movie_star ${value <= userRating ? "active" : ""}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onRate(movie.id, value);
                                }}
                                aria-label={`Rate ${title} ${value} out of 10`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
