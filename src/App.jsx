import React, { useEffect } from 'react';
import './App.css';
import LandingPage from './Landing/Landing';
import Navbar from './Navbar/Navbar';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Rsvp from './Rsvp/Rsvp';
import Photo from './Photo/Photo';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Add the 'home' class to the body if we are on the homepage
    if (location.pathname === '/') {
      document.body.classList.add('home');
    } else {
      document.body.classList.remove('home');
    }
  }, [location]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/weddinghd/rsvp" element={<Rsvp />} />
        <Route path="/weddinghd/photos" element={<Photo />} />
      </Routes>
    </>
  );
}

export default App;
