import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Progress, Collapse } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { RiCalendarEventLine, RiMapPin2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import "./Rsvp.css";

const { Title } = Typography;
const { Panel } = Collapse;

// Define your custom order for events.
const eventOrder = [
  "HernishaMehndi",
  "HernishaPithi",
  "DhruvPithi",
  "Sangeet",
  "WeddingCeremony",
  "AfterParty"
];

const Rsvp = () => {
  // Steps:
  // Step 1: Access code page.
  // Steps 2 .. (1 + numberOfEvents): One event page per event.
  // Final step (step === totalSteps): Summary page.
  const [step, setStep] = useState(1);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]); // Family member user docs.
  const [filteredEvents, setFilteredEvents] = useState([]); // Sorted events relevant to the family.
  // Local RSVP responses: { eventId: { userId: "Yes" | "No" | "pending" } }
  const [rsvpResponses, setRsvpResponses] = useState({});
  const [allEvents, setAllEvents] = useState([]);
  const navigate = useNavigate();

  // Total steps: 1 (access code) + number of event pages + 1 (summary).
  const totalSteps = 1 + filteredEvents.length + 1;
  const progressPercent = totalSteps > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 0;

  // Fetch all events on mount.
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const eventsArr = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllEvents(eventsArr);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchAllEvents();
  }, []);

  // Step 1: Validate access code, fetch family members, filter/sort events, and initialize RSVP state.
  const handleValidateAccessCode = async () => {
    if (!accessCode) {
      setError("Please enter an access code.");
      return;
    }
    try {
      const famQuery = query(
        collection(db, "families"),
        where("accessCode", "==", accessCode)
      );
      const famSnapshot = await getDocs(famQuery);
      if (famSnapshot.empty) {
        setError("Invalid access code.");
        return;
      }
      const famDoc = famSnapshot.docs[0];
      const famData = famDoc.data();
      const memberIds = famData.members || [];
      if (memberIds.length === 0) {
        setError("No family members found for this access code.");
        return;
      }
      const usersQuery = query(
        collection(db, "users"),
        where("__name__", "in", memberIds)
      );
      const usersSnapshot = await getDocs(usersQuery);
      const members = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFamilyMembers(members);

      // Filter events: keep only events where at least one family member is invited.
      const relevantEvents = allEvents.filter(event =>
        members.some(member => member.events && member.events.includes(event.id))
      );
      if (relevantEvents.length === 0) {
        setError("None of your family members are invited to any events.");
        return;
      }
      // Sort events based on custom order.
      const sortedEvents = relevantEvents.sort((a, b) => {
        return eventOrder.indexOf(a.id) - eventOrder.indexOf(b.id);
      });
      setFilteredEvents(sortedEvents);

      // Initialize RSVP responses, prepopulated from each user's saved rsvp object.
      const initialResponses = {};
      sortedEvents.forEach(event => {
        initialResponses[event.id] = {};
        members.forEach(member => {
          if (member.events && member.events.includes(event.id)) {
            initialResponses[event.id][member.id] =
              member.rsvp && member.rsvp[event.id]
                ? member.rsvp[event.id]
                : "pending";
          }
        });
      });
      setRsvpResponses(initialResponses);

      setError("");
      // If any RSVP is already saved (not pending), show summary; otherwise, start with event pages.
      let hasSavedResponse = false;
      for (const evtId in initialResponses) {
        for (const uid in initialResponses[evtId]) {
          if (initialResponses[evtId][uid] !== "pending") {
            hasSavedResponse = true;
            break;
          }
        }
        if (hasSavedResponse) break;
      }
      if (hasSavedResponse) {
        setStep(2 + sortedEvents.length); // Go directly to summary.
      } else {
        setStep(2);
      }
    } catch (error) {
      console.error("Error validating access code:", error);
      setError("Error fetching data. Please try again.");
    }
  };

  // Handler for Accept/Decline buttons.
  const handleResponse = async (eventId, userId, response) => {
    const rsvpValue = response === "accept" ? "Yes" : "No";
    setRsvpResponses(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [userId]: rsvpValue
      }
    }));
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        [`rsvp.${eventId}`]: rsvpValue
      });
    } catch (error) {
      console.error("Error updating user RSVP:", error);
    }
    try {
      const member = familyMembers.find(m => m.id === userId);
      const userName = member ? member.name : userId;
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        [`rsvpList.${userName}`]: rsvpValue
      });
    } catch (error) {
      console.error("Error updating event RSVPList:", error);
    }
  };

  // Navigation handlers.
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    navigate("/weddinghd");
  };

  // Render event page for event at index (step - 2)
  const renderEventPage = (eventObj) => {
    const invitedMembers = familyMembers.filter(member =>
      member.events && member.events.includes(eventObj.id)
    );
    return (
      <>
        <Title
          level={3}
          className="rsvp-form-title"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: "rgb(126,116,115)",
            fontSize: "45px"
          }}
        >
          {eventObj.title}
        </Title>
        <p className="rsvp-event-details">
          <RiCalendarEventLine className="icon" />
          <strong>{eventObj.date}</strong>
        </p>
        <p className="rsvp-event-details">
          <RiMapPin2Line className="icon" />
          <strong>{eventObj.location}</strong>
        </p>
        <div className="rsvp-guests-container">
          {invitedMembers.length > 0 ? (
            invitedMembers.map(member => (
              <div key={member.id} className="rsvp-guest">
                <p className="rsvp-guest-name">{member.name}</p>
                <div className="rsvp-options">
                  <Button
                    className={`rsvp-option-button accept ${rsvpResponses[eventObj.id]?.[member.id] === "Yes" ? "selected" : ""}`}
                    onClick={() => handleResponse(eventObj.id, member.id, "accept")}
                  >
                    Accept{" "}
                    {rsvpResponses[eventObj.id]?.[member.id] === "Yes" && (
                      <CheckOutlined style={{ marginLeft: 8 }} />
                    )}
                  </Button>
                  <Button
                    className={`rsvp-option-button decline ${rsvpResponses[eventObj.id]?.[member.id] === "No" ? "selected" : ""}`}
                    onClick={() => handleResponse(eventObj.id, member.id, "decline")}
                  >
                    Decline{" "}
                    {rsvpResponses[eventObj.id]?.[member.id] === "No" && (
                      <CheckOutlined style={{ marginLeft: 8 }} />
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No family members are invited to this event.</p>
          )}
        </div>
        <div className="rsvp-buttons">
          <Button className="rsvp-back" onClick={handleBack}>Back</Button>
          <Button type="primary" className="rsvp-continue-button" onClick={handleNext}>
            {step < totalSteps - 1 ? "Next" : "Finish"}
          </Button>
        </div>
      </>
    );
  };

  // Render final summary page.
  const renderSummaryPage = () => {
    return (
      <>
        <Title
          level={3}
          style={{
            textAlign: "center",
            fontFamily: "'Dancing Script', cursive",
            color: "rgb(126,116,115)"
          }}
        >
          All Set! Here’s what we sent Hernisha & Dhruv.
        </Title>
        <div className="summary-container">
          {filteredEvents.map(eventObj => {
            const invited = familyMembers.filter(
              m => m.events && m.events.includes(eventObj.id)
            );
            return (
              <div key={eventObj.id} className="summary-event">
                <Title
                  level={4}
                  style={{
                    textAlign: "center",
                    fontFamily: "'Dancing Script', cursive",
                    fontWeight: "bold",
                    color: "rgb(126,116,115)"
                  }}
                >
                  {eventObj.title}
                </Title>
                {invited.map(member => {
                  const response = rsvpResponses[eventObj.id]?.[member.id];
                  return (
                    <p key={member.id}>
                      {member.name}:{" "}
                      {response === "Yes"
                        ? "Going"
                        : response === "No"
                        ? "Not Going"
                        : "Pending"}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="summary-buttons">
          <Button
            type="primary"
            className="rsvp-continue-button"
            onClick={() => setStep(2)}
          >
            Change RSVP
          </Button>
          <Button
          type="primary"
          className="rsvp-continue-button"
          onClick={() => navigate("/wedddinghd/itinerary", { state: { accessCode } })}
        >
            Show Your Itinerary
          </Button>
          <Button
            type="primary"
            className="rsvp-continue-button"
            onClick={() => navigate("/weddinghd")}
          >
            BACK TO HOMEPAGE
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="rsvp-container">
      <div className="rsvp-header">
        <Progress
          percent={progressPercent}
          showInfo={false}
          className="rsvp-progress"
          trailColor="rgb(233,233,237)"
          strokeColor="rgb(126,116,115)"
        />
        <CloseOutlined className="rsvp-exit" onClick={handleClose} />
      </div>

      {step === 1 && (
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
            value={accessCode}
            onChange={(e) => {
              setAccessCode(e.target.value);
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
      )}

      {step >= 2 && step < totalSteps && filteredEvents.length > 0 && renderEventPage(filteredEvents[step - 2])}

      {step === totalSteps && renderSummaryPage()}
    </div>
  );
};

export default Rsvp;
