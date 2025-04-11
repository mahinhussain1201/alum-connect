import React, { useEffect, useState } from "react";
import "./Activities.css";
import NavBar from "./NavBar";
import { fetchUpcomingEvents, fetchPastEvents } from "../components/fetchData";
import { registerForEvent } from "../components/postData";

const Activities = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const [registerErrorEventId, setRegisterErrorEventId] = useState(null);


  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const [upcoming, past] = await Promise.all([
          fetchUpcomingEvents(),
          fetchPastEvents(),
        ]);
        setUpcomingEvents(upcoming);
        setPastEvents(past);

        console.log("Upcoming:", upcoming);
        console.log("Past:", past);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    setRegisteringEventId(eventId);
    setRegisterErrorEventId(null);
  
    try {
      const response = await registerForEvent(eventId);
  
      if (response.success) {
        setUpcomingEvents((prev) =>
          prev.map((ev) =>
            ev.id === eventId
              ? { ...ev, registered: true, attendeesCount: ev.attendeesCount + 1 }
              : ev
          )
        );
      } else {
        // Backend returned success: false
        console.warn("Registration failed:", response.message);
        setRegisterErrorEventId(eventId);
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      setRegisterErrorEventId(eventId);
    } finally {
      setRegisteringEventId(null);
    }
  };
  
  

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTimeRange = (start, end) =>
    `${new Date(start).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${new Date(end).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

  const getTimeAway = (start) => {
    const diff = Math.ceil(
      (new Date(start) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return diff <= 0 ? "Today" : `${diff} ${diff === 1 ? "day" : "days"} left`;
  };

  const groupPastEventsByMonth = (events) => {
    const groups = {};
    events.forEach((ev) => {
      const date = new Date(ev.startTime);
      const key = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(ev);
    });
    return Object.entries(groups).map(([month, events]) => ({ month, events }));
  };

  return (
    <>
      <NavBar />
      <div className="activities-container">
        <h1 className="activities-title">Activities</h1>
        <p className="activities-subtitle">
          Discover and participate in events organized
        </p>

        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={`tab-button ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
        </div>

        <div className="events-container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
              <div className="loading-text">Loading events...</div>
            </div>
          ) : activeTab === "upcoming" ? (
            <div className="upcoming-events">
              {upcomingEvents.length === 0 ? (
                <div className="no-events-message">
                  No upcoming events scheduled
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div className="event-card" key={event.id}>
                    <div className="event-time-badge">
                      {getTimeAway(event.startTime)}
                    </div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                      <p>📅 {formatDate(event.startTime)}</p>
                      <p>
                        ⏰ {formatTimeRange(event.startTime, event.endTime)}
                      </p>
                      <p>
                        📍{" "}
                        {event.mode === "VIRTUAL" ? (
                          <a
                            href={event.location}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="virtual-link"
                          >
                            Join Virtual Event
                          </a>
                        ) : (
                          event.location
                        )}
                      </p>
                      <p>👥 {event.attendeesCount} students attending</p>
                    </div>
                    {event.registered ? (
                      <button className="registered-button" disabled>
                        ✅ Registered
                      </button>
                    ) : (
                      <button
                        className={`register-button ${
                          registeringEventId === event.id ? "registering" : ""
                        }`}
                        onClick={() => handleRegister(event.id)}
                        disabled={registeringEventId === event.id}
                      >
                        {registeringEventId === event.id
                          ? "Registering..."
                          : "Register Now"}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="past-events">
              {pastEvents.length === 0 ? (
                <div className="no-events-message">
                  No past events available
                </div>
              ) : (
                groupPastEventsByMonth(pastEvents).map((monthGroup, index) => (
                  <div key={`month-${index}`}>
                    <h3 className="past-events-month">{monthGroup.month}</h3>
                    {monthGroup.events.map((event) => (
                      <div className="event-card" key={event.id}>
                        <h4 className="past-event-title">{event.title}</h4>
                        <p className="past-event-description">
                          {event.description}
                        </p>
                        <div className="past-event-details">
                          <p>📅 {formatDate(event.startTime)}</p>
                          <p>👥 {event.attendeesCount} students attended</p>
                        </div>
                        <div className="past-event-actions">
                          <button className="resources-button">
                            Resources
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Activities;
