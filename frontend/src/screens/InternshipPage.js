import React, { useState, useEffect, useRef } from "react";
import "./InternshipPage.css";
import InternCard from "../components/InternCard";
import NavBar from "./NavBar";
import Footer from "../components/Footer";
import { fetchInternships, fetchUserInfo } from "../components/fetchData";
import { postNewInternship } from "../components/postData";
import axios from 'axios';

const domains = [
  "SOFTWARE",
  "FRONTEND",
  "BACKEND",
  "PRODUCT_MANAGEMENT",
  "WEB_DEVELOPMENT",
  "MOBILE_DEVELOPMENT",
  "MACHINE_LEARNING",
  "DATA_SCIENCE",
  "BLOCKCHAIN",
  "CLOUD_COMPUTING",
  "CYBERSECURITY",
  "BUSINESS_MANAGEMENT",
  "FINANCE",
  "ACCOUNTING",
  "HUMAN_RESOURCES",
  "MARKETING",
  "SALES",
  "OPERATIONS",
  "STRATEGY",
  "PROJECT_MANAGEMENT",
  "SUPPLY_CHAIN_MANAGEMENT",
  "CONSULTING",
  "ENTREPRENEURSHIP",
  "BUSINESS_DEVELOPMENT",
  "BUSINESS_ANALYTICS",
  "ECONOMICS",
  "PUBLIC_RELATIONS",
];

const locations = [
  "Banglore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Mumbai",
  "Noida",
  "Remote",
];

const statuses = ["NEW", "ACCEPTED", "PENDING", "REJECTED"];

const InternshipPage = () => {
  const [internships, setInternships] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    jd: "",
    domain: "",
    location: "",
    compensation: "",
    duration: "",
    startTime: "",
    endTime: "",
    criteria: "",
    weeklyHours: "",
  });
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const filterRef = useRef(null);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const userInfo = await fetchUserInfo();
        if (userInfo) {
          setRole(userInfo.role);
          setToken(userInfo.token);
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
        setInternships(internships);
      } catch (error) {
        console.log("Error while fetching internships:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [role]);

  useEffect(() => {
    const fetchAppliedInternships = async () => {
      if (role === 'STUDENT') {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            'http://localhost:8000/api/student/getAppliedInternships',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAppliedInternships(response.data.appliedInternships || []);
        } catch (error) {
          console.error('Error fetching applied internships:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchAppliedInternships();
  }, [role]);

  const getApplicationStatus = (internshipId) => {
    const application = appliedInternships.find(app => app.internshipId === internshipId);
    return application ? application.status : null;
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const handleDomainSelect = (domain) => {
    if (domain === "All Domains") {
      setSelectedDomains([]); // Clear selection to show all domains
    } else {
      setSelectedDomains((prev) =>
        prev.includes(domain)
          ? prev.filter((d) => d !== domain)
          : [...prev, domain]
      );
    }
  };

  const handleLocationSelect = (location) => {
    if (location === "All Locations") {
      setSelectedLocation(""); // Clear selection to show all locations
    } else {
      setSelectedLocation(location);
    }
    setOpenDropdown(null);
  };

  const handleStatusSelect = (status) => {
    if (status === "All Statuses") {
      setSelectedStatus(""); 
    } else {
      setSelectedStatus(status);
    }
    setOpenDropdown(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
    };

    try {
      const new_internship = await postNewInternship(payload);

      if (new_internship) {
        try {
          setIsLoading(true);
          const url =
            role === "ALUMNI"
              ? "alumni/getPostedInternships"
              : "student/getAllInternships";
          const internships = await fetchInternships(url);
          setInternships(internships);
          alert("Internship posted successfully!");
          setIsLoading(false);
        } catch (error) {
          alert("Posted successfully but failed to refresh list");
        }

        setShowForm(false);
        setFormData({
          company: "",
          title: "",
          jd: "",
          domain: "",
          location: "",
          compensation: "",
          duration: "",
          startTime: "",
          endTime: "",
          criteria: "",
          weeklyHours: "",
        });
      } else {
        alert("Failed to post internship");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while posting the internship");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const filteredInternships = internships.filter((intern) => {
    const matchesDomain =
      selectedDomains.length === 0 || selectedDomains.includes(intern.domain);
    const matchesLocation =
      !selectedLocation || intern.location === selectedLocation;
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "NEW"
        ? intern.applicationStatus === null
        : intern.applicationStatus === selectedStatus);

    return matchesDomain && matchesLocation && matchesStatus;
  });

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading internships, please wait...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="internship-page">
        {/* Hero Section */}
        <section className="internship-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <div className="title-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                Internship Opportunities
              </h1>
              <p className="hero-description">
                {role === "ALUMNI" 
                  ? "Share amazing opportunities and help students build their careers"
                  : "Discover internships that match your skills and career goals"
                }
              </p>
            </div>
            <div className="hero-visual">
              <div className="floating-element">
                <i className="fas fa-rocket"></i>
              </div>
              <div className="floating-element delay-1">
                <i className="fas fa-lightbulb"></i>
              </div>
              <div className="floating-element delay-2">
                <i className="fas fa-target"></i>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="filters-container" ref={filterRef}>
            <div className="filters-header">
              <h3 className="filters-title">
                <i className="fas fa-filter"></i>
                Filter Opportunities
              </h3>
              <p className="filters-subtitle">Find exactly what you're looking for</p>
            </div>

            <div className="filter-controls">
              <div className="filter-row">
                <div className="filter-group">
                  <div
                    className="filter-input"
                    onClick={() => toggleDropdown("location")}
                  >
                    <div className="filter-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <span>
                      {selectedLocation
                        ? `Hiring in ${selectedLocation}`
                        : "All Locations"}
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        openDropdown === "location" ? "up" : "down"
                      } dropdown-arrow`}
                    ></i>
                  </div>

                  {openDropdown === "location" && (
                    <div className="dropdown-menu">
                      <div
                        className={`dropdown-item ${
                          selectedLocation === "" ? "active" : ""
                        }`}
                        onClick={() => handleLocationSelect("All Locations")}
                      >
                        All Locations
                        {selectedLocation === "" && (
                          <i className="fas fa-check"></i>
                        )}
                      </div>

                      {locations.map((location) => (
                        <div
                          key={location}
                          className={`dropdown-item ${
                            selectedLocation === location ? "active" : ""
                          }`}
                          onClick={() => handleLocationSelect(location)}
                        >
                          {location}
                          {selectedLocation === location && (
                            <i className="fas fa-check"></i>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="filter-group">
                  <div
                    className="filter-input"
                    onClick={() => toggleDropdown("domain")}
                  >
                    <div className="filter-icon">
                      <i className="fas fa-code"></i>
                    </div>
                    <span>
                      {selectedDomains.length > 0
                        ? `${selectedDomains.length} Domains Selected`
                        : "All Domains"}
                    </span>
                    <i
                      className={`fas fa-chevron-${
                        openDropdown === "domain" ? "up" : "down"
                      } dropdown-arrow`}
                    ></i>
                  </div>

                  {openDropdown === "domain" && (
                    <div className="dropdown-menu">
                      <div
                        className={`dropdown-item ${
                          selectedDomains.length === 0 ? "active" : ""
                        }`}
                        onClick={() => handleDomainSelect("All Domains")}
                      >
                        All Domains
                        {selectedDomains.length === 0 && (
                          <i className="fas fa-check"></i>
                        )}
                      </div>

                      {domains.map((domain) => (
                        <div
                          key={domain}
                          className={`dropdown-item ${
                            selectedDomains.includes(domain) ? "active" : ""
                          }`}
                          onClick={() => handleDomainSelect(domain)}
                        >
                          {domain.replace(/_/g, " ")}
                          {selectedDomains.includes(domain) && (
                            <i className="fas fa-check"></i>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {role === "STUDENT" && (
                  <div className="filter-group">
                    <div
                      className="filter-input"
                      onClick={() => toggleDropdown("status")}
                    >
                      <div className="filter-icon">
                        <i className="fas fa-clipboard-check"></i>
                      </div>
                      <span>
                        {selectedStatus ? `Status: ${selectedStatus}` : "All Status"}
                      </span>
                      <i
                        className={`fas fa-chevron-${
                          openDropdown === "status" ? "up" : "down"
                        } dropdown-arrow`}
                      ></i>
                    </div>

                    {openDropdown === "status" && (
                      <div className="dropdown-menu">
                        <div
                          className={`dropdown-item ${
                            selectedStatus === "" ? "active" : ""
                          }`}
                          onClick={() => handleStatusSelect("All Statuses")}
                        >
                          All Status
                          {selectedStatus === "" && (
                            <i className="fas fa-check"></i>
                          )}
                        </div>

                        {statuses.map((status) => (
                          <div
                            key={status}
                            className={`dropdown-item ${
                              selectedStatus === status ? "active" : ""
                            }`}
                            onClick={() => handleStatusSelect(status)}
                          >
                            {status}
                            {selectedStatus === status && (
                              <i className="fas fa-check"></i>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {role === "ALUMNI" && (
                <div className="add-internship-section">
                  <button className="add-button" onClick={() => setShowForm(true)}>
                    <i className="fas fa-plus"></i>
                    Post New Internship
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Internships List Section */}
        <section className="internships-section">
          <div className="internships-header">
            <h3 className="internships-title">
              {role === "ALUMNI" ? "Your Posted Internships" : "Available Opportunities"}
            </h3>
            <p className="internships-count">
              {filteredInternships.length} {filteredInternships.length === 1 ? 'opportunity' : 'opportunities'} found
            </p>
          </div>

          <div className="internship-list">
            {filteredInternships.length > 0 ? (
              filteredInternships.map((internship) => {
                const status = role === 'STUDENT' ? getApplicationStatus(internship.id) : null;
                return (
                  <InternCard
                    key={internship.id}
                    {...internship}
                    company={internship.company}
                    role={role}
                    applicationStatus={status}
                  />
                );
              })
            ) : (
              <div className="no-internships">
                <div className="no-internships-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h4>No internships found</h4>
                <p>Try adjusting your filters to see more opportunities</p>
              </div>
            )}
          </div>
        </section>

        {/* Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>
                  <i className="fas fa-plus-circle"></i>
                  Post New Internship
                </h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowForm(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="internship-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-building"></i>
                      Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="fas fa-briefcase"></i>
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-file-alt"></i>
                    Job Description *
                  </label>
                  <textarea
                    name="jd"
                    value={formData.jd}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-code"></i>
                      Domain *
                    </label>
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Domain</option>
                      {domains.map((domain) => (
                        <option key={domain} value={domain}>
                          {domain.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="fas fa-map-marker-alt"></i>
                      Location *
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Location</option>
                      {[...locations, "ONLINE"].map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-dollar-sign"></i>
                      Compensation *
                    </label>
                    <input
                      type="text"
                      name="compensation"
                      value={formData.compensation}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="fas fa-clock"></i>
                      Duration *
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-calendar-alt"></i>
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="fas fa-calendar-alt"></i>
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-graduation-cap"></i>
                    Eligibility Criteria *
                  </label>
                  <input
                    type="text"
                    name="criteria"
                    value={formData.criteria}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-hourglass-half"></i>
                    Weekly Hours (optional)
                  </label>
                  <input
                    type="text"
                    name="weeklyHours"
                    value={formData.weeklyHours}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    <i className="fas fa-paper-plane"></i>
                    Post Internship
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style jsx>{`
        /* Base Styles */
        .internship-page {
          min-height: calc(100vh - 70px);
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: system-ui, -apple-system, sans-serif;
          position: relative;
          z-index: 1;
        }

        .internship-page * {
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
        .internship-hero {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          padding: 80px 0 100px;
          position: relative;
          overflow: hidden;
        }

        .internship-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 3.2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .title-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        .title-icon i {
          font-size: 2.2rem;
          color: white;
        }

        .hero-description {
          font-size: 1.25rem;
          color: rgba(255,255,255,0.9);
          line-height: 1.6;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .floating-element {
          width: 120px;
          height: 120px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          animation: float 3s ease-in-out infinite;
        }

        .floating-element i {
          font-size: 3rem;
          color: white;
          opacity: 0.9;
        }

        .floating-element.delay-1 {
          animation-delay: -1s;
          top: -60px;
          right: -40px;
          width: 100px;
          height: 100px;
        }

        .floating-element.delay-2 {
          animation-delay: -2s;
          bottom: -60px;
          left: -40px;
          width: 100px;
          height: 100px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        /* Filters Section */
        .filters-section {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding: 40px 0;
          position: relative;
        }

        .filters-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .filters-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .filters-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .filters-title i {
          color: #3b82f6;
        }

        .filters-subtitle {
          color: #64748b;
          font-size: 1.1rem;
        }

        .filter-controls {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .filter-row {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .filter-group {
          position: relative;
          min-width: 200px;
          flex: 1;
          max-width: 300px;
        }

        .filter-input {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 15px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 2px solid transparent;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .filter-input:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
          transform: translateY(-2px);
        }

        .filter-icon {
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .filter-icon i {
          color: white;
          font-size: 1rem;
        }

        .dropdown-arrow {
          margin-left: auto;
          color: #64748b;
          transition: transform 0.3s ease;
        }

        .filter-input:hover .dropdown-arrow {
          color: #3b82f6;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;
          margin-top: 8px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid #f1f5f9;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .dropdown-item.active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          font-weight: 600;
        }

        .dropdown-item i {
          color: #10b981;
          font-size: 0.9rem;
        }

        .add-internship-section {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .add-button {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          color: white;
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .add-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.6);
        }

        .add-button i {
          font-size: 1.2rem;
        }

        /* Internships Section */
        .internships-section {
          padding: 60px 2rem 80px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .internships-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .internships-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1e293b;
        }

        .internships-count {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .internship-list {
          display: grid;
          gap: 2rem;
          grid-template-columns: 1fr;
        }

        .no-internships {
          text-align: center;
          padding: 60px 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .no-internships-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .no-internships-icon i {
          font-size: 2rem;
          color: white;
        }

        .no-internships h4 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .no-internships p {
          color: #64748b;
          font-size: 1.1rem;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }

        .modal-content {
          background: white;
          border-radius: 25px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.2);
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 2rem;
        }

        .modal-header h2 {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.8rem;
          font-weight: 800;
          color: #1e293b;
        }

        .modal-header i {
          color: #3b82f6;
        }

        .modal-close {
          width: 40px;
          height: 40px;
          background: #f1f5f9;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: #e2e8f0;
          transform: rotate(90deg);
        }

        .internship-form {
          padding: 0 2rem 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .form-group label i {
          color: #3b82f6;
          width: 16px;
          text-align: center;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          transform: translateY(-1px);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-buttons {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
          margin-top: 2rem;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          color: white;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: #f1f5f9;
          border: 2px solid #e2e8f0;
          color: #64748b;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #e2e8f0;
          color: #475569;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .filter-row {
            justify-content: flex-start;
          }

          .filter-group {
            min-width: 180px;
            max-width: 250px;
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
            padding: 0 1rem;
          }

          .hero-title {
            font-size: 2.5rem;
            flex-direction: column;
            gap: 1rem;
          }

          .title-icon {
            width: 70px;
            height: 70px;
          }

          .title-icon i {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1.1rem;
          }

          .floating-element {
            display: none;
          }

          .filters-section {
            padding: 30px 0;
          }

          .filter-controls {
            padding: 1.5rem;
          }

          .filter-row {
            flex-direction: column;
            gap: 1rem;
          }

          .filter-group {
            min-width: auto;
            max-width: none;
          }

          .internships-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .internships-title {
            font-size: 1.8rem;
          }

          .filters-title {
            font-size: 1.5rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }

          .form-buttons {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .internships-section {
            padding: 40px 1rem 60px;
          }

          .filters-container {
            padding: 0 1rem;
          }

          .modal-overlay {
            padding: 1rem;
          }

          .modal-header {
            padding: 1.5rem 1.5rem 1rem;
          }

          .internship-form {
            padding: 0 1.5rem 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default InternshipPage;