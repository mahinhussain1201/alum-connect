import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchMentors().then(data => {
      setMentorships(data)
      console.log(data);
    });
    setIsLoading(false);
  }, []);

  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain]
    );
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status === selectedStatus ? "" : status);
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

  const totalPages = Math.ceil(filteredMentorships.length / 3);
  const visibleMentorships = filteredMentorships.slice(
    currentPage * 3,
    (currentPage + 1) * 3
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading mentorships...</div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="mentee-dashboard">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Find Your Perfect Mentor</h1>
              <p className="hero-description">
                Connect with experienced professionals who can guide your career journey
              </p>
            </div>
            <div className="hero-visual">
              <div className="floating-icon">
                <i className="fas fa-user-friends"></i>
              </div>
              <div className="floating-icon delay-1">
                <i className="fas fa-lightbulb"></i>
              </div>
              <div className="floating-icon delay-2">
                <i className="fas fa-rocket"></i>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="filters-container">
            <h2 className="filters-title">
              <i className="fas fa-filter"></i>
              Filter Mentorships
            </h2>
            
            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Domains</label>
                <div
                  className="filter-input"
                  onClick={() => toggleDropdown("domain")}
                >
                  <span className="filter-text">
                    {selectedDomains.length > 0
                      ? `${selectedDomains.length} Domains Selected`
                      : "All Domains"}
                  </span>
                  <i
                    className={`fas fa-chevron-${
                      openDropdown === "domain" ? "up" : "down"
                    } filter-chevron`}
                  ></i>
                </div>

                {openDropdown === "domain" && (
                  <div className="dropdown-menu">
                    {domains.map((domain) => (
                      <div
                        key={domain}
                        className={`dropdown-item ${
                          selectedDomains.includes(domain) ? "active" : ""
                        }`}
                        onClick={() => handleDomainSelect(domain)}
                      >
                        <span className="dropdown-text">
                          {domain.replace(/_/g, " ")}
                        </span>
                        {selectedDomains.includes(domain) && (
                          <i className="fas fa-check dropdown-check"></i>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="filter-group">
                <label className="filter-label">Status</label>
                <div
                  className="filter-input"
                  onClick={() => toggleDropdown("status")}
                >
                  <span className="filter-text">
                    {selectedStatus ? `Status: ${selectedStatus}` : "All Status"}
                  </span>
                  <i
                    className={`fas fa-chevron-${
                      openDropdown === "status" ? "up" : "down"
                    } filter-chevron`}
                  ></i>
                </div>

                {openDropdown === "status" && (
                  <div className="dropdown-menu">
                    {statuses.map((status) => (
                      <div
                        key={status}
                        className={`dropdown-item ${
                          selectedStatus === status ? "active" : ""
                        }`}
                        onClick={() => handleStatusSelect(status)}
                      >
                        <span className="dropdown-text">{status}</span>
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
        </section>

        {/* Results Section */}
        <section className="results-section">
          <div className="results-header">
            <h2 className="results-title">
              <i className="fas fa-users"></i>
              Available Mentors
              <span className="results-count">({filteredMentorships.length})</span>
            </h2>
          </div>

          <div className="carousel-container">
            <button
              className="carousel-arrow left"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div className="mentorship-list">
              {visibleMentorships.length > 0 ? (
                visibleMentorships.map((mentorship) => (
                  <MentorshipCard key={mentorship.id} {...mentorship} />
                ))
              ) : (
                <div className="no-mentorships">
                  <div className="no-mentorships-icon">
                    <i className="fas fa-search"></i>
                  </div>
                  <h3>No mentorships found</h3>
                  <p>Try adjusting your filters to find more mentors</p>
                </div>
              )}
            </div>

            <button
              className="carousel-arrow right"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="pagination-dots">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`pagination-dot ${currentPage === index ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index)}
                >
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        /* Base Styles */
        .mentee-dashboard {
          min-height: calc(100vh - 70px);
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* Loading Styles */
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: calc(100vh - 70px);
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
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          padding: 80px 0 100px;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
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
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
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

        .floating-icon {
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

        .floating-icon i {
          font-size: 3rem;
          color: white;
          opacity: 0.9;
        }

        .floating-icon.delay-1 {
          animation-delay: -1s;
          top: -60px;
          right: -40px;
          width: 100px;
          height: 100px;
        }

        .floating-icon.delay-2 {
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
          padding: 60px 0;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .filters-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .filters-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2rem;
        }

        .filters-title i {
          color: #3b82f6;
        }

        .filter-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .filter-group {
          position: relative;
        }

        .filter-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-input {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .filter-input:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .filter-text {
          font-weight: 500;
          color: #374151;
        }

        .filter-chevron {
          color: #6b7280;
          transition: transform 0.3s ease;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          z-index: 10;
          max-height: 300px;
          overflow-y: auto;
        }

        .dropdown-item {
          padding: 12px 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
          border-bottom: 1px solid #f3f4f6;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background: #f8fafc;
        }

        .dropdown-item.active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }

        .dropdown-text {
          font-weight: 500;
          text-transform: capitalize;
        }

        .dropdown-check {
          color: white;
        }

        /* Active Filters */
        .active-filters {
          margin-top: 2rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
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

        /* Results Section */
        .results-section {
          padding: 60px 0 80px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .results-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .results-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .results-title i {
          color: #3b82f6;
        }

        .results-count {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 1rem;
          font-weight: 600;
        }

        /* Carousel */
        .carousel-container {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 0 2rem;
        }

        .carousel-arrow {
          width: 55px;
          height: 55px;
          border: none;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .carousel-arrow:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .carousel-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .mentorship-list {
          flex: 1;
          display: flex;
          gap: 2rem;
          overflow: hidden;
          min-height: 300px;
        }

        /* No Mentorships */
        .no-mentorships {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .no-mentorships-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .no-mentorships-icon i {
          font-size: 2rem;
          color: #9ca3af;
        }

        .no-mentorships h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .no-mentorships p {
          color: #6b7280;
          font-size: 1rem;
        }

        /* Pagination */
        .pagination-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .pagination-dot {
          width: 12px;
          height: 12px;
          border: none;
          border-radius: 50%;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-dot.active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          transform: scale(1.2);
        }

        .pagination-dot:hover {
          background: #9ca3af;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .mentorship-list {
            gap: 1.5rem;
          }
          
          .results-section {
            padding: 40px 0 60px;
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
          }

          .hero-description {
            font-size: 1.1rem;
          }

          .floating-icon {
            display: none;
          }

          .filters-section {
            padding: 40px 0;
          }

          .filters-container {
            padding: 0 1rem;
          }

          .filter-row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .results-title {
            font-size: 1.5rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .carousel-container {
            flex-direction: column;
            gap: 1.5rem;
          }

          .carousel-arrow {
            display: none;
          }

          .mentorship-list {
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }

          .no-mentorships {
            margin: 0 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-section {
            padding: 60px 0 80px;
          }

          .filters-section {
            padding: 30px 0;
          }

          .results-section {
            padding: 30px 0 50px;
          }

          .carousel-container {
            padding: 0 1rem;
          }

          .filter-input {
            padding: 14px 16px;
          }

          .active-filters {
            margin-top: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Mentee_Dashboard;