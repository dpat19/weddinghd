import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Progress, Modal } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { RiCalendarEventLine, RiMapPin2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";
import "./Rsvp.css";

const { Title } = Typography;

const eventOrder = [
  "HernishaMehndi",
  "HernishaPithi",
  "DhruvPithi",
  "Sangeet",
  "WeddingCeremony",
  "AfterParty"
];

const Rsvp = () => {
  const [step, setStep] = useState(1);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [rsvpResponses, setRsvpResponses] = useState({});
  const [allEvents, setAllEvents] = useState([]);
  const [familyDocId, setFamilyDocId] = useState(null);
  const navigate = useNavigate();

  // Email Modal state.
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");

  // Total steps: 1 (access code) + number of event pages + 1 (summary).
  const totalSteps = 1 + filteredEvents.length + 1;
  const progressPercent = totalSteps > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 0;

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
      setFamilyDocId(famDoc.id);
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

      const relevantEvents = allEvents.filter(event =>
        members.some(member => member.events && member.events.includes(event.id))
      );
      if (relevantEvents.length === 0) {
        setError("None of your family members are invited to any events.");
        return;
      }
      const sortedEvents = relevantEvents.sort((a, b) => {
        return eventOrder.indexOf(a.id) - eventOrder.indexOf(b.id);
      });
      setFilteredEvents(sortedEvents);

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

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleContinue = () => {
    if (step === totalSteps - 1) {
      // Show the email modal on the last event page.
      setShowEmailModal(true);
    } else {
      handleNext();
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

  // Updated email submission: close modal and render summary.
  const handleEmailSubmit = async () => {
    try {
      if (familyDocId && email.trim()) {
        await updateDoc(doc(db, "families", familyDocId), {
          contactEmail: email.trim()
        });
      }
    } catch (error) {
      console.error("Error updating family email:", error);
    }
    setShowEmailModal(false);
    setStep(totalSteps);
  };

  // Render event page.
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
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${eventObj.StreetAddress}, ${eventObj.City}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            <RiMapPin2Line className="icon" />
            <strong>{eventObj.location}</strong>
          </a>
        </p>
        <div className="rsvp-guests-container">
          {invitedMembers.length > 0 ? (
            invitedMembers.map(member => (
              <div key={member.id} className="rsvp-guest">
                <p className="rsvp-guest-name">{member.name}</p>
                <div className="rsvp-options">
                  <Button
                    className={`rsvp-option-button accept ${
                      rsvpResponses[eventObj.id]?.[member.id] === "Yes" ? "selected" : ""
                    }`}
                    onClick={() => handleResponse(eventObj.id, member.id, "accept")}
                  >
                    Accept{" "}
                    {rsvpResponses[eventObj.id]?.[member.id] === "Yes" && (
                      <CheckOutlined style={{ marginLeft: 8 }} />
                    )}
                  </Button>
                  <Button
                    className={`rsvp-option-button decline ${
                      rsvpResponses[eventObj.id]?.[member.id] === "No" ? "selected" : ""
                    }`}
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
          <Button type="primary" className="rsvp-continue-button" onClick={handleContinue}>
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
            onClick={() =>
              navigate("/wedddinghd/itinerary", { state: { accessCode } })
            }
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

      {/* Email Modal Popup */}
      <Modal
        title="Enter your email"
        visible={showEmailModal}
        onOk={handleEmailSubmit}
        onCancel={() => {
          setShowEmailModal(false);
          setStep(totalSteps);
        }}
        okText="Submit"
        cancelText="X"
      >
        <Input
          placeholder="yourname@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Rsvp;
