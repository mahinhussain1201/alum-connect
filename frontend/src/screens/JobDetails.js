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
      <div className="loading-container">
        <div className="spinner"></div>
        Loading, please wait...
      </div>
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

  function JobMeta({ job }) {
    return (
      <div className="job-meta">
        <span>{job.location}</span>
        <span>{job.compensation}</span>
        <span>{formatCreatedAt(job.createdAt)}</span>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="job-details">
        <div className="company-header">
          <h1>{job.company}</h1>
          <h2>{job.title}</h2>
          <div className="job-meta">
            <span>{job.location}</span>
            <span>{job.compensation}</span>
            <span>{formatCreatedAt(job.createdAt)}</span>
          </div>
        </div>

        <div className="content-container">
          <div className="main-content">
            <section className="job-description">
              <h3>Job Description</h3>
              {job.jdType === "URL" ? (
                <a
                  href={job.jd}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="job-description-link"
                >
                  Click here to view job description
                </a>
              ) : (
                <p>{job.jd}</p>
              )}
            </section>

            <section className="responsibilities">
              <h3>Responsibilities</h3>
              <ul>
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="sidebar">
            <div className="apply-box">
              {role === "ALUMNI" ? (
                <>
                  <button
                    className="view-applications-button"
                    onClick={() => navigate(`/intern-applications/${job.id}`)}
                  >
                    View Applications
                  </button>
                  {job.closed ? (
                    <span className="closed-text">Already closed</span>
                  ) : (
                    <button
                      className="close-internship-button"
                      onClick={handleCloseInternship}
                      disabled={isClosing}
                    >
                      {isClosing ? (
                        <span className="spinner"></span>
                      ) : (
                        "Close Internship"
                      )}
                    </button>
                  )}
                </>
              ) : (
                <>
                  {job.applicationStatus !== null ? (
                    <p
                      className={`applied-text ${
                        job.applicationStatus === "PENDING"
                          ? "pending-status"
                          : job.applicationStatus === "ACCEPTED"
                          ? "accepted-status"
                          : job.applicationStatus === "REJECTED"
                          ? "rejected-status"
                          : "other-status"
                      }`}
                    >
                      {job.applicationStatus === "PENDING" && "⏳ Pending"}
                      {job.applicationStatus === "ACCEPTED" && "✅ Accepted"}
                      {job.applicationStatus === "REJECTED" && "❌ Rejected"}
                      {job.applicationStatus &&
                        job.applicationStatus !== "PENDING" &&
                        job.applicationStatus !== "ACCEPTED" &&
                        job.applicationStatus !== "REJECTED" &&
                        `Status: ${job.applicationStatus}`}
                    </p>
                  ) : (
                    <button
                      className="apply-button"
                      onClick={handleApplyClick}
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <span className="spinner"></span>
                      ) : (
                        "Apply Now"
                      )}
                    </button>
                  )}
                </>
              )}
              <div className="job-details-meta">
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Stipend: </strong> {job.compensation}
                </p>
                <p>
                  <strong>Duration:</strong> {job.duration}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetails;