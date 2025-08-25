import React, { useState, useEffect } from "react";
import "./HomeScreen.css";
import Card from "../components/Card";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NavBar from "./NavBar";
import { fetchUserInfo } from "../components/fetchData";

const HomeScreen = () => {
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#C45A12",
          backgroundColor: "#f9f9f9",
        }}
      >
        Loading, please wait...
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
              <h1>Welcome to Alumni Connect</h1>
              <p>
                Empowering connections, fostering growth, and building a
                stronger alumni community.
              </p>
              <button className="join-button">Join Our Network</button>
            </section>

            <section className="alumni-section">
              <h2>
                <i
                  className="fas fa-user-graduate"
                  style={{ marginRight: "8px" }}
                ></i>
                Connect with your Alumni
              </h2>
              <div className="carousel">
                <button
                  onClick={prevPageAlumni}
                  disabled={currentIndexAlumni === 0}
                  className="carousel-button"
                >
                  ❮
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
                  className="carousel-button"
                >
                  ❯
                </button>
              </div>
            </section>

            <section className="students-section">
              <h2>
                <i
                  className="fas fa-graduation-cap"
                  style={{ marginRight: "8px" }}
                ></i>
                Students Corner
              </h2>
              <div className="carousel">
                <button
                  onClick={prevPageStudents}
                  disabled={currentIndexStudents === 0}
                  className="carousel-button"
                >
                  ❮
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
                  className="carousel-button"
                >
                  ❯
                </button>
              </div>
            </section>
          </>
        ) : role === "ALUMNI" ? (
          <section className="alumni-section full-screen-grid">
            <h2>
              <i className="fas fa-user-graduate"></i>Alumni Dashboard
            </h2>
            <div className="cards-grid">
              {alumniCards.map((card, index) => (
                <Card key={index} {...card} disabled={false} />
              ))}
            </div>
          </section>
        ) : (
          <section className="students-section full-screen-grid">
            <h2>
              <i className="fas fa-graduation-cap"></i>Students Dashboard
            </h2>
            <div className="cards-grid">
              {studentCards.map((card, index) => (
                <Card key={index} {...card} disabled={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default HomeScreen;
