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
      {/* Status Bar */}
      <div className="status-bar"></div>

      {/* Card Header */}
      <div className="card-header">
        <div className="company-section">
          <div className="company-icon">
            <i className="fas fa-building"></i>
          </div>
          <div className="company-info">
            <div className="company-name">{company}</div>
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
              className="job-title"
            >
              {title}
            </Link>
          </div>
        </div>

        <div className="header-badges">
          <div className="domain-badge">
            <i className="fas fa-code"></i>
            <span>{domainMap[domain] || domain}</span>
          </div>
          
          {applicationStatus && (
            <div 
              className="status-badge"
              style={{ '--status-color': getStatusColor(applicationStatus) }}
            >
              <i className={getStatusIcon(applicationStatus)}></i>
              <span>
                {applicationStatus === 'PENDING' ? 'Pending' : 
                 applicationStatus === 'ACCEPTED' ? 'Accepted' : 
                 applicationStatus === 'REJECTED' ? 'Rejected' : applicationStatus}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Job Description Section */}
      <div className="jd-section">
        {jdType === "URL" ? (
          <div className="jd-link">
            <i className="fas fa-external-link-alt"></i>
            <a href={jd} target="_blank" rel="noopener noreferrer">
              View Job Description
            </a>
          </div>
        ) : (
          <div className="jd-text">
            <span className="jd-label">Description:</span>
            <p>{jd}</p>
          </div>
        )}
      </div>

      {/* Key Details Grid */}
      <div className="details-section">
        <div className="detail-row">
          <div className="detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <div className="detail-content">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{location}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <i className="fas fa-dollar-sign"></i>
            <div className="detail-content">
              <span className="detail-label">Compensation:</span>
              <span className="detail-value">{compensation}</span>
            </div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <i className="fas fa-calendar-alt"></i>
            <div className="detail-content">
              <span className="detail-label">Duration:</span>
              <span className="detail-value">{duration}</span>
            </div>
          </div>
          
          {weeklyHours && (
            <div className="detail-item">
              <i className="fas fa-clock"></i>
              <div className="detail-content">
                <span className="detail-label">Weekly Hours:</span>
                <span className="detail-value">{weeklyHours} hrs</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-section">
        <div className="timeline-header">
          <i className="fas fa-calendar-week"></i>
          <span>Program Timeline</span>
        </div>
        <div className="timeline-dates">
          <div className="date-item">
            <span className="date-label">Start</span>
            <span className="date-value">{formatDate(startTime)}</span>
          </div>
          <div className="timeline-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
          <div className="date-item">
            <span className="date-label">End</span>
            <span className="date-value">{formatDate(endTime)}</span>
          </div>
        </div>
      </div>

      {/* Eligibility Section */}
      <div className="eligibility-section">
        <div className="eligibility-header">
          <i className="fas fa-user-graduate"></i>
          <span>Eligibility Criteria</span>
        </div>
        <p className="eligibility-text">{criteria}</p>
      </div>

      {/* Action Buttons */}
      <div className="actions-section">
        {Role === "STUDENT" && (
          <button
            className={`action-btn primary-btn ${hasApplied ? 'applied' : ''} ${isApplying ? 'loading' : ''}`}
            onClick={handleApplyClick}
            disabled={isApplying || hasApplied}
          >
            {isApplying && <i className="fas fa-spinner fa-spin"></i>}
            <span>
              {isApplying ? "Applying..." : 
               hasApplied ? (
                 applicationStatus === 'PENDING' ? "Applied" : 
                 applicationStatus === 'ACCEPTED' ? "Accepted" :
                 applicationStatus === 'REJECTED' ? "Rejected" : "Applied"
               ) : "Apply Now"}
            </span>
            {!isApplying && !hasApplied && <i className="fas fa-paper-plane"></i>}
          </button>
        )}

        {Role === "ALUMNI" && (
          <button className="action-btn manage-btn" onClick={handleModifyClick}>
            <i className="fas fa-cog"></i>
            <span>Manage</span>
          </button>
        )}

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
          className="action-btn secondary-btn"
        >
          <i className="fas fa-eye"></i>
          <span>View Details</span>
        </Link>
      </div>

      <style jsx>{`
        .intern-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
          max-width: 100%;
        }

        .intern-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .status-bar {
          height: 4px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        }

        /* Header Section */
        .card-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .company-section {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          flex: 1;
          min-width: 0;
        }

        .company-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .company-icon i {
          color: white;
          font-size: 1.25rem;
        }

        .company-info {
          flex: 1;
          min-width: 0;
        }

        .company-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          text-decoration: none;
          line-height: 1.3;
          display: block;
          transition: color 0.3s ease;
        }

        .job-title:hover {
          color: #3b82f6;
        }

        .header-badges {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-end;
        }

        .domain-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
        }

        .domain-badge i {
          color: #3b82f6;
          font-size: 0.875rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(var(--status-color-rgb, 100, 116, 139), 0.1);
          color: var(--status-color, #64748b);
          padding: 0.375rem 0.75rem;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(var(--status-color-rgb, 100, 116, 139), 0.2);
          white-space: nowrap;
        }

        /* Job Description Section */
        .jd-section {
          padding: 0 1.5rem 1rem;
        }

        .jd-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .jd-link i {
          color: #3b82f6;
        }

        .jd-link a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .jd-link a:hover {
          text-decoration: underline;
        }

        .jd-text .jd-label {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.875rem;
        }

        .jd-text p {
          color: #64748b;
          margin: 0.5rem 0 0;
          line-height: 1.5;
          font-size: 0.875rem;
        }

        /* Details Section */
        .details-section {
          padding: 0 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .detail-item i {
          color: #3b82f6;
          font-size: 1rem;
          width: 16px;
          text-align: center;
        }

        .detail-item div {
          flex: 1;
          min-width: 0;
        }

        .detail-content {
          display: flex;
          flex-direction: row; 
          align-items: center;
          gap: 0.5rem;
        }

        .detail-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
        }

        .detail-value {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          text-transform: uppercase;
        }

        /* Timeline Section */
        .timeline-section {
          padding: 0 1.5rem 1rem;
        }

        .timeline-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #1e293b;
          font-size: 0.875rem;
        }

        .timeline-header i {
          color: #10b981;
        }

        .timeline-dates {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          border-radius: 12px;
          padding: 1rem;
        }

        .date-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .date-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .date-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .timeline-arrow {
          color: #10b981;
          font-size: 1.125rem;
        }

        /* Eligibility Section */
        .eligibility-section {
          padding: 0 1.5rem 1rem;
        }

        .eligibility-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #1e293b;
          font-size: 0.875rem;
        }

        .eligibility-header i {
          color: #8b5cf6;
        }

        .eligibility-text {
          background: #faf5ff;
          border: 1px solid #e9d5ff;
          border-radius: 12px;
          padding: 1rem;
          margin: 0;
          color: #6b21a8;
          font-size: 0.875rem;
          line-height: 1.5;
          font-weight: 500;
        }

        /* Actions Section */
        .actions-section {
          padding: 1.5rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          min-width: 120px;
        }

        .primary-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
        }

        .primary-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        .primary-btn.applied {
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
        }

        .primary-btn.applied[data-status="ACCEPTED"] {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .primary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .manage-btn {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .manage-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        }

        .secondary-btn {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .secondary-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-1px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .card-header {
            flex-direction: column;
            align-items: stretch;
          }

          .company-section {
            margin-bottom: 1rem;
          }

          .header-badges {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .detail-row {
            grid-template-columns: 1fr;
          }

          .timeline-dates {
            flex-direction: column;
            gap: 1rem;
          }

          .timeline-arrow {
            transform: rotate(90deg);
          }

          .actions-section {
            flex-direction: column;
          }

          .action-btn {
            flex: none;
          }
        }

        @media (max-width: 480px) {
          .intern-card {
            margin: 0.5rem;
            border-radius: 12px;
          }

          .card-header,
          .jd-section,
          .details-section,
          .timeline-section,
          .eligibility-section,
          .actions-section {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .company-section {
            gap: 0.75rem;
          }

          .company-icon {
            width: 40px;
            height: 40px;
          }

          .job-title {
            font-size: 1.125rem;
          }

          .header-badges {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default InternCard;