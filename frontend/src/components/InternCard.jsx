import React, { useEffect, useState } from "react";
import "./InternCard.css";
import { useNavigate } from "react-router-dom";
import { fetchInternships, fetchUserInfo } from "../components/fetchData";
import { Link } from "react-router-dom";
import axios from "axios";

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

const InternCard = ({
  id,
  title,
  jd,
  jdType,
  domain,
  location,
  compensation,
  duration,
  startTime,
  endTime,
  criteria,
  weeklyHours,
  company,
  role,
  applicationStatus: propApplicationStatus,
}) => {
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(!!propApplicationStatus);
  const [internships, setInternships] = useState([]);
  const [Role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(propApplicationStatus || null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const userInfo = await fetchUserInfo();
        if (userInfo) {
          setRole(userInfo.Role);
          setToken(userInfo.token);
        }
      } catch (error) {
        console.log("Error:", error.message);
      }
    };
    getUserRole();
  }, []);

  useEffect(() => {
    if (!Role) return;

    const url =
      Role === "ALUMNI"
        ? "alumni/getPostedInternships"
        : "student/getAllInternships";

    const fetchData = async () => {
      try {
        const internships = await fetchInternships(url, Role);
        setInternships(internships);
      } catch (error) {
        console.log("Error while fetching internships:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [Role]);

  useEffect(() => {
    if (propApplicationStatus) {
      setApplicationStatus(propApplicationStatus);
      setHasApplied(true);
    }
  }, [propApplicationStatus]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (Role === 'STUDENT' && token) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/student/getAppliedInternships`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const appliedInternship = response.data.appliedInternships.find(
            (app) => app.internshipId === id
          );
          if (appliedInternship) {
            setHasApplied(true);
            setApplicationStatus(appliedInternship.status);
          }
        } catch (error) {
          console.error("Error checking application status:", error);
        }
      }
    };
    
    checkApplicationStatus();
  }, [Role, token, id]);

  const handleApplyClick = async (e) => {
    e.preventDefault();
    console.log('Apply button clicked for internship ID:', id);
    setIsApplying(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/student/applyInternship/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Application successful:', response.data);
      setHasApplied(true);
      setApplicationStatus('PENDING');
      // Show success message
      alert('Application submitted successfully!');
    } catch (error) {
      console.error("Application failed:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to submit application: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsApplying(false);
    }
  };

  const handleModifyClick = (e) => {
    e.preventDefault();
    navigate(`/jobs/${id}`, {
      state: {
        role,
        job: {
          id,
          title,
          jd,
          domain,
          location,
          compensation,
          duration,
          startTime,
          endTime,
          criteria,
          weeklyHours,
          company,
        },
      },
    });
  };

  return (
    <div className="intern-card">
      <div className="card-header">
        <h2 className="title">
          <Link
            to={`/jobs/${id}`}
            state={{
              role,
              job: {
                id,
                title,
                jd,
                domain,
                location,
                compensation,
                duration,
                startTime,
                endTime,
                criteria,
                weeklyHours,
                company,
              },
            }}
            className="intern-card-link"
          >
            {company}{" - " + title}
          </Link>
        </h2>
        <div className="domain-pill">{domainMap[domain]}</div>
      </div>

      {jdType === "URL" ? (
        <a href={jd} target="_blank" rel="noopener noreferrer" className="jd-link">
          Click here to view job description
        </a>
      ) : (
        <p className="description">{jd}</p>
      )}

      <div className="details">
        <div className="detail-item">
          <i className="fas fa-map-marker-alt"></i>
          <span>{location}</span>
        </div>
        <div className="detail-item">
          <i className="fas fa-money-bill-wave"></i>
          <span>{compensation}</span>
        </div>
        <div className="detail-item">
          <i className="fas fa-calendar-alt"></i>
          <span>{duration}</span>
        </div>
        {weeklyHours && (
          <div className="detail-item">
            <i className="fas fa-clock"></i>
            <span>{weeklyHours} hrs/week</span>
          </div>
        )}
      </div>

      <div className="footer-section">
        <div className="timeline">
          <span>{formatDate(startTime)}</span>
          <span className="timeline-separator">-</span>
          <span>{formatDate(endTime)}</span>
        </div>

        <div className="eligibility">
          <i className="fas fa-user-graduate"></i>
          <span>{criteria}</span>
        </div>

        <div className="button-container">
          {applicationStatus && (
            <span className={`application-status status-${applicationStatus.toLowerCase()}`}>
              {applicationStatus === 'PENDING' ? 'Pending Review' : 
               applicationStatus === 'ACCEPTED' ? 'Accepted' : 
               applicationStatus === 'REJECTED' ? 'Not Selected' : applicationStatus}
            </span>
          )}
          
          {Role === "STUDENT" && (
            <button
              className={`intern-apply-button ${hasApplied ? "applied" : ""}`}
              onClick={handleApplyClick}
              disabled={isApplying || hasApplied}
            >
              {isApplying ? (
                <span className="spinner"></span>
              ) : hasApplied ? (
                applicationStatus === 'PENDING' ? "Applied ✅" : 
                applicationStatus === 'ACCEPTED' ? "Accepted 🎉" :
                applicationStatus === 'REJECTED' ? "Not Selected" : "Applied"
              ) : (
                "Apply Now"
              )}
            </button>
          )}

          {Role === "ALUMNI" && (
            <button className="intern-modify-button" onClick={handleModifyClick}>
              Manage
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternCard;