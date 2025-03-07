
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar'
import './Landing.css'
import hd from "../assets/HDW-07.png"
import words from "../assets/Differet.png"


//63,18,-0


const Countdown = () => {
    // Set the target date (May 9th, 2026)
    const targetDate = new Date("May 9, 2026 00:00:00").getTime();
  
    // State to store the remaining days
    const [daysLeft, setDaysLeft] = useState(0);
  
    useEffect(() => {
      // Update the countdown every second (to track the passing time)
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
  
        // Calculate the remaining days
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  
        // Set the remaining days to state
        setDaysLeft(days);
  
        // Clear the interval when countdown finishes
        if (distance < 0) {
          clearInterval(interval);
          setDaysLeft(0);
        }
      }, 1000); // Update every second
  
      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }, [targetDate]); // Only update on targetDate change
  
    return <span>{daysLeft} </span>;
  };
const landing = () => {
    

    return (
    <><div className='image-container'>
      

            <img src={hd} className='image' alt='pic' />
            <img src={words} className='image' />
    
        </div>
        <div className='text'>
            <p>
                May 9,2026 Little Egg Harbor Township , NJ
             </p>
             <p>
             <Countdown />Days to gos!
             </p>

        
        </div>
       

        
    </>
    )
}


export default landing