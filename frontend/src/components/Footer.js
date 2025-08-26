import React from 'react';
import { 
  MapPin, 
  Mail, 
  ExternalLink, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram
} from 'lucide-react';
import logo from "../media/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook', href: '/', icon: Facebook, color: '#1877F2' },
    { name: 'Twitter', href: '/', icon: Twitter, color: '#1DA1F2' },
    { name: 'LinkedIn', href: '/', icon: Linkedin, color: '#0077B5' },
    { name: 'Instagram', href: 'https://www.instagram.com/iit.kgp/', icon: Instagram, color: '#E4405F' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Main Content */}
        <div className="footer-main">
          
          {/* Logo & Info */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="IIT KGP Logo" className="logo-img" />
              <div>
                <h3>Alumni Connect</h3>
                <p>IIT Kharagpur</p>
              </div>
            </div>
            
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={14} />
                <span>Kharagpur, West Bengal</span>
              </div>
              <div className="contact-item">
                <Mail size={14} />
                <span>alumni@iitkgp.ac.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/events">Events</a>
            <a href="/mentorship">Mentorship</a>
            <a href="/support">Support</a>
          </div>

          {/* Social Links */}
          <div className="social-section">
            <p>Follow IIT KGP</p>
            <div className="social-links">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    style={{ '--hover-color': social.color }}
                    title={social.name}
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} IIT Kharagpur. All rights reserved.</p>
          <a href="https://www.iitkgp.ac.in" target="_blank" rel="noopener noreferrer" className="official-link">
            Official Website <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
          margin-top: auto;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          align-items: start;
          margin-bottom: 2rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-img {
          width: 40px;
          height: 40px;
          object-fit: contain;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 8px;
        }

        .footer-logo h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
        }

        .footer-logo p {
          margin: 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .footer-links a:hover {
          color: white;
          transform: translateX(4px);
        }

        .social-section p {
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .social-links {
          display: flex;
          gap: 0.8rem;
        }

        .social-link {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-link:hover {
          background: var(--hover-color);
          color: white;
          transform: translateY(-2px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .footer-bottom p {
          margin: 0;
        }

        .official-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .official-link:hover {
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .footer-container {
            padding: 1.5rem;
          }

          .footer-main {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .footer-logo {
            justify-content: center;
          }

          .contact-info {
            align-items: center;
          }

          .footer-links {
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1.5rem;
          }

          .social-links {
            justify-content: center;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer-container {
            padding: 1rem;
          }

          .footer-main {
            gap: 1.5rem;
          }

          .footer-links {
            flex-direction: column;
            gap: 0.8rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;