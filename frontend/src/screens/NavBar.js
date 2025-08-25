import React, { useState, useEffect } from "react";
import logo from "../media/logo.png";
import { Menu, X, User, LogOut, Home, Users, UserPlus, Activity, Newspaper, FileText } from "lucide-react";

function NavBar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const profilePic = ""; // Add logic to fetch profile picture URL
  const defaultProfilePic = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setShowProfileDropdown(false);
      }
      if (!e.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setShowProfileDropdown(false);
    setShowMobileMenu(false);
    window.location.href = "/signin";
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/aboutus", label: "About Us", icon: Users },
    { path: "/register", label: "Register", icon: UserPlus },
    { path: "/activities", label: "Activities", icon: Activity },
    { path: "/latest", label: "Latest", icon: Newspaper },
    { path: "/content", label: "Content", icon: FileText },
  ];

  const NavLink = ({ to, children, className = "", onClick, style = {} }) => (
    <a 
      href={to} 
      className={className}
      onClick={onClick}
      style={{ textDecoration: 'none', ...style }}
    >
      {children}
    </a>
  );

  return (
    <>
      <header className="navbar-header">
        <nav className="navbar-container">
          
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-icon">
              <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </div>
            <div className="logo-text">
              Alumni Connect
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  className="nav-item"
                >
                  <IconComponent size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {/* Right Side - Auth Section */}
          <div className="auth-section">
            
            {/* Desktop Auth */}
            <div className="desktop-auth">
              {isAuthenticated ? (
                <div className="dropdown-container">
                  <button
                    className="profile-button"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <img
                      src={profilePic || defaultProfilePic}
                      alt="Profile"
                      className="profile-image"
                    />
                    <span>Profile</span>
                  </button>

                  {showProfileDropdown && (
                    <div className="dropdown-menu">
                      <NavLink
                        to="/profile"
                        className="dropdown-item"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <User size={16} />
                        Profile
                      </NavLink>
                      <button
                        className="dropdown-item logout-item"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink to="/signin" className="signin-button">
                  <img
                    src={defaultProfilePic}
                    alt="Sign In"
                    className="signin-image"
                  />
                  Sign In
                </NavLink>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn mobile-menu-container"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X size={20} color="white" />
              ) : (
                <Menu size={20} color="white" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${showMobileMenu ? 'mobile-menu-open' : ''}`}>
          <div className="mobile-menu-content">
            {/* Mobile Navigation Items */}
            <div className="mobile-nav-items">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    className="mobile-nav-item"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <IconComponent size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>

            {/* Mobile Auth Section */}
            <div className="mobile-auth">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/profile"
                    className="mobile-auth-item"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <img
                      src={profilePic || defaultProfilePic}
                      alt="Profile"
                      className="mobile-profile-image"
                    />
                    Profile
                  </NavLink>
                  <button
                    className="mobile-auth-item mobile-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/signin"
                  className="mobile-signin"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <img
                    src={defaultProfilePic}
                    alt="Sign In"
                    className="mobile-signin-image"
                  />
                  Sign In
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </header>

      <style>{`
        /* Base Styles */
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          border-bottom: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        /* Logo Section */
        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .logo-text {
          color: white;
          font-weight: 700;
          font-size: 1.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        /* Desktop Navigation */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          cursor: pointer;
          background: transparent;
          border: none;
        }

        .nav-item:hover {
          background-color: rgba(255,255,255,0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* Auth Section */
        .auth-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .desktop-auth {
          display: block;
        }

        .dropdown-container {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 12px;
          padding: 8px 16px;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .profile-button:hover {
          background-color: rgba(255,255,255,0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .profile-image {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.4);
        }

        .signin-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 12px;
          padding: 8px 16px;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .signin-button:hover {
          background-color: rgba(255,255,255,0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .signin-image {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          opacity: 0.9;
        }

        /* Dropdown Menu */
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          border: 1px solid rgba(0,0,0,0.1);
          overflow: hidden;
          min-width: 180px;
          z-index: 1000;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          color: #374151;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .dropdown-item:not(:last-child) {
          border-bottom: 1px solid #f3f4f6;
        }

        .dropdown-item:hover {
          background-color: #f8fafc;
          color: #1e40af;
        }

        .logout-item:hover {
          background-color: #fef2f2;
          color: #dc2626;
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-menu-btn:hover {
          background-color: rgba(255,255,255,0.3);
        }

        /* Mobile Menu */
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          border-top: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu-open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }

        .mobile-nav-items {
          margin-bottom: 1rem;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s ease;
          margin-bottom: 4px;
        }

        .mobile-nav-item:hover {
          background-color: rgba(255,255,255,0.2);
        }

        .mobile-auth {
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 1rem;
        }

        .mobile-auth-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s ease;
          margin-bottom: 4px;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .mobile-auth-item:hover {
          background-color: rgba(255,255,255,0.2);
        }

        .mobile-logout:hover {
          background-color: rgba(248, 113, 113, 0.2);
          color: #fca5a5;
        }

        .mobile-signin {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: rgba(255,255,255,0.15);
          border: 2px solid rgba(255,255,255,0.3);
        }

        .mobile-signin:hover {
          background-color: rgba(255,255,255,0.25);
        }

        .mobile-profile-image, .mobile-signin-image {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.4);
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          
          .desktop-auth {
            display: none;
          }
          
          .mobile-menu-btn {
            display: flex;
          }

          .logo-text {
            font-size: 1.25rem;
          }

          .navbar-container {
            padding: 0 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .logo-text {
            display: none;
          }
          
          .navbar-container {
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default NavBar;