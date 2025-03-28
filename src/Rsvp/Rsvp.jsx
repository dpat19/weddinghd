import React, { useState } from "react";
import { Input, Button, Typography, Progress } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Rsvp.css";

const { Title } = Typography;

const Rsvp = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    guests: [
      { name: "Dhruv Patel", response: null },
      { name: "Hernisha Radia", response: null },
      { name: "Raj Mehta", response: null },
    ],
  });

  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleClose = () => {
    navigate("/weddinghd");
  };

  const handleResponse = (index, response) => {
    const updatedGuests = [...formData.guests];
    updatedGuests[index].response = response;
    setFormData({ ...formData, guests: updatedGuests });
  };

  return (
    <div className="rsvp-container">
      <div className="rsvp-header">
      <Progress
        percent={(step / 3) * 100}
        showInfo={false}
        className="rsvp-progress"
        trailColor="rgb(233, 233, 237)"   // background track color
  strokeColor="rgb(126, 116, 115)" 
/>
        <CloseOutlined className="rsvp-exit" onClick={handleClose} />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h1 className="rsvp-title">Hernisha & Dhruv's Wedding</h1>
          <h3 className="rsvp-subtitle">
            Please enter the access code you have received
          </h3>
          <Title level={2} className="rsvp-form-title">
            Enter Your Name
          </Title>
          <Input
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="rsvp-input"
          />
          <Button type="primary" className="rsvp-continue-button" onClick={handleNext}>
            Next
          </Button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
       
          <Title level={2} className="rsvp-form-title">
            Enter Your Code
          </Title>
          <Input
            placeholder="4-digit Code"
            maxLength={4}
            value={formData.code}
            onChange={(e) =>
              setFormData({
                ...formData,
                code: e.target.value.replace(/\D/g, ""),
              })
            }
            className="rsvp-input"
          />
          <div className="rsvp-buttons">
            <Button className="rsvp-back" onClick={handleBack}>
              Back
            </Button>
            <Button type="primary" className="rsvp-continue-button" onClick={handleNext}>
              Next
            </Button>
          </div>
         
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <Title level={3} className="rsvp-form-title">
            Dhruv's Haldi
          </Title>
          <p className="rsvp-event-details">
            📅 <strong>Thursday, May 07, 2026 at 05:30 PM</strong>
          </p>
          <p className="rsvp-event-details">
            📍 <strong>BAPS Robbinsville Akshardham</strong>{" "}
            <a href="#">View Full Address</a>
          </p>

          <div className="rsvp-guests-container">
            {formData.guests.map((guest, index) => (
              <div key={index} className="rsvp-guest">
                <p className="rsvp-guest-name">{guest.name}</p>
                <div className="rsvp-options">
                  <Button
                    className="rsvp-option-button accept"
                    onClick={() => handleResponse(index, "accept")}
                  >
                    Accept
                    {/* Show a check icon if this guest's response is "accept" */}
                    {guest.response === "accept" && (
                      <CheckOutlined style={{ marginLeft: 8 }} />
                    )}
                  </Button>
                  <Button
                    className="rsvp-option-button decline"
                    onClick={() => handleResponse(index, "decline")}
                  >
                    Decline
                    {/* Show a check icon if this guest's response is "decline" */}
                    {guest.response === "decline" && (
                      <CheckOutlined style={{ marginLeft: 8 }} />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button type="primary" className="rsvp-continue-button">
            Continue
          </Button>
        </>
      )}
    </div>
  );
};

export default Rsvp;
