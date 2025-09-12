import React, { useState, useEffect, useRef } from "react";
import MentorshipCard from "../components/MentorshipCard";
import NavBar from "./NavBar";
import {fetchMentors,fetchMentorProfile} from "../components/fetchData"

const domains = [
  "SOFTWARE",
  "FRONTEND",
  "BACKEND",
  "BLOCKCHAIN",
  "MACHINE_LEARNING",
  "DATA_SCIENCE",
  "CLOUD_COMPUTING",
  "CYBERSECURITY",
];

const statuses = ["NEW", "PENDING", "ACTIVE", "REJECTED"];

const Mentee_Dashboard = () => {
  const [mentorships, setMentorships] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const filterRef = useRef(null);

  useEffect(() => {
    fetchMentors().then(data => {
      setMentorships(data)
      console.log(data);
    });
    setIsLoading(false);
  }, []);

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
      setSelectedDomains([]);
    } else {
      setSelectedDomains((prev) =>
        prev.includes(domain)
          ? prev.filter((d) => d !== domain)
          : [...prev, domain]
      );
    }
  };

  const handleStatusSelect = (status) => {
    if (status === "All Statuses") {
      setSelectedStatus("");
    } else {
      setSelectedStatus(status === selectedStatus ? "" : status);
    }
    setOpenDropdown(null);
    setCurrentPage(0);
  };

  const filteredMentorships = mentorships.filter((mentorship) => {
    const matchesDomain =
      selectedDomains.length === 0 ||
      selectedDomains.some((domain) => mentorship.keywords.includes(domain));
    
    const matchesStatus = selectedStatus === "NEW" 
      ? !mentorship.status 
      : !selectedStatus || mentorship.status === selectedStatus;

    return matchesDomain && matchesStatus;
  });

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading mentorships...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="mentee-dashboard">
        {/* Hero Section */}
        <section className="mentorship-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <div className="title-icon">
                  <i className="fas fa-user-friends"></i>
                </div>
                Find Your Perfect Mentor
              </h1>
              <p className="hero-description">
                Connect with experienced professionals who can guide your career journey
                and help you achieve your goals
              </p>
            </div>
            <div className="hero-visual">
              <div className="floating-element">
                <i className="fas fa-lightbulb"></i>
              </div>
              <div className="floating-element delay-1">
                <i className="fas fa-rocket"></i>
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
                Filter Mentorships
              </h3>
              <p className="filters-subtitle">Find exactly what you're looking for</p>
            </div>

            <div className="filter-controls">
              <div className="filter-row">
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
              </div>

              {/* Active Filters Display */}
              {(selectedDomains.length > 0 || selectedStatus) && (
                <div className="active-filters">
                  <span className="active-filters-label">Active Filters:</span>
                  {selectedDomains.map((domain) => (
                    <span key={domain} className="filter-tag">
                      {domain.replace(/_/g, " ")}
                      <i 
                        className="fas fa-times filter-tag-remove"
                        onClick={() => handleDomainSelect(domain)}
                      ></i>
                    </span>
                  ))}
                  {selectedStatus && (
                    <span className="filter-tag">
                      {selectedStatus}
                      <i 
                        className="fas fa-times filter-tag-remove"
                        onClick={() => handleStatusSelect(selectedStatus)}
                      ></i>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mentorships List Section */}
        <section className="mentorships-section">
          <div className="mentorships-header">
            <h3 className="mentorships-title">
              <i className="fas fa-users"></i>
              Available Mentors
            </h3>
            <p className="mentorships-count">
              {filteredMentorships.length} {filteredMentorships.length === 1 ? 'mentor' : 'mentors'} found
            </p>
          </div>

          <div className="mentorship-list">
            {filteredMentorships.length > 0 ? (
              filteredMentorships.map((mentorship) => (
                <MentorshipCard key={mentorship.id} {...mentorship} />
              ))
            ) : (
              <div className="no-mentorships">
                <div className="no-mentorships-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h4>No mentorships found</h4>
                <p>Try adjusting your filters to find more mentors</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        /* Base Styles */
        .mentee-dashboard {
          min-height: calc(100vh - 70px);
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: system-ui, -apple-system, sans-serif;
          position: relative;
          z-index: 1;
        }

        .mentee-dashboard * {
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
        .mentorship-hero {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          padding: 80px 0 100px;
          position: relative;
          overflow: hidden;
        }

        .mentorship-hero::before {
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
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
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

        /* Active Filters */
        .active-filters {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .active-filters-label {
          font-weight: 600;
          color: #374151;
        }

        .filter-tag {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-tag-remove {
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }

        .filter-tag-remove:hover {
          opacity: 1;
        }

        /* Mentorships Section */
        .mentorships-section {
          padding: 60px 2rem 80px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .mentorships-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .mentorships-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 2.2rem;
          font-weight: 800;
          color: #1e293b;
        }

        .mentorships-title i {
          color: #3b82f6;
        }

        .mentorships-count {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .mentorship-list {
          display: grid;
          gap: 2rem;
          grid-template-columns: 1fr;
        }

        .no-mentorships {
          text-align: center;
          padding: 60px 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .no-mentorships-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .no-mentorships-icon i {
          font-size: 2rem;
          color: white;
        }

        .no-mentorships h4 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .no-mentorships p {
          color: #64748b;
          font-size: 1.1rem;
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

          .mentorships-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .mentorships-title {
            font-size: 1.8rem;
          }

          .filters-title {
            font-size: 1.5rem;
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .mentorships-section {
            padding: 40px 1rem 60px;
          }

          .filters-container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default Mentee_Dashboard;