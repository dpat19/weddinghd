import React,{ Component } from 'react'

import './App.css'
import LandingPage from './Landing/Landing'
import Navbar from './Navbar/Navbar';
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import Rsvp from './Rsvp/Rsvp';
import Photo from './Photo/Photo';


class App extends Component{
  render(){
    
    return(
      
      <>
      {/* The Navbar will be shown across all routes */}
      <Navbar />

      {/* Define your routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/weddinghd/rsvp" element={<Rsvp />} />
        <Route path="/weddinghd/photos" element={<Photo />} />
      </Routes>
    </>
    );
  }
}




export default App
