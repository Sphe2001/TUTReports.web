import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import AnotherIcon from "../../assets/TUT-White-Landscape25.png";
import "./navigationBar.css";

const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-logo">
          <Link to="/home" className="navbar-brand">
            <img className="navbar-logo-img" alt="TUT icon" src={AnotherIcon} />

            <span className="navbar-separator"></span>
            <span className="navbar-title">TUT-REPORTHUB</span>
          </Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact-us">Contact Us</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavigationBar;
