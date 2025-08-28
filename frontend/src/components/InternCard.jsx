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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'ACCEPTED': return '#10b981';
      case 'REJECTED': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return 'fas fa-clock';
      case 'ACCEPTED': return 'fas fa-check-circle';
      case 'REJECTED': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  };

  return (
    <div className="intern-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="header-content">
          <div className="company-info">
            <div className="company-icon">
              <i className="fas fa-building"></i>
            </div>
            <div className="company-details">
              <h3 className="company-name">{company}</h3>
              <h2 className="job-title">
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
                  className="title-link"
                >
                  {title}
                </Link>
              </h2>
            </div>
          </div>
          <div className="domain-badge">
            <i className="fas fa-code"></i>
            <span>{domainMap[domain] || domain}</span>
          </div>
        </div>
        
        {applicationStatus && (
          <div 
            className="status-indicator"
            style={{ '--status-color': getStatusColor(applicationStatus) }}
          >
            <i className={getStatusIcon(applicationStatus)}></i>
            <span>
              {applicationStatus === 'PENDING' ? 'Pending Review' : 
               applicationStatus === 'ACCEPTED' ? 'Accepted' : 
               applicationStatus === 'REJECTED' ? 'Not Selected' : applicationStatus}
            </span>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div className="card-body">
        {jdType === "URL" ? (
          <div className="jd-link-container">
            <i className="fas fa-external-link-alt"></i>
            <a href={jd} target="_blank" rel="noopener noreferrer" className="jd-link">
              View detailed job description
            </a>
          </div>
        ) : (
          <p className="job-description"><b>Job Description: </b>{jd}</p>
        )}

        {/* Details Grid */}
        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Location</span>
              <span className="detail-value">{location}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Compensation</span>
              <span className="detail-value">{compensation}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Duration</span>
              <span className="detail-value">{duration}</span>
            </div>
          </div>

          {weeklyHours && (
            <div className="detail-item">
              <div className="detail-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="detail-content">
                <span className="detail-label">Weekly Hours</span>
                <span className="detail-value">{weeklyHours} hrs/week</span>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="timeline-section">
          <div className="timeline-icon">
            <i className="fas fa-calendar-week"></i>
          </div>
          <div className="timeline-content">
            <span className="timeline-label">Program Timeline</span>
            <div className="timeline-dates">
              <span className="start-date">{formatDate(startTime)}</span>
              <div className="date-separator">
                <i className="fas fa-arrow-right"></i>
              </div>
              <span className="end-date">{formatDate(endTime)}</span>
            </div>
          </div>
        </div>

        {/* Eligibility */}
        <div className="eligibility-section">
          <div className="eligibility-icon">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="eligibility-content">
            <span className="eligibility-label">Eligibility Criteria</span>
            <span className="eligibility-text">{criteria}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <div className="footer-actions">
          {Role === "STUDENT" && (
            <button
              className={`apply-button ${hasApplied ? 'applied' : ''} ${isApplying ? 'loading' : ''}`}
              onClick={handleApplyClick}
              disabled={isApplying || hasApplied}
            >
              {isApplying && (
                <div className="button-spinner">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
              )}
              <span className="button-text">
                {isApplying ? "Applying..." : 
                 hasApplied ? (
                   applicationStatus === 'PENDING' ? "Applied" : 
                   applicationStatus === 'ACCEPTED' ? "Accepted" :
                   applicationStatus === 'REJECTED' ? "Not Selected" : "Applied"
                 ) : "Apply Now"}
              </span>
              {!isApplying && !hasApplied && <i className="fas fa-paper-plane"></i>}
              {hasApplied && applicationStatus === 'ACCEPTED' && <i className="fas fa-check"></i>}
              {hasApplied && applicationStatus === 'PENDING' && <i className="fas fa-clock"></i>}
            </button>
          )}

          {Role === "ALUMNI" && (
            <button className="manage-button" onClick={handleModifyClick}>
              <i className="fas fa-cog"></i>
              <span>Manage Internship</span>
            </button>
          )}

          <button className="view-details-button">
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
              className="details-link"
            >
              <i className="fas fa-eye"></i>
              <span>View Details</span>
            </Link>
          </button>
        </div>
      </div>

      <style jsx>{`
        .intern-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .intern-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        }

        .intern-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        /* Header */
        .card-header {
          padding: 2rem 2rem 1rem;
          position: relative;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .company-info {
          display: flex;
          gap: 1rem;
          flex: 1;
        }

        .company-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .company-icon i {
          color: white;
          font-size: 1.3rem;
        }

        .company-details {
          flex: 1;
        }

        .company-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .job-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
          line-height: 1.2;
        }

        .title-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .title-link:hover {
          color: #3b82f6;
        }

        .domain-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 2px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
        }

        .domain-badge i {
          color: #3b82f6;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(var(--status-color-rgb, 100, 116, 139), 0.1);
          color: var(--status-color, #64748b);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid rgba(var(--status-color-rgb, 100, 116, 139), 0.2);
        }

        /* Body */
        .card-body {
          padding: 0 2rem 1rem;
        }

        .jd-link-container {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 12px;
          margin-bottom: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .jd-link-container i {
          color: #3b82f6;
          font-size: 1rem;
        }

        .jd-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .jd-link:hover {
          color: #1e40af;
        }

        .job-description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 0.2rem;
          padding:0.2rem;
          font-size: 0.95rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .job-description b {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .detail-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .detail-icon i {
          color: white;
          font-size: 1rem;
        }

        .detail-content {
          flex: 1;
        }

        .detail-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          display: block;
          font-weight: 700;
          color: #1e293b;
          font-size: 0.9rem;
        }

        .timeline-section, .eligibility-section {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 12px;
          margin-bottom: 1rem;
          border: 1px solid #e2e8f0;
        }

        .timeline-icon, .eligibility-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .timeline-icon i, .eligibility-icon i {
          color: white;
          font-size: 1rem;
        }

        .timeline-content, .eligibility-content {
          flex: 1;
        }

        .timeline-label, .eligibility-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .timeline-dates {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .start-date, .end-date {
          font-weight: 700;
          color: #1e293b;
          font-size: 0.9rem;
        }

        .date-separator {
          color: #3b82f6;
        }

        .eligibility-text {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        /* Footer */
        .card-footer {
          padding: 1.5rem 2rem 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-top: 1px solid #e2e8f0;
        }

        .footer-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .apply-button, .manage-button, .view-details-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .apply-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          flex: 1;
          min-width: 120px;
        }

        .apply-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .apply-button.applied {
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
        }

        .apply-button.applied.accepted {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .apply-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .button-spinner {
          position: absolute;
          left: 15px;
        }

        .apply-button.loading .button-text {
          margin-left: 25px;
        }

        .manage-button {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          flex: 1;
          min-width: 150px;
        }

        .manage-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        .view-details-button {
          background: white;
          border: 2px solid #e2e8f0;
          color: #64748b;
          min-width: 130px;
        }

        .view-details-button:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
        }

        .details-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: inherit;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .domain-badge {
            align-self: flex-start;
          }

          .details-grid {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }

          .timeline-dates {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .date-separator {
            transform: rotate(90deg);
          }

          .footer-actions {
            flex-direction: column;
          }

          .apply-button, .manage-button, .view-details-button {
            flex: none;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .intern-card {
            border-radius: 15px;
          }

          .card-header, .card-body, .card-footer {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .company-info {
            gap: 0.8rem;
          }

          .company-icon {
            width: 40px;
            height: 40px;
          }

          .job-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default InternCard;