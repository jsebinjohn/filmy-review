import { Routes, Route, useParams } from "react-router-dom";

import "./App.css";
import Fire from "./assets/fire.png";
import Star from "./assets/star.png";
import Party from "./assets/sun.png";
import Navbar from "./components/Navbar/Navbar";
import MovieList from "./components/MovieList/MovieList";
import MovieDetail from "./components/MovieDetail/MovieDetail";

const Home = () => (
    <>
        <MovieList type="popular" title="Popular" emoji={Fire} />
        <MovieList type="top_rated" title="Top Rated" emoji={Star} />
        <MovieList type="upcoming" title="Upcoming" emoji={Party} />
    </>
);

const MovieDetailRoute = () => {
    const { id } = useParams();
    return <MovieDetail key={id} />;
};

const App = () => {
    return (
        <div className="app">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetailRoute />} />
            </Routes>
        </div>
    );
};

export default App;