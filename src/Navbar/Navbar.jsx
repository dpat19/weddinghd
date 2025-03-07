import React, { useState } from 'react';
import './Navbar.css'; // Assuming you have the CSS in a separate file

const Navbar = () => {
    const [activeTab, setActiveTab] = useState('home'); // Default active tab is 'home'

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li
                    className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('home')}
                >
                    <a href="#" className="nav-link">Home</a>
                </li>
                <li
                    className={`nav-item ${activeTab === 'Our Story' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Our Story')}
                >
                    <a href="#" className="nav-link">Our Story</a>
                </li>
                <li
                    className={`nav-item ${activeTab === 'RSVP' ? 'active' : ''}`}
                    onClick={() => setActiveTab('RSVP')}
                >
                    <a href="#" className="nav-link">RSVP</a>
                </li>
                <li
                    className={`nav-item ${activeTab === 'FAQ' ? 'active' : ''}`}
                    onClick={() => setActiveTab('FAQ')}
                >
                    <a href="#" className="nav-link">FAQ</a>
                </li>
                <li
                    className={`nav-item ${activeTab === 'FAQ' ? 'active' : ''}`}
                    onClick={() => setActiveTab('FAQ')}
                >
                    <a href="#" className="nav-link">FAQ</a>
                </li>
                <li
                    className={`nav-item ${activeTab === 'FAQ' ? 'active' : ''}`}
                    onClick={() => setActiveTab('FAQ')}
                >
                    <a href="#" className="nav-link">FAQ</a>
                </li>
                <li
                    className={`nav-item ${activeTab === 'FAQ' ? 'active' : ''}`}
                    onClick={() => setActiveTab('FAQ')}
                >
                    <a href="#" className="nav-link">FAQ</a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
