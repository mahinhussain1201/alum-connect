import React, { useState } from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Card = ({ title, description, icon, link, disabled, disabledMessage }) => {
  const navigate = useNavigate();
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMentor, setIsMentor] = useState(null);

  const handleClick = async () => {
    if (title === "Enroll as Startup Mentors") {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:8000/api/alumni/mentorshipStatus", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch((error)=>console.log(error)
        );
        console.log(response.data.isMentor);
        
        // Navigate based on API response
        navigate(response.data.isMentor ? "/mentorDashboard" : "/mentorRegistration");
        
      } catch (error) {
        console.error("Error checking mentor status:", error);
        alert("Failed to check mentor status. Please try again.");
      }
      return;
    }
  
    if (!disabled) navigate(link);
  };

  return (
    <div
      className={`card ${disabled ? "disabled" : ""}`}
      onClick={handleClick}
      onMouseMove={(e) => {
        if (disabled) {
          setTooltipPosition({ x: e.clientX, y: e.clientY });
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="icon">{icon}</div>
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>

      {disabled && showTooltip && (
        <div
          className="tooltip"
          style={{
            top: tooltipPosition.y + 10 + "px",
            left: tooltipPosition.x + 10 + "px",
          }}
        >
          {disabledMessage}
        </div>
      )}
    </div>
  );
};

export default Card;
