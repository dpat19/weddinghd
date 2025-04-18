import React, { useEffect } from 'react';
import './App.css';
import LandingPage from './Landing/Landing';
import Navbar from './Navbar/Navbar';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Rsvp from './Rsvp/Rsvp';
import PostData from './PostData/PostData';
import Photo from './Photo/Photo';
import Itinerary from './Itenaray/Itenaray';
import UploadPhoto from './PostData/photupload';
import Faq from './Faq/Faq';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Add the 'home' class to the body if we are on the homepage
    if (location.pathname === '/weddinghd' || location.pathname === '/weddinghd/photos'  || location.pathname === '/weddinghd/'  ) {
      document.body.classList.add('home');
    } else {
      document.body.classList.remove('home');
    }
  }, [location]);

  return (
    <>
       {location.pathname !== '/weddinghd/rsvp' && <Navbar />}

      <Routes>
        <Route path="/weddinghd" element={<LandingPage />} />
        <Route path="/weddinghd/rsvp" element={<Rsvp />} />
        <Route path="/weddinghd/photos" element={<Photo />} />
        <Route path="/wedddinghd/itinerary" element={<Itinerary/>}/>
        <Route path="/weddinghd/faq" element={<Faq />}/>
      </Routes>
    </>
  );
}

export default App;
