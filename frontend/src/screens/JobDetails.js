// Updated JobDetails.jsx - Key Responsibilities section removed

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
        setJob(selectedJob); // Removed responsibilities fallback since we're not showing them
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
              {/* Job Description Card - Only section remaining */}
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
                        <div className={`status-indicator ${job.applicationStatus?.toLowerCase() || ''}`}>
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
                              !["PENDING", "ACCEPTED", "REJECTED"].includes(job.applicationStatus) &&
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
    </> 
  );
};

export default JobDetails;