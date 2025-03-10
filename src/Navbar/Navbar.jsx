import React, { useState } from 'react';
import './Navbar.css'; // Ensure this contains styles for .menu-icon and .nav-list.show
import { Link, Outlet } from 'react-router-dom';

const Navbar = () => {
    const [activeTab, setActiveTab] = useState('home'); // Default active tab is 'home'
    const [menuOpen, setMenuOpen] = useState(false); // State to manage mobile menu visibility

    return (
        <nav className="navbar">
            <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>
            <ul className={`nav-list ${menuOpen ? 'show' : ''}`}>
                <li className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('home'); setMenuOpen(false); }}>
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className={`nav-item ${activeTab === 'Photos' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('Photos'); setMenuOpen(false); }}>
                    <Link to="/weddinghd/photos" className="nav-link">Photos</Link>
                </li>
                <li className={`nav-item ${activeTab === 'RSVP' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('RSVP'); setMenuOpen(false); }}>
                    <Link to="/weddinghd/rsvp" className="nav-link">RSVP</Link>
                </li>
                <li className={`nav-item ${activeTab === 'FAQ' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('FAQ'); setMenuOpen(false); }}>
                    <Link href="#" className="nav-link">FAQ</Link>
                </li>
            </ul>
            <Outlet />
        </nav>
    );
};

export default Navbar;
