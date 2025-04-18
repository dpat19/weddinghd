import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Navbar.css';


import hd from "../assets/HDW-07.png";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const handleLinkClick = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  // Close the menu if clicking outside the navbar (optional)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-container">
        {/* Hamburger icon that transitions to an X */}
        <div 
          className={`menu-icon ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>

      {/* Fullscreen overlay menu */}
      <div className={`overlay-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="overlay-nav-list">
          <li className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}>
            <Link to="/weddinghd" className="nav-link" onClick={() => handleLinkClick('home')}>
              Home
            </Link>
          </li>
          <li className={`nav-item ${activeTab === 'Photos' ? 'active' : ''}`}>
            <Link to="/weddinghd/photos" className="nav-link" onClick={() => handleLinkClick('Photos')}>
              Photos
            </Link>
          </li>
          <li className={`nav-item ${activeTab === 'RSVP' ? 'active' : ''}`}>
            <Link to="/weddinghd/rsvp" className="nav-link" onClick={() => handleLinkClick('RSVP')}>
              RSVP
            </Link>
          </li>
          <li className={`nav-item ${activeTab === 'FAQ' ? 'active' : ''}`}>
            <Link to="/wedddinghd/itinerary" className="nav-link" onClick={() => handleLinkClick('Itineray')}>
              Itinerary
            </Link>
          </li>
          <li className={`nav-item ${activeTab === 'Itineray' ? 'active' : ''}`}>
          <Link to="/weddinghd/faq" className="nav-link" onClick={() => handleLinkClick('FAQ')}>
              FAQ
            </Link>
          </li>
        </ul>
        <img src={hd} alt="Decoration" className="overlay-image" />
      </div>
      <Outlet />
    </nav>
  );
};

export default Navbar;
