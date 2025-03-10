import React,{ Component } from 'react'

import './App.css'
import LandingPage from './Landing/Landing'
import Navbar from './Navbar/Navbar';
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import Rsvp from './Rsvp/Rsvp';


class App extends Component{
  render(){
    
    return(
      <div>
        <Navbar>
        <BrowserRouter>
        <Routes>        
          <Route path="/" element={<LandingPage />}>
            <Route path="weddinghd/rsvp"  element={<Rsvp />}/>
          </Route>
          
        </Routes>
        </BrowserRouter>
        </Navbar>
        <LandingPage></LandingPage>
        
        
      </div>
    );
  }
}




export default App
