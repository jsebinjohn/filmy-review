import React from "react";

import "./MovieCard.css";
import Star from "../../assets/star.png";

const MovieCard = ({ movie, genreMap = {}, userRating = 0, onRate = () => {} }) => {
    const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "TBA";
    const movieGenres = (movie.genre_ids || [])
        .slice(0, 2)
        .map((id) => genreMap[id])
        .filter(Boolean)
        .join(" • ");

    return (
        <a
            href={`https://www.themoviedb.org/movie/${movie.id}`}
            target="_blank"
            rel="noreferrer"
            className="movie_card"
        >
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt="movie poster"
                className="movie_poster"
            />

            <div className="movie_details">
                <h3 className="movie_details_heading">{movie.original_title}</h3>
                <div className="align_center movie_date_rate">
                    <p>{releaseYear}</p>
                    <p className="align_center">
                        {movie.vote_average}
                        <img src={Star} alt="rating icon" className="card_emoji" />
                    </p>
                </div>
                <p className="movie_description">
                    {movieGenres || "Drama • Adventure"}
                </p>
                <p className="movie_description">
                    {movie.overview.slice(0, 100)}...
                </p>

                <div className="movie_rating_block">
                    <span className="movie_rating_label">
                        Your rating /10
                        {userRating > 0 && <span className="movie_rating_value">• {userRating}</span>}
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
                                aria-label={`Rate ${movie.original_title} ${value} out of 10`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </a>
    );
};

export default MovieCard;
