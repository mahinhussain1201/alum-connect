import { Link } from "react-router-dom";
import { ChevronRight, Star, Target, Heart, Zap, Shield } from "lucide-react";
import Footer from '../components/Footer';
import NavBar from './NavBar';
// Main About Us Component
function AboutUs() {
  const testimonials = [
    {
      quote: "Alumni Connect helped us find our technical co-founder and secure our seed funding. The community support was incredible.",
      author: "Sarah Johnson",
      title: "Founder, TechStart Inc.",
      rating: 5
    },
    {
      quote: "The mentorship program was game-changing. Our mentor helped us pivot at the right time and scale efficiently.",
      author: "Michael Chen",
      title: "CEO, InnovateX",
      rating: 5
    },
    {
      quote: "Through the bootcamp, we validated our MVP and landed our first 10 enterprise customers within 3 months.",
      author: "Alex Rivera",
      title: "Founder & CTO, DataFlow",
      rating: 5
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to empowering entrepreneurs with the tools and community they need to succeed."
    },
    {
      icon: Heart,
      title: "Community-First",
      description: "Building meaningful connections and fostering collaborative relationships is at our core."
    },
    {
      icon: Zap,
      title: "Innovation-Focused",
      description: "We support cutting-edge ideas and help transform them into successful ventures."
    },
    {
      icon: Shield,
      title: "Trust & Integrity",
      description: "We maintain the highest standards of transparency and ethical business practices."
    }
  ];

  const services = [
    { title: "Networking", description: "Connect with fellow founders, investors, and industry experts through our events and online community.", icon: "🤝" },
    { title: "Team Building", description: "Find co-founders and team members with complementary skills to help bring your vision to life.", icon: "👥" },
    { title: "Mentoring", description: "Get guidance from experienced entrepreneurs who have successfully navigated the startup journey.", icon: "🎯" },
    { title: "Fundraising", description: "Learn how to pitch to investors and connect with funding opportunities to fuel your growth.", icon: "💰" },
    { title: "Startup Support", description: "Access resources and tools to help you navigate the challenges of building and scaling your startup.", icon: "🚀" },
    { title: "Skill Building", description: "Develop the skills you need to succeed through our courses, workshops, and learning resources.", icon: "📚" },
    { title: "Workshops", description: "Participate in hands-on workshops led by industry experts to solve real business challenges.", icon: "🛠️" },
    { title: "Startup Bootcamp", description: "Accelerate your startup's growth with our intensive bootcamp programs designed to fast-track success.", icon: "⚡" }
  ];

  const stats = [
    { number: "500+", label: "Startups Supported" },
    { number: "1000+", label: "Community Members" },
    { number: "$50M+", label: "Funding Raised" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="about-us-page">
      <NavBar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Empowering Early-Stage 
              <span className="gradient-text"> Startups</span> to Thrive
            </h1>
            <p className="hero-description">
              At Alumni Connect, we're dedicated to providing the resources, mentorship, and community 
              that early-stage startups need to transform innovative ideas into successful ventures.
            </p>
            <div className="hero-buttons">
            <Link to="/register" className="primary-button">
              Join Our Community
              <ChevronRight size={20} />
            </Link>
              {/* <button className="secondary-button">
                Learn More
              </button> */}
            </div>
          </div>
          
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Who We Are</h2>
            <p className="section-subtitle">
              Founded by passionate entrepreneurs and industry veterans, Alumni Connect bridges 
              the gap between innovative ideas and successful businesses.
            </p>
          </div>
          
          <div className="who-we-are-grid">
            <div className="who-we-are-content">
              <p className="content-text">
                We understand the challenges that early-stage startups face because we've been there. 
                Our platform is designed to provide the support, knowledge, and connections that we 
                wish we had when we were starting out.
              </p>
              <p className="content-text">
                Our diverse community includes founders at every stage, from idea validation to IPO, 
                creating a rich ecosystem of knowledge sharing and collaboration.
              </p>
            </div>
            
            <div className="community-grid">
              <div className="community-card">
                <div className="community-icon">👨‍💼</div>
                <h3>Founders</h3>
                <p>Passionate entrepreneurs building the future</p>
              </div>
              <div className="community-card">
                <div className="community-icon">💼</div>
                <h3>Investors</h3>
                <p>Strategic partners funding innovation</p>
              </div>
              <div className="community-card">
                <div className="community-icon">🎓</div>
                <h3>Mentors</h3>
                <p>Experienced guides sharing wisdom</p>
              </div>
              <div className="community-card">
                <div className="community-icon">🔬</div>
                <h3>Industry Experts</h3>
                <p>Specialists providing technical expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="values-grid">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="value-card">
                  <div className="value-icon">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What We Offer</h2>
            <p className="section-subtitle">
              Comprehensive support for every stage of your startup journey
            </p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">
              Hear from founders who've transformed their startups with Alumni Connect
            </p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="testimonial-quote">
                  "{testimonial.quote}"
                </blockquote>
                <div className="testimonial-author">
                  <div className="author-info">
                    <div className="author-name">{testimonial.author}</div>
                    <div className="author-title">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-description">
              Join our community of founders, mentors, and investors today and take the 
              first step toward building a successful startup.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="primary-button">
                Join Now
              </Link>
              <button className="secondary-button">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .about-us-page {
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: #ffffff;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          color: white;
          padding: 6rem 0 4rem;
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .gradient-text {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          line-height: 1.7;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .primary-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          text-decoration:none;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
        }

        .secondary-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .secondary-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .stat-card {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.95rem;
          opacity: 0.8;
          font-weight: 500;
        }

        /* Common Section Styles */
        .section {
          padding: 5rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #6b7280;
          line-height: 1.7;
        }

        /* Who We Are Section */
        .who-we-are-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .who-we-are-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .content-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #4b5563;
        }

        .community-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .community-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .community-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        .community-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .community-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .community-card p {
          font-size: 0.9rem;
          color: #6b7280;
        }

        /* Values Section */
        .values-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 5rem 0;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .value-card {
          background: white;
          padding: 3rem 2rem;
          border-radius: 20px;
          text-align: center;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .value-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 20px;
          color: white;
          margin-bottom: 1.5rem;
        }

        .value-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .value-description {
          color: #6b7280;
          line-height: 1.7;
        }

        /* Services Section */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        .service-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .service-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .service-description {
          color: #6b7280;
          line-height: 1.7;
        }

        /* Testimonials Section */
        .testimonials-section {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          color: white;
          padding: 5rem 0;
        }

        .testimonials-section .section-title {
          color: white;
        }

        .testimonials-section .section-subtitle {
          color: rgba(255, 255, 255, 0.8);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.15);
        }

        .testimonial-rating {
          display: flex;
          gap: 4px;
          color: #fbbf24;
          margin-bottom: 1.5rem;
        }

        .testimonial-quote {
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 2rem;
          font-style: italic;
          opacity: 0.95;
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .author-title {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* CTA Section */
        .cta-section {
          padding: 5rem 0;
          text-align: center;
        }

        .cta-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1e293b; /* dark text for contrast */
        }

        .cta-description {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          color: #475569;
          line-height: 1.7;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-buttons .primary-button {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          padding: 0.9rem 1.8rem;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .cta-buttons .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .cta-buttons .secondary-button {
          background: transparent;
          border: 2px solid #3b82f6;
          color: #1e3a8a;
          padding: 0.9rem 1.8rem;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .cta-buttons .secondary-button:hover {
          background: rgba(59, 130, 246, 0.08);
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1.1rem;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .hero-buttons button {
            width: 100%;
            max-width: 300px;
          }

          .hero-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .who-we-are-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .community-grid {
            grid-template-columns: 1fr;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 2rem;
          }

          .section-subtitle {
            font-size: 1.1rem;
          }

          .container {
            padding: 0 1rem;
          }

          .hero-container {
            padding: 0 1rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-buttons button {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-stats {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1.5rem;
          }

          .section {
            padding: 3rem 0;
          }

          .values-section {
            padding: 3rem 0;
          }

          .testimonials-section {
            padding: 3rem 0;
          }

          .cta-section {
            padding: 3rem 0;
          }

          .value-card, .service-card, .testimonial-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AboutUs;