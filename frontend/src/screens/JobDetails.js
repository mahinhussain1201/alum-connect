import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetails.css";
import NavBar from "./NavBar";
import axios from "axios";
import { fetchInternships, fetchUserInfo } from "../components/fetchData";
import { closeInternship } from "../components/postData";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const userInfo = await fetchUserInfo();
        if (userInfo) {
          setRole(userInfo.role);
        }
      } catch (error) {
        console.log("Error:", error.message);
      }
    };
    getUserRole();
  }, []);

  useEffect(() => {
    if (!role) return;

    const url =
      role === "ALUMNI"
        ? "alumni/getPostedInternships"
        : "student/getAllInternships";

    const fetchData = async () => {
      try {
        const internships = await fetchInternships(url, role);
        const selectedJob = internships.find(
          (internship) => internship.id === parseInt(id)
        );
        setJob({
          ...selectedJob,
          responsibilities: selectedJob.responsibilities || [
            "Collaborate with team members",
            "Write clean and maintainable code",
            "Debug and troubleshoot issues",
          ],
        });
      } catch (error) {
        console.log("Error while fetching internships:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [role, id]);

  const handleCloseInternship = async () => {
    setIsClosing(true);
    try {
      const updatedJob = await closeInternship(id);
      console.log("Internship closed successfully!");
      setJob(updatedJob);
    } catch (error) {
      console.error("Failed to close internship:", error);
    } finally {
      setIsClosing(false);
    }
  };

  const handleApplyClick = async (e) => {
    e.preventDefault();
    setIsApplying(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/student/applyInternship/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJob((prevJob) => ({ ...prevJob, applicationStatus: "APPLIED" }));
    } catch (error) {
      console.error("Application failed:", error);
    } finally {
      setIsApplying(false);
    }
  };

  if (!job)
    return (
      <>
        <NavBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading job details, please wait...</div>
        </div>
      </>
    );

  function formatCreatedAt(createdAt) {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const timeDifference = now - createdDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
      return "Posted today";
    } else if (daysDifference === 1) {
      return "Posted 1 day ago";
    } else {
      return `Posted ${daysDifference} days ago`;
    }
  }

  return (
    <>
      <NavBar />
      <div className="job-details-page">
        {/* Hero Header Section */}
        <section className="job-hero">
          <div className="hero-background">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
          </div>
          <div className="hero-content">
            <div className="company-info">
              <div className="company-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="company-details">
                <h1 className="company-name">{job.company}</h1>
                <h2 className="job-title">{job.title}</h2>
              </div>
            </div>
            <div className="job-meta">
              <div className="meta-item">
                <div className="meta-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <span>{job.location}</span>
              </div>
              <div className="meta-item">
                <div className="meta-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <span>{job.compensation}</span>
              </div>
              <div className="meta-item">
                <div className="meta-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <span>{formatCreatedAt(job.createdAt)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="main-section">
          <div className="content-wrapper">
            <div className="main-content">
              {/* Job Description Card */}
              <div className="content-card">
                <div className="card-header">
                  <div className="header-icon">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <h3>Job Description</h3>
                </div>
                <div className="card-content">
                  {job.jdType === "URL" ? (
                    <div className="jd-link-container">
                      <div className="jd-link-icon">
                        <i className="fas fa-external-link-alt"></i>
                      </div>
                      <div className="jd-link-content">
                        <p className="jd-link-text">View detailed job description</p>
                        <a
                          href={job.jd}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="jd-link-button"
                        >
                          <i className="fas fa-arrow-right"></i>
                          Open Job Description
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="job-description-text">{job.jd}</p>
                  )}
                </div>
              </div>

              {/* Responsibilities Card */}
              <div className="content-card">
                <div className="card-header">
                  <div className="header-icon">
                    <i className="fas fa-tasks"></i>
                  </div>
                  <h3>Key Responsibilities</h3>
                </div>
                <div className="card-content">
                  <ul className="responsibilities-list">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="responsibility-item">
                        <div className="responsibility-bullet">
                          <i className="fas fa-check"></i>
                        </div>
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Action Card */}
              <div className="sidebar-card action-card">
                <div className="action-header">
                  <div className="action-icon">
                    {role === "ALUMNI" ? (
                      <i className="fas fa-users-cog"></i>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                  </div>
                  <h4>
                    {role === "ALUMNI" ? "Manage Internship" : "Apply Now"}
                  </h4>
                </div>

                <div className="action-buttons">
                  {role === "ALUMNI" ? (
                    <>
                      <button
                        className="primary-button"
                        onClick={() => navigate(`/intern-applications/${job.id}`)}
                      >
                        <i className="fas fa-eye"></i>
                        View Applications
                      </button>
                      {job.closed ? (
                        <div className="status-indicator closed">
                          <i className="fas fa-lock"></i>
                          <span>Already Closed</span>
                        </div>
                      ) : (
                        <button
                          className="danger-button"
                          onClick={handleCloseInternship}
                          disabled={isClosing}
                        >
                          {isClosing ? (
                            <>
                              <div className="button-spinner"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-times-circle"></i>
                              Close Internship
                            </>
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {job.applicationStatus !== null ? (
                        <div className={`status-indicator ${job.applicationStatus.toLowerCase()}`}>
                          <i className={`fas ${
                            job.applicationStatus === "PENDING" ? "fa-hourglass-half" :
                            job.applicationStatus === "ACCEPTED" ? "fa-check-circle" :
                            job.applicationStatus === "REJECTED" ? "fa-times-circle" :
                            "fa-info-circle"
                          }`}></i>
                          <span>
                            {job.applicationStatus === "PENDING" && "Application Pending"}
                            {job.applicationStatus === "ACCEPTED" && "Application Accepted"}
                            {job.applicationStatus === "REJECTED" && "Application Rejected"}
                            {job.applicationStatus &&
                              job.applicationStatus !== "PENDING" &&
                              job.applicationStatus !== "ACCEPTED" &&
                              job.applicationStatus !== "REJECTED" &&
                              `Status: ${job.applicationStatus}`}
                          </span>
                        </div>
                      ) : (
                        <button
                          className="primary-button apply-button"
                          onClick={handleApplyClick}
                          disabled={isApplying}
                        >
                          {isApplying ? (
                            <>
                              <div className="button-spinner"></div>
                              Applying...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane"></i>
                              Apply Now
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Job Details Card */}
              <div className="sidebar-card details-card">
                <div className="details-header">
                  <div className="details-icon">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <h4>Job Details</h4>
                </div>
                <div className="details-list">
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>Location</span>
                    </div>
                    <div className="detail-value">{job.location}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-money-bill-wave"></i>
                      <span>Stipend</span>
                    </div>
                    <div className="detail-value">{job.compensation}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Duration</span>
                    </div>
                    <div className="detail-value">{job.duration}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        /* Base Styles */
        .job-details-page {
          min-height: calc(100vh - 70px);
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .job-details-page * {
          box-sizing: border-box;
        }

        /* Loading Styles */
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 18px;
          font-weight: 600;
          color: #1e40af;
          text-align: center;
        }

        /* Hero Section */
        .job-hero {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          padding: 80px 0 100px;
          position: relative;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .floating-shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          top: 20%;
          right: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 5%;
          animation-delay: -2s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          top: 60%;
          right: 30%;
          animation-delay: -4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        .company-info {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .company-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
          flex-shrink: 0;
        }

        .company-icon i {
          font-size: 3rem;
          color: white;
        }

        .company-details h1 {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .company-details h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          margin: 0;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .job-meta {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .meta-icon {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .meta-icon i {
          color: white;
          font-size: 1.2rem;
        }

        .meta-item span {
          font-size: 1.2rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        /* Main Content Section */
        .main-section {
          padding: -60px 0 80px;
          position: relative;
          z-index: 2;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 3rem;
          margin-top: -60px;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Content Cards */
        .content-card {
          background: white;
          border-radius: 25px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .content-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }

        .card-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .header-icon i {
          color: white;
          font-size: 1.5rem;
        }

        .card-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .card-content {
          padding: 2rem;
        }

        /* Job Description Styles */
        .job-description-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #374151;
          margin: 0;
        }

        .jd-link-container {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 20px;
          border: 2px solid #bae6fd;
        }

        .jd-link-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .jd-link-icon i {
          color: white;
          font-size: 1.5rem;
        }

        .jd-link-content {
          flex: 1;
        }

        .jd-link-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #0c4a6e;
          margin-bottom: 1rem;
        }

        .jd-link-button {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .jd-link-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
        }

        /* Responsibilities Styles */
        .responsibilities-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .responsibility-item {
          display: flex;
          align-items: flex-start;
          gap: 1.2rem;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #374151;
        }

        .responsibility-bullet {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .responsibility-bullet i {
          color: white;
          font-size: 0.8rem;
        }

        /* Sidebar Styles */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-card {
          background: white;
          border-radius: 25px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .sidebar-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 50px rgba(0,0,0,0.15);
        }

        /* Action Card */
        .action-card {
          position: sticky;
          top: 2rem;
        }

        .action-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .action-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .action-icon i {
          color: white;
          font-size: 1.3rem;
        }

        .action-header h4 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .action-buttons {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .primary-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: none;
          color: white;
          padding: 15px 20px;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.6);
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .danger-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          color: white;
          padding: 15px 20px;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        }

        .danger-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(239, 68, 68, 0.6);
        }

        .danger-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .apply-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .apply-button:hover {
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.6);
        }

        .button-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 15px 20px;
          border-radius: 15px;
          font-weight: 700;
          text-align: center;
        }

        .status-indicator.pending {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        .status-indicator.accepted {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .status-indicator.rejected {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        }

        .status-indicator.closed {
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(100, 116, 139, 0.4);
        }

        /* Details Card */
        .details-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .details-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .details-icon i {
          color: white;
          font-size: 1.1rem;
        }

        .details-header h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .details-list {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .detail-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 600;
          color: #64748b;
          font-size: 0.95rem;
        }

        .detail-label i {
          width: 18px;
          text-align: center;
          color: #3b82f6;
        }

        .detail-value {
          font-size: 1.1rem;
          font-weight: 700;
        }`
      }
      </style>
     </> 
  );
};

export default JobDetails;