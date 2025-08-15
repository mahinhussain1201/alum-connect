import React, { useState, useEffect } from "react";
import "./Mentee_Dashboard.css";
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
    
    
    // fetchMentorProfile(1).then(data=> console.log(data));
    // const dummyMentorships = [
    //   {
    //     id: 1,
    //     mentorName: "John Doe",
    //     keywords: ["SOFTWARE", "CLOUD_COMPUTING"],
    //     experience: 8,
    //     interaction: "HIGH",
    //     maxMentees: 5,
    //     currentMentees: 2,
    //     levelsOfMentees: ["THIRD_YEAR", "FOURTH_YEAR"],
    //     interests: ["MENTORING_AND_PARTNERSHIP"],
    //     linkedinProfile: "https://linkedin.com/in/johndoe",
    //     currentOrganization: "Google",
    //     passingYear: 2015,
    //     status: "PENDING",
    //   },
    //   {
    //     id: 2,
    //     mentorName: "Jane Smith",
    //     keywords: ["BLOCKCHAIN", "CYBERSECURITY"],
    //     experience: 6,
    //     interaction: "MEDIUM",
    //     maxMentees: 10,
    //     currentMentees: 3,
    //     levelsOfMentees: ["SECOND_YEAR", "THIRD_YEAR"],
    //     interests: ["PRO_BONO_HELP"],
    //     linkedinProfile: "https://linkedin.com/in/janesmith",
    //     currentOrganization: "Microsoft",
    //     passingYear: 2018,
    //     status: "ACTIVE",
    //   },
    //   {
    //     id: 3,
    //     mentorName: "Mike Johnson",
    //     keywords: ["MACHINE_LEARNING"],
    //     experience: 7,
    //     interaction: "LOW",
    //     maxMentees: 8,
    //     currentMentees: 5,
    //     levelsOfMentees: ["FOURTH_YEAR"],
    //     interests: ["PRO_BONO_HELP"],
    //     linkedinProfile: "https://linkedin.com/in/mikejohnson",
    //     currentOrganization: "Amazon",
    //     passingYear: 2016,
    //   },
    // ];
    // setMentorships(dummyMentorships);
    fetchMentors().then(data => {
      
      setMentorships(data)
      console.log(data);
      // console.log(dummyMentorships);
      
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
    return <div className="loading-screen">Loading, please wait...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="mentee-dashboard">
        <h1>Mentorships</h1>

        <div className="filters-container">
          <div className="filter-row">
            <div className="filter-group">
              <div
                className="filter-input"
                onClick={() => toggleDropdown("domain")}
              >
                <span>
                  {selectedDomains.length > 0
                    ? `${selectedDomains.length} Domains Selected`
                    : "All Domains"}
                </span>
                <i
                  className={`fas fa-chevron-${
                    openDropdown === "domain" ? "up" : "down"
                  }`}
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
                <span>
                  {selectedStatus ? `Status: ${selectedStatus}` : "All Status"}
                </span>
                <i
                  className={`fas fa-chevron-${
                    openDropdown === "status" ? "up" : "down"
                  }`}
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
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="carousel-container">
          <button
            className="carousel-arrow left"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            &lt;
          </button>
          
          <div className="mentorship-list">
            {visibleMentorships.length > 0 ? (
              visibleMentorships.map((mentorship) => (
                <MentorshipCard key={mentorship.id} {...mentorship} />
              ))
            ) : (
              <p className="no-mentorships">No mentorships match your filters</p>
            )}
          </div>

          <button
            className="carousel-arrow right"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default Mentee_Dashboard;