import React from "react";

import "./Navbar.css";
import Fire from "../../assets/fire.png";
import Star from "../../assets/star.png";
import Party from "../../assets/sun.png";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Filmy Review</h1>

            <div className="navbar_links">
                <a href="#popular">
                    Popular <img src={Fire} alt="Fire emoji" className="navbar_emoji" />
                </a>
                <a href="#top_rated">
                    Top Rated <img src={Star} alt="Star emoji" className="navbar_emoji" />
                </a>
                <a href="#upcoming">
                    Upcoming <img src={Party} alt="Party emoji" className="navbar_emoji" />
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
