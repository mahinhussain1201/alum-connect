import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Youtube,
  Globe,
  Users,
  BookOpen,
  Award,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About IIT KGP', href: 'https://www.iitkgp.ac.in/about', icon: BookOpen },
    { name: 'Admissions', href: 'https://www.iitkgp.ac.in/admissions', icon: Users },
    { name: 'Academics', href: 'https://www.iitkgp.ac.in/academics', icon: Award },
    { name: 'Research', href: 'https://www.iitkgp.ac.in/research', icon: ExternalLink },
    { name: 'Campus Life', href: 'https://www.iitkgp.ac.in/campus-life', icon: Heart },
    { name: 'Placements', href: 'https://www.iitkgp.ac.in/placement', icon: ExternalLink }
  ];

  const alumniLinks = [
    { name: 'Alumni Directory', href: '/alumni-directory' },
    { name: 'Mentorship Program', href: '/mentorship' },
    { name: 'Alumni Events', href: '/events' },
    { name: 'Giving Back', href: '/donate' },
    { name: 'Success Stories', href: '/stories' },
    { name: 'Newsletter', href: '/newsletter' }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Support', href: '/support' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Community Guidelines', href: '/guidelines' },
    { name: 'Report Issue', href: '/report' }
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/IITKharagpur', icon: Facebook, color: '#1877F2' },
    { name: 'Twitter', href: 'https://twitter.com/IITKharagpur', icon: Twitter, color: '#1DA1F2' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/school/indian-institute-of-technology-kharagpur/', icon: Linkedin, color: '#0077B5' },
    { name: 'Instagram', href: 'https://www.instagram.com/iit.kgp/', icon: Instagram, color: '#E4405F' },
    { name: 'YouTube', href: 'https://www.youtube.com/user/IITKharagpurOfficial', icon: Youtube, color: '#FF0000' }
  ];

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-content">
        <div className="footer-container">
          
          {/* IIT KGP Info Section */}
          <div className="footer-section main-section">
            <div className="footer-logo">
              <div className="logo-icon">
                <Globe size={32} />
              </div>
              <div className="logo-text">
                <h3>IIT Kharagpur</h3>
                <p>Alumni Connect</p>
              </div>
            </div>
            
            <p className="footer-description">
              Connecting generations of IIT Kharagpur alumni worldwide. 
              Fostering mentorship, collaboration, and lifelong bonds within 
              our prestigious academic community.
            </p>
            
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={16} />
                <span>Kharagpur, West Bengal 721302, India</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+91 3222 255221</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>alumni@iitkgp.ac.in</span>
              </div>
            </div>
            
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
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="section-title">IIT Kharagpur</h4>
            <ul className="footer-links">
              {quickLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="footer-link"
                    >
                      <IconComponent size={14} />
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Alumni Services */}
          <div className="footer-section">
            <h4 className="section-title">Alumni Services</h4>
            <ul className="footer-links">
              {alumniLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="section-title">Support</h4>
            <ul className="footer-links">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="footer-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="footer-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">60K+</div>
              <div className="stat-label">Alumni Worldwide</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1951</div>
              <div className="stat-label">Established</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">19</div>
              <div className="stat-label">Departments</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Top 5</div>
              <div className="stat-label">Engineering Institute</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} Indian Institute of Technology Kharagpur. All rights reserved.</p>
            </div>
            <div className="bottom-links">
              <a href="/accessibility" className="bottom-link">Accessibility</a>
              <span className="separator">•</span>
              <a href="/sitemap" className="bottom-link">Sitemap</a>
              <span className="separator">•</span>
              <a href="https://www.iitkgp.ac.in" className="bottom-link" target="_blank" rel="noopener noreferrer">
                Official Website <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        
        .footer {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
          margin-top: 0;
          position: relative;
          z-index: 10;
        }

        .footer-content {
          padding: 60px 0 40px;
          position: relative;
        }

        .footer-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="footerdots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23footerdots)"/></svg>');
          opacity: 0.2;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        .footer-content .footer-container {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .main-section {
          max-width: 400px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .logo-text h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          line-height: 1.2;
        }

        .logo-text p {
          margin: 0;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .footer-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .contact-info {
          margin-bottom: 2rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }

        .contact-item svg {
          color: rgba(255, 255, 255, 0.8);
          flex-shrink: 0;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-link:hover {
          background: var(--hover-color, #3b82f6);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          border-color: var(--hover-color, #3b82f6);
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          margin-top: 0;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-link:hover {
          color: rgba(255, 255, 255, 1);
          transform: translateX(4px);
        }

        .stats-section {
          background: rgba(0, 0, 0, 0.15);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 3rem 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          text-align: center;
        }

        .stat-item {
          padding: 1rem;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .footer-bottom {
          background: rgba(0, 0, 0, 0.2);
          padding: 1.5rem 0;
        }

        .bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .copyright p {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
        }

        .bottom-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .bottom-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: color 0.2s ease;
        }

        .bottom-link:hover {
          color: rgba(255, 255, 255, 1);
        }

        .separator {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-content .footer-container {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .footer-content .footer-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-content {
            padding: 40px 0 30px;
          }

          .footer-container {
            padding: 0 1rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .stat-number {
            font-size: 2rem;
          }

          .bottom-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .bottom-links {
            flex-wrap: wrap;
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .main-section {
            max-width: 100%;
          }

          .footer-logo {
            justify-content: center;
            text-align: center;
          }

          .footer-description {
            text-align: center;
          }

          .contact-info {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .contact-item {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;