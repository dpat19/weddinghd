import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import "./Landing.css";
import hd from "../assets/HDW-07.png";
import words from "../assets/Differet.png";

//63,18,-0

const Countdown = () => {
  const targetDate = new Date("May 9, 2026 00:00:00").getTime();

  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));

      setDaysLeft(days);

      if (distance < 0) {
        clearInterval(interval);
        setDaysLeft(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return <span>{daysLeft} </span>;
};
const landing = () => {
  return (
    <>
      <div className="image-container">
        <img src={hd} className="image" alt="pic" />
        <img src={words} className="image" />
      </div>
      <div className="text">
        <p>May 9,2026 Little Egg Harbor Township , NJ</p>
        <p>
          <Countdown />
          Days to go!
        </p>
      </div>
    </>
  );
};

export default landing;
