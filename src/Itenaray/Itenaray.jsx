import React, { useState, useEffect } from "react";
import { Typography, Spin, Button, Input } from "antd";
import SwipeableViews from "react-swipeable-views";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { RiCalendarEventLine, RiMapPin2Line } from "react-icons/ri";

import IconButton from "@mui/material/IconButton";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from "@mui/lab";
import "./Itinerary.css";
import hd from "../assets/HDW-07.png";

const { Title, Text } = Typography;

// Custom order for events.
const eventOrder = [
  "HernishaMehndi",
  "HernishaPithi",
  "DhruvPithi",
  "Sangeet",
  "WeddingCeremony",
  "AfterParty",
];

const Itinerary = () => {
  const location = useLocation();
  // Initialize access code from location state if provided; otherwise, start empty.
  const [accessCode, setAccessCode] = useState(location.state?.accessCode || "");
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0); // current swipe index
  const [shake, setShake] = useState(true); // shake animation state

  // Function to validate access code.
  const handleValidateAccessCode = () => {
    if (!accessCodeInput.trim()) {
      setError("Please enter an access code.");
      return;
    }
    setAccessCode(accessCodeInput.trim());
    setError("");
  };

  // Fetch all events on mount.
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const eventsArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllEvents(eventsArr);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchAllEvents();
  }, []);

  // Once all events are fetched, get family and users when accessCode is available.
  useEffect(() => {
    const fetchFamilyAndUsers = async () => {
      if (!accessCode) return;
      try {
        const famQuery = query(
          collection(db, "families"),
          where("accessCode", "==", accessCode)
        );
        const famSnapshot = await getDocs(famQuery);
        if (famSnapshot.empty) {
          setError("Invalid access code.");
          setLoading(false);
          return;
        }
        const famDoc = famSnapshot.docs[0];
        const famData = famDoc.data();
        const memberIds = famData.members || [];
        if (memberIds.length === 0) {
          setError("No family members found for this access code.");
          setLoading(false);
          return;
        }
        const usersQuery = query(
          collection(db, "users"),
          where("__name__", "in", memberIds)
        );
        const usersSnapshot = await getDocs(usersQuery);
        const members = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFamilyMembers(members);
        const relevantEvents = allEvents.filter((event) =>
          members.some((member) => member.events && member.events.includes(event.id))
        );
        const sortedEvents = relevantEvents.sort(
          (a, b) => eventOrder.indexOf(a.id) - eventOrder.indexOf(b.id)
        );
        setFilteredEvents(sortedEvents);
      } catch (err) {
        console.error("Error fetching family or users:", err);
        setError("Error fetching data. Please try again.");
      }
      setLoading(false);
    };

    if (allEvents.length > 0 && accessCode) {
      fetchFamilyAndUsers();
    }
  }, [accessCode, allEvents]);

  // Remove shake effect after 2 seconds.
  useEffect(() => {
    const timer = setTimeout(() => {
      setShake(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChangeIndex = (newIndex) => {
    setIndex(newIndex);
  };

  // If no access code is provided, show the access code step.
  if (!accessCode) {
    return (
      <div className="rsvp-container">
        <div className="access-code-step">
          <Title
            level={2}
            className="rsvp-form-title"
            style={{ fontFamily: "'EB Garamond', serif", color: "rgb(126,116,115)" }}
          >
            Enter Your Access Code
          </Title>
          <Input
            placeholder="Access Code"
            maxLength={10}
            value={accessCodeInput}
            onChange={(e) => {
              setAccessCodeInput(e.target.value);
              if (error) setError("");
            }}
            className={`rsvp-input ${error ? "error" : ""}`}
          />
          {error && <div className="error-message">{error}</div>}
          <Button
            type="primary"
            className="rsvp-continue-button"
            onClick={handleValidateAccessCode}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="itinerary-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="itinerary-container">
        <Title level={3}>{error}</Title>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="itinerary-container">
        <Title level={3}>No events available for your invitation.</Title>
      </div>
    );
  }

  return (
    <div className="itinerary-container">
      <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
        {filteredEvents.map((event) => (
          <div key={event.id} className={`swipe-event-slide ${shake ? "shake" : ""}`}>
            <Title
              level={1}
              className="rsvp-form-title"
              style={{
                fontFamily: "'Dancing Script', cursive",
                color: "rgb(126,116,115)",
              }}
            >
              {event.title}
            </Title>
            <Timeline position="alternate">
              <TimelineItem>
                <TimelineOppositeContent
                  sx={{ m: "auto 0", color: "rgb(126,116,115)"  }}
                  align="right"
                  variant="body2"
                  style={{ fontFamily: "'EB Garamond', serif"}}
                >
                  {event.StreetAddress}
                  <Typography variant="body2" className="itinerary-event-detail" style={{ fontFamily: "'EB Garamond', serif",  color: "rgb(126,116,115)" }}>
                  {event.City}
                  </Typography>
                </TimelineOppositeContent>
                
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot sx={{ bgcolor: "rgb(126,116,115)" }}>
                    <MapOutlinedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: "50px", px: 2 }}>
                  <Typography variant="body2" className="itinerary-event-detail">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${event.StreetAddress}, ${event.City}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "inherit", textDecoration: "underline" , fontFamily: "'EB Garamond', serif"}}
                    >
                      {event.location}
                    </a>
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent
                  sx={{ m: "auto 0" }}
                  align="right"
                  variant="body2"
                  color="text.secondary"
                  style={{ fontFamily: "'EB Garamond', serif"}}
                >
                  {event.StartTime} - {event.EndTime}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot sx={{ bgcolor: "rgb(126,116,115)" }}>
                    <AccessTimeOutlinedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: "50px", px: 2 }}>
                  <Typography variant="body2" className="itinerary-event-detail" style={{ fontFamily: "'EB Garamond', serif"}}>
                    Meal Time: {event.mealTime || "N/A"}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent
                  sx={{ m: "auto 0" }}
                  align="right"
                  variant="body2"
                  color="text.secondary"
                  style={{ fontFamily: "'EB Garamond', serif"}}
                >
                  {event.dressCode || "Standard"}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot sx={{ bgcolor: "rgb(126,116,115)" }}>
                    <CheckroomOutlinedIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: "50px", px: 2 }} >
                  <Typography style={{ fontFamily: "'EB Garamond', serif"}}>Dress Code</Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
        ))}
      </SwipeableViews>
      {/* Navigation container for larger screens */}
      <div className="swipe-nav">
        <IconButton
          disabled={index === 0}
          onClick={() => handleChangeIndex(index - 1)}
          className="nav-arrow"
          size="small"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <IconButton
          disabled={index === filteredEvents.length - 1}
          onClick={() => handleChangeIndex(index + 1)}
          className="nav-arrow"
          size="small"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </div>
      {/* Decorative image fixed at the bottom */}
      <div className="mobile-decorative">
        <img src={hd} alt="Decoration" className="overlay-image" />
      </div>
    </div>
  );
};

export default Itinerary;
