import React, { useState, useEffect } from "react";
import "./HomeScreen.css";
import Card from "../components/Card";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NavBar from "./NavBar";
import { fetchUserInfo } from "../components/fetchData";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();
  const alumniCards = [
    {
      title: "Internships",
      description: "Find internship opportunities through alumni network",
      icon: <i className="fas fa-briefcase"></i>,
      link: "/internships",
    },
    {
      title: "Enroll as Startup Mentors",
      description: "Guide and support budding entrepreneurs",
      icon: <i className="fas fa-user-tie"></i>,
      link: "/mentorDashboard",
    },
    // {
    //   title: "Network with Alumni",
    //   description: "Connect with graduates from your alma mater",
    //   icon: <i className="fas fa-users"></i>,
    //   link: "/event3",
    // },
    // {
    //   title: "Articles",
    //   description: "Read insightful articles from alumni.",
    //   icon: <i className="fas fa-newspaper"></i>,
    //   link: "/event4",
    // },
    // {
    //   title: "Alumni Event 5",
    //   description: "Join us for the upcoming alumni event.",
    //   icon: <i className="fas fa-calendar-alt"></i>,
    //   link: "/event5",
    // },
  ];

  const studentCards = [
    {
      title: "Opportunities",
      description: "Explore career and learning opportunities",
      icon: <i className="fas fa-lightbulb"></i>,
      link: "/internships",
    },
    {
      title: "Find Mentors",
      description: "Get connected with mentors.",
      icon: <i className="fas fa-user-friends"></i>,
      link: "/menteeDashboard",
    },
    // {
    //   title: "Chatpoint",
    //   description: "Engage in discussions and chats.",
    //   icon: <i className="fas fa-comments"></i>,
    //   link: "/workshop3",
    // },
    // {
    //   title: "Build Team",
    //   description: "Collaborate and build your team.",
    //   icon: <i className="fas fa-users-cog"></i>,
    //   link: "/workshop4",
    // },
    // {
    //   title: "Student Workshop 5",
    //   description: "Join our student workshop for skills development.",
    //   icon: <i className="fas fa-tools"></i>,
    //   link: "/workshop5",
    // },
  ];

  const [currentIndexAlumni, setCurrentIndexAlumni] = useState(0);
  const [currentIndexStudents, setCurrentIndexStudents] = useState(0);
  const cardsPerPage = 4;
  const [role, setRole] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);

  const nextPageAlumni = () => {
    if (currentIndexAlumni + 1 < alumniCards.length) {
      setCurrentIndexAlumni(currentIndexAlumni + 1);
    }
  };

  const prevPageAlumni = () => {
    if (currentIndexAlumni > 0) {
      setCurrentIndexAlumni(currentIndexAlumni - 1);
    }
  };

  const nextPageStudents = () => {
    if (currentIndexStudents + 1 < studentCards.length) {
      setCurrentIndexStudents(currentIndexStudents + 1);
    }
  };

  const prevPageStudents = () => {
    if (currentIndexStudents > 0) {
      setCurrentIndexStudents(currentIndexStudents - 1);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        
        const userInfo = await fetchUserInfo();
        if (userInfo) {
          setRole(userInfo.role);
        }
      } catch (error) {
        console.log("Error:", error.message);
      } finally {
        setUserInfoLoading(false);
      }
    };
    getUserInfo();
  }, []);

  if (userInfoLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading, please wait...</div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="home-screen">
        {!role ? (
          <>
            <section className="welcome-section">
              <div className="welcome-content">
                <div className="welcome-text">
                  <h1 className="welcome-title">Welcome to Alumni Connect</h1>
                  <p className="welcome-description">
                    Empowering connections, fostering growth, and building a
                    stronger alumni community.
                  </p>
                  <button className="join-button" onClick={() => navigate("/register")}>
                    <i className="fas fa-rocket" style={{ marginRight: '8px' }}></i>
                    Join Our Network
                  </button>
                </div>
                <div className="welcome-visual">
                  <div className="floating-card">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div className="floating-card delay-1">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="floating-card delay-2">
                    <i className="fas fa-handshake"></i>
                  </div>
                </div>
              </div>
            </section>

            <section className="alumni-section">
              <div className="section-header">
                <h2 className="section-title">
                  <div className="section-icon">
                    <i className="fas fa-user-graduate"></i>
                  </div>
                  Connect with your Alumni
                </h2>
                <p className="section-subtitle">Discover opportunities and mentorship through our alumni network</p>
              </div>
              <div className="carousel">
                <button
                  onClick={prevPageAlumni}
                  disabled={currentIndexAlumni === 0}
                  className="carousel-button carousel-button-left"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="card-container">
                  {alumniCards
                    .slice(
                      currentIndexAlumni,
                      currentIndexAlumni + cardsPerPage
                    )
                    .map((card, index) => (
                      <Card
                        key={index}
                        {...card}
                        disabled={true}
                        disabledMessage="Please sign in."
                      />
                    ))}
                </div>
                <button
                  onClick={nextPageAlumni}
                  disabled={currentIndexAlumni + 1 >= alumniCards.length}
                  className="carousel-button carousel-button-right"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </section>

            <section className="students-section">
              <div className="section-header">
                <h2 className="section-title">
                  <div className="section-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  Students Corner
                </h2>
                <p className="section-subtitle">Explore resources and connect with mentors to accelerate your growth</p>
              </div>
              <div className="carousel">
                <button
                  onClick={prevPageStudents}
                  disabled={currentIndexStudents === 0}
                  className="carousel-button carousel-button-left"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="card-container">
                  {studentCards
                    .slice(
                      currentIndexStudents,
                      currentIndexStudents + cardsPerPage
                    )
                    .map((card, index) => (
                      <Card
                        key={index}
                        {...card}
                        disabled={true}
                        disabledMessage="Please sign in."
                      />
                    ))}
                </div>
                <button
                  onClick={nextPageStudents}
                  disabled={currentIndexStudents + 1 >= studentCards.length}
                  className="carousel-button carousel-button-right"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </section>
          </>
        ) : role === "ALUMNI" ? (
          <section className="dashboard-section alumni-dashboard">
            <div className="dashboard-header">
              <h2 className="dashboard-title">
                <div className="dashboard-icon">
                  <i className="fas fa-user-graduate"></i>
                </div>
                Alumni Dashboard
              </h2>
              <p className="dashboard-subtitle">Manage your mentorship opportunities and connect with students</p>
            </div>
            <div className="cards-grid">
              {alumniCards.map((card, index) => (
                <Card key={index} {...card} disabled={false} />
              ))}
            </div>
          </section>
        ) : (
          <section className="dashboard-section students-dashboard">
            <div className="dashboard-header">
              <h2 className="dashboard-title">
                <div className="dashboard-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                Students Dashboard
              </h2>
              <p className="dashboard-subtitle">Explore opportunities and connect with mentors to advance your career</p>
            </div>
            <div className="cards-grid">
              {studentCards.map((card, index) => (
                <Card key={index} {...card} disabled={false} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer/>
      <style jsx>{`
        /* Base Styles */
        .home-screen {
          min-height: calc(100vh - 70px);
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: system-ui, -apple-system, sans-serif;
          position: relative;
          z-index: 1;
        }

        .home-screen * {
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

        /* Welcome Section */
        .welcome-section {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          padding: 80px 0 100px;
          position: relative;
          overflow: hidden;
        }

        .welcome-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .welcome-content {
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

        .welcome-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .welcome-description {
          font-size: 1.25rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 2.5rem;
          line-height: 1.6;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .join-button {
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
          border: none;
          color: white;
          padding: 18px 32px;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .join-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(245, 158, 11, 0.6);
        }

        .welcome-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .floating-card {
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

        .floating-card i {
          font-size: 3rem;
          color: white;
          opacity: 0.9;
        }

        .floating-card.delay-1 {
          animation-delay: -1s;
          top: -60px;
          right: -40px;
          width: 100px;
          height: 100px;
        }

        .floating-card.delay-2 {
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

        /* Section Headers */
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .section-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .section-icon i {
          font-size: 1.8rem;
          color: white;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Alumni & Students Sections */
        .alumni-section,
        .students-section {
          padding: 80px 2rem 100px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .students-section {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        }

        /* Carousel Responsive Adjustments */
        .carousel {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          position: relative;
          padding: 1rem 0;
        }

        .carousel-button {
          width: 50px;
          height: 50px;
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
          z-index: 2;
        }

        .carousel-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .carousel-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }

        .card-container {
          flex: 1;
          display: flex;
          gap: 1.5rem;
          overflow: hidden;
          justify-content: center;
          min-height: 200px;
          align-items: stretch;
        }

        /* Dashboard Sections */
        .dashboard-section {
          padding: 80px 2rem 100px;
          max-width: 1400px;
          margin: 0 auto;
          min-height: calc(100vh - 170px);
        }

        .alumni-dashboard {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .students-dashboard {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .dashboard-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          font-size: 2.8rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .dashboard-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .dashboard-icon i {
          font-size: 2rem;
          color: white;
        }

        .dashboard-subtitle {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          justify-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Card Responsive Styles */
        .card-container > * {
          flex: 1;
          min-width: 250px;
          max-width: 350px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .card-container > * {
            min-width: 220px;
            max-width: 300px;
          }

          .cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .welcome-content {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
            padding: 0 1rem;
          }

          .welcome-title {
            font-size: 2.5rem;
          }

          .welcome-description {
            font-size: 1.1rem;
          }

          .section-title,
          .dashboard-title {
            font-size: 2rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .carousel {
            gap: 1rem;
            flex-direction: column;
            align-items: center;
          }

          .carousel-button {
            display: none;
          }

          .card-container {
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .card-container > * {
            flex: 1 1 280px;
            min-width: 280px;
            max-width: 100%;
          }

          .alumni-section,
          .students-section,
          .dashboard-section {
            padding: 60px 1rem 80px;
          }

          .floating-card {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .welcome-title {
            font-size: 2rem;
          }

          .section-title,
          .dashboard-title {
            font-size: 1.5rem;
          }

          .cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            padding: 0 1rem;
          }

          .card-container {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .card-container > * {
            flex: none;
            width: 100%;
            max-width: 350px;
            min-width: auto;
          }
        }
      `}</style>
    </>
  );
};

export default HomeScreen;