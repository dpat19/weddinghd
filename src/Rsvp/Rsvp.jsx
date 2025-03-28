import React, { useState } from "react";
import { Input, Button, Typography, Progress } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "./Rsvp.css";

const { Title } = Typography;

const Rsvp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", code: "" });
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleClose = () => {
    navigate("/weddinghd"); // Redirect to the homepage
  };

  return (
    <>
      <div className="rsvp-container">
        {/* Top Section with Progress Bar */}
        <div className="rsvp-header">
          <Progress
            percent={step === 1 ? 50 : 100}
            showInfo={false}
            className="rsvp-progress"
          />
          <CloseOutlined className="rsvp-exit" onClick={handleClose} />
        </div>

        {/* Wedding Title and Instructions */}
        <h1 className="rsvp-title">Hernisha & Dhruv's Wedding</h1>
        <h3 className="rsvp-subtitle">Please enter the access code you have received</h3>

        {/* Form Steps */}
        {step === 1 && (
          <>
            <Title level={2} className="rsvp-form-title">
              Enter Your Name
            </Title>
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rsvp-input"
            />
            <Button type="primary" className="rsvp-button" onClick={handleNext}>
              Next
            </Button>
          </>
        )}
        
        {step === 2 && (
          <>
            <Title level={2} className="rsvp-form-title">
              Enter Your Code
            </Title>
            <Input
              placeholder="4-digit Code"
              maxLength={4}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, "") })}
              className="rsvp-input"
            />
            <div className="rsvp-buttons">
              <Button className="rsvp-back" onClick={handleBack}>
                Back
              </Button>
              <Button type="primary" className="rsvp-button">
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Rsvp;
