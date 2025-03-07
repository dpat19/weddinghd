import React,{ Component } from 'react'

import './App.css'
import LandingPage from './Landing/Landing'
import Navbar from './Navbar/Navbar';


class App extends Component{
  
   
  
  
  
  render(){
    
    return(
      <div>
        <LandingPage></LandingPage>
        <Navbar></Navbar>
        <img src='src/assets/SmallerPic.JPG'></img>
      </div>
    );
  }
}




export default App
