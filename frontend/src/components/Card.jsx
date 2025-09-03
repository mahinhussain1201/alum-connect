import React, { useState } from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Card = ({ title, description, icon, link, disabled, disabledMessage }) => {
  const navigate = useNavigate();
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMentor, setIsMentor] = useState(null);

  // const handleClick = async () => {
  //   if (title === "Enroll as Startup Mentors") {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       navigate("/login");
  //       return;
  //     }
  
  //     try {
  //       const response = await axios.get("http://localhost:8000/api/alumni/mentorshipStatus", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }).catch((error)=>console.log(error)
  //       );
  //       console.log(response.data.isMentor);
        
  //       // Navigate based on API response
  //       navigate(response.data.isMentor ? "/mentorDashboard" : "/mentorRegistration");
        
  //     } catch (error) {
  //       console.error("Error checking mentor status:", error);
  //       alert("Failed to check mentor status. Please try again.");
  //     }
  //     return;
  //   }
  
  //   if (!disabled) navigate(link);
  // };

  return (
    <>
      <div
        className={`modern-card ${disabled ? "disabled" : ""}`}
        // onClick={handleClick}
        onMouseMove={(e) => {
          if (disabled) {
            setTooltipPosition({ x: e.clientX, y: e.clientY });
            setShowTooltip(true);
          }
        }}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="card-gradient-bg"></div>
        
        <div className="card-content">
          <div className="card-icon-wrapper">
            <div className="card-icon">{icon}</div>
          </div>
          
          <div className="card-text">
            <h2 className="card-title">{title}</h2>
            <p className="card-description">{description}</p>
          </div>

          <div className="card-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>

        {!disabled && <div className="card-shine"></div>}

        {disabled && showTooltip && (
          <div
            className="modern-tooltip"
            style={{
              top: tooltipPosition.y + 10 + "px",
              left: tooltipPosition.x + 10 + "px",
            }}
          >
            <div className="tooltip-content">
              <i className="fas fa-lock"></i>
              {disabledMessage}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modern-card {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 2rem;
          min-height: 200px;
          width: 320px; 
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
        }

        .modern-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%);
          pointer-events: none;
        }

        .card-gradient-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .modern-card:hover .card-gradient-bg {
          opacity: 1;
        }

        .card-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
          flex: 1;
        }

        .card-icon-wrapper {
          margin-bottom: 1.5rem;
        }

        .card-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }

        .card-text {
          flex: 1;
          margin-bottom: 1rem;
        }

        .card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
          transition: color 0.3s ease;
        }

        .card-description {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
          transition: color 0.3s ease;
        }

        .card-arrow {
          align-self: flex-end;
          width: 40px;
          height: 40px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateX(10px);
        }

        .card-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: translateX(-100%) translateY(-100%) rotate(45deg);
          transition: transform 0.6s ease;
        }

        /* Hover Effects */
        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .modern-card:hover .card-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
        }

        .modern-card:hover .card-title {
          color: #3b82f6;
        }

        .modern-card:hover .card-description {
          color: #475569;
        }

        .modern-card:hover .card-arrow {
          opacity: 1;
          transform: translateX(0);
          background: #3b82f6;
          color: white;
        }

        .modern-card:hover .card-shine {
          transform: translateX(100%) translateY(100%) rotate(45deg);
        }

        /* Disabled State */
        .modern-card.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .modern-card.disabled::before {
          background: linear-gradient(135deg, rgba(148, 163, 184, 0.05) 0%, rgba(148, 163, 184, 0.05) 100%);
        }

        .modern-card.disabled .card-icon {
          background: linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%);
          box-shadow: 0 4px 15px rgba(148, 163, 184, 0.2);
        }

        .modern-card.disabled:hover {
          transform: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .modern-card.disabled:hover .card-icon {
          transform: none;
          box-shadow: 0 4px 15px rgba(148, 163, 184, 0.2);
        }

        .modern-card.disabled:hover .card-title {
          color: #1e293b;
        }

        .modern-card.disabled:hover .card-description {
          color: #64748b;
        }

        .modern-card.disabled .card-arrow {
          display: none;
        }

        /* Tooltip */
        .modern-tooltip {
          position: fixed;
          z-index: 1000;
          pointer-events: none;
          animation: tooltipFadeIn 0.2s ease;
        }

        .tooltip-content {
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 200px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tooltip-content i {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Active State */
        .modern-card:active {
          transform: translateY(-4px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modern-card {
            padding: 1.5rem;
            min-height: 180px;
          }

          .card-icon {
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
          }

          .card-title {
            font-size: 1.2rem;
          }

          .card-description {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .modern-card {
            padding: 1.25rem;
            min-height: 160px;
          }

          .card-icon {
            width: 45px;
            height: 45px;
            font-size: 1.1rem;
          }

          .card-title {
            font-size: 1.1rem;
          }

          .card-description {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
};

export default Card;