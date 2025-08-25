import React from "react";
import "./Studentcard.css";
import { useParams } from "react-router-dom";
import {
  acceptInternshipApplication,
  rejectInternshipApplication,
} from "../components/postData";

const domainMap = {
  SOFTWARE: "Software Engineering",
  FRONTEND: "Frontend Development",
  BACKEND: "Backend Development",
  PRODUCT_MANAGEMENT: "Product Management",
  WEB_DEVELOPMENT: "Web Development",
  MOBILE_DEVELOPMENT: "Mobile Development",
  MACHINE_LEARNING: "Machine Learning",
  DATA_SCIENCE: "Data Science",
  BLOCKCHAIN: "Blockchain",
  CLOUD_COMPUTING: "Cloud Computing",
  CYBERSECURITY: "Cybersecurity",
};

const StudentCard = ({
  studentId,
  fullName,
  rollno,
  department,
  cgpa,
  domain,
  cv,
  experiences = [],
  status,
  onAccept,
  onReject,
  isProcessing,
}) => {
  const { internshipId } = useParams();
  // console.log(internshipId);

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    if (isNaN(date)) return "Present";
    const options = { year: "numeric", month: "short" };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="student-card">
      <div className="card-header">
        <div className="left-section">
          <div className="name-section">
            <h2 className="full-name">{fullName}</h2>
            <p className="student-id">{rollno}</p>
          </div>
          <div className="domain-pill">{domainMap[domain]}</div>
        </div>
        <div className="academic-details">
          <p className="department">{department}</p>
          <p className="cgpa">CGPA: {cgpa}</p>
        </div>
      </div>

      {cv && (
        <div className="cv-section">
          <a
            href={cv}
            target="_blank"
            rel="noopener noreferrer"
            className="cv-link"
          >
            <i className="fas fa-file-pdf"></i>
            View CV
          </a>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="experience-section">
          <h3>Work Experience</h3>
          {experiences.map((exp, index) => {
            const isCurrent =
              !exp.endDate || new Date(exp.endDate) > new Date();
            return (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <h4>{exp.title}</h4>
                  <span className="experience-duration">
                    {formatDate(exp.startDate)} -{" "}
                    {isCurrent ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="experience-description">{exp.description}</p>
                {exp.techStacks?.length > 0 && (
                  <div className="tech-stack">
                    {exp.techStacks.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {status === "PENDING" && (
        <div className="action-buttons">
          <button
            className="accept-button"
            onClick={onAccept}
            disabled={isProcessing}
          >
            {isProcessing ? <span className="spinner"></span> : "Accept"}
          </button>

          <button
            className="reject-button"
            onClick={onReject}
            disabled={isProcessing}
          >
            {isProcessing ? <span className="spinner"></span> : "Reject"}
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
