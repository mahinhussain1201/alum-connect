import React from "react";
import { Link } from "react-router-dom";
import "./MentorshipCard.css";
import { sendMentorshipRequest } from "./postData";
const MentorshipCard = ({
  id,
  mentorName,
  keywords,
  experience,
  interaction,
  maxMentees,
  currentMentees,
  currentOrganization,
  passingYear,
  status,
  linkedinProfile,
}) => {
  const handleApply = () =>{
    sendMentorshipRequest(id); 
    alert("Successfully Applied");
    
  }
  return (
    <div className="mentorship-card">
      <div className="card-header">
        <h3>{mentorName}</h3>
        {status && <span className={`status ${status.toLowerCase()}`}>{status}</span>}
      </div>
      
      <div className="card-body">
        <div className="mentor-info">
          <div className="info-item">
            <span className="label">Current Organization:</span>
            <span className="value">{currentOrganization}</span>
          </div>
          <div className="info-item">
            <span className="label">Experience:</span>
            <span className="value">{experience} years</span>
          </div>
          <div className="info-item">
            <span className="label">Passing Year:</span>
            <span className="value">{passingYear}</span>
          </div>
        </div>

        <div className="mentorship-details">
          <div className="detail-item">
            <span className="label">Interaction Level:</span>
            <span className="value">{interaction}</span>
          </div>
          <div className="detail-item">
            <span className="label">Mentee Slots:</span>
            <span className="value">{currentMentees}/{maxMentees}</span>
          </div>
          <div className="detail-item">
            <span className="label">Domains:</span>
            <div className="keywords">
              {keywords.map((keyword) => (
                <span key={keyword} className="keyword-pill">
                  {keyword.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card-actions">
          <Link
            to={linkedinProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-button"
          >
            View LinkedIn
          </Link>
          {status =='NEW' && (
            <button className="apply-button" onClick={handleApply}>
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorshipCard;