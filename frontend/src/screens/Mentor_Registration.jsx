import { useState } from 'react';

const domains = [
  "SOFTWARE",
  "FRONTEND",
  "BACKEND",
  "PRODUCT_MANAGEMENT",
  "WEB_DEVELOPMENT",
  "MOBILE_DEVELOPMENT",
  "MACHINE_LEARNING",
  "DATA_SCIENCE",
  "BLOCKCHAIN",
  "CLOUD_COMPUTING",
  "CYBERSECURITY",
];

const menteeLevelsEnum = [
  "SECOND_YEAR",
  "THIRD_YEAR",
  "FOURTH_YEAR",
  "FIFTH_YEAR",
  "RESEARCH"
];

const interestOptions = [
  "CAREER_GUIDANCE",
  "TECHNICAL_MENTORING", 
  "INTERVIEW_PREPARATION",
  "PROJECT_GUIDANCE",
  "ENTREPRENEURSHIP",
  "RESEARCH_GUIDANCE"
];

const MentorRegistration = () => {
  const [formData, setFormData] = useState({
    domains: [],
    experience: '',
    interaction: '',
    maxMentees: 5,
    menteeLevels: [],
    linkedinProfile: '',
    currentOrganization: '',
    passingYear: '',
    interests: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDomain = (domain) =>
    domain.toLowerCase().split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;
    if (e.target.multiple) {
      const selected = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData(prev => ({ ...prev, [name]: selected }));
    } else if (type === 'checkbox') {
      const checked = formData[name].includes(value)
        ? formData[name].filter(v => v !== value)
        : [...formData[name], value];
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Mentor registered successfully!");
      setFormData({
        domains: [],
        experience: '',
        interaction: '',
        maxMentees: 5,
        menteeLevels: [],
        linkedinProfile: '',
        currentOrganization: '',
        passingYear: '',
        interests: []
      });
      setCurrentStep(1);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.domains.length > 0 && formData.experience;
      case 2:
        return formData.interaction && formData.menteeLevels.length > 0;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            margin: '0 0 1rem 0',
            background: 'linear-gradient(135deg, #1e40af, #7c3aed)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: '#1e293b'
          }}>
            Become a Mentor
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            margin: 0,
            fontWeight: '500'
          }}>
            Share your expertise and guide the next generation
          </p>
        </div>

        {/* Progress Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          {[1, 2, 3].map((step) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentStep >= step 
                  ? 'linear-gradient(135deg, #1e40af, #7c3aed)' 
                  : '#e2e8f0',
                color: currentStep >= step ? 'white' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: currentStep >= step 
                  ? '0 4px 16px rgba(30, 64, 175, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                {step}
              </div>
              {step < 3 && (
                <div style={{
                  width: '60px',
                  height: '2px',
                  background: currentStep > step 
                    ? 'linear-gradient(135deg, #1e40af, #7c3aed)' 
                    : '#e2e8f0',
                  transition: 'all 0.3s ease'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top Border */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
            borderRadius: '24px 24px 0 0'
          }} />

          <form onSubmit={handleSubmit}>
            {/* Step 1: Expertise & Experience */}
            {currentStep === 1 && (
              <div>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  Your Expertise & Experience
                </h2>

                {/* Domains */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    fontSize: '1rem'
                  }}>
                    Areas of Expertise *
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '0.75rem',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    {domains.map(domain => (
                      <label key={domain} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: formData.domains.includes(domain) 
                          ? 'linear-gradient(135deg, #ede9fe, #f3e8ff)' 
                          : 'white',
                        borderRadius: '8px',
                        border: formData.domains.includes(domain)
                          ? '2px solid #7c3aed'
                          : '2px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        <input
                          type="checkbox"
                          name="domains"
                          value={domain}
                          checked={formData.domains.includes(domain)}
                          onChange={handleChange}
                          style={{ margin: 0 }}
                        />
                        {formatDomain(domain)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    fontSize: '1rem'
                  }}>
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    min="0"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Enter your years of experience"
                    required
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Mentoring Preferences */}
            {currentStep === 2 && (
              <div>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  Mentoring Preferences
                </h2>

                {/* Interaction Level */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    fontSize: '1rem'
                  }}>
                    Interaction Level *
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '0.75rem'
                  }}>
                    {[
                      { value: 'VERY_LOW', label: 'Very Low', desc: 'Occasional check-ins' },
                      { value: 'MODERATE', label: 'Moderate', desc: 'Regular meetings' },
                      { value: 'HIGH', label: 'High', desc: 'Frequent interactions' }
                    ].map(option => (
                      <label key={option.value} style={{
                        display: 'block',
                        padding: '1rem',
                        background: formData.interaction === option.value 
                          ? 'linear-gradient(135deg, #ede9fe, #f3e8ff)' 
                          : 'white',
                        borderRadius: '12px',
                        border: formData.interaction === option.value
                          ? '2px solid #7c3aed'
                          : '2px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}>
                        <input
                          type="radio"
                          name="interaction"
                          value={option.value}
                          checked={formData.interaction === option.value}
                          onChange={handleChange}
                          style={{ display: 'none' }}
                        />
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          {option.label}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          {option.desc}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Max Mentees */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    fontSize: '1rem'
                  }}>
                    Maximum Mentees: {formData.maxMentees}
                  </label>
                  <input
                    type="range"
                    name="maxMentees"
                    min="1"
                    max="10"
                    value={formData.maxMentees}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      height: '8px',
                      background: 'linear-gradient(135deg, #1e40af, #7c3aed)',
                      borderRadius: '4px',
                      outline: 'none'
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                    color: '#64748b',
                    marginTop: '0.5rem'
                  }}>
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Mentee Levels */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    fontSize: '1rem'
                  }}>
                    Mentee Academic Levels *
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '0.75rem'
                  }}>
                    {menteeLevelsEnum.map(level => (
                      <label key={level} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: formData.menteeLevels.includes(level) 
                          ? 'linear-gradient(135deg, #ede9fe, #f3e8ff)' 
                          : 'white',
                        borderRadius: '8px',
                        border: formData.menteeLevels.includes(level)
                          ? '2px solid #7c3aed'
                          : '2px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        <input
                          type="checkbox"
                          name="menteeLevels"
                          value={level}
                          checked={formData.menteeLevels.includes(level)}
                          onChange={handleChange}
                          style={{ margin: 0 }}
                        />
                        {formatDomain(level)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  Additional Information
                </h2>

                {/* LinkedIn Profile */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    fontSize: '1rem'
                  }}>
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Current Organization */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    fontSize: '1rem'
                  }}>
                    Current Organization
                  </label>
                  <input
                    type="text"
                    name="currentOrganization"
                    placeholder="Enter your current company/organization"
                    value={formData.currentOrganization}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Passing Year */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    fontSize: '1rem'
                  }}>
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    name="passingYear"
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="Enter your graduation year"
                    value={formData.passingYear}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed';
                      e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Interests */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    fontSize: '1rem'
                  }}>
                    Mentoring Interests
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '0.75rem'
                  }}>
                    {interestOptions.map(interest => (
                      <label key={interest} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: formData.interests.includes(interest) 
                          ? 'linear-gradient(135deg, #ede9fe, #f3e8ff)' 
                          : 'white',
                        borderRadius: '8px',
                        border: formData.interests.includes(interest)
                          ? '2px solid #7c3aed'
                          : '2px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        <input
                          type="checkbox"
                          name="interests"
                          value={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={handleChange}
                          style={{ margin: 0 }}
                        />
                        {formatDomain(interest)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '2rem',
              gap: '1rem'
            }}>
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                style={{
                  padding: '0.875rem 2rem',
                  background: currentStep === 1 ? '#e2e8f0' : 'white',
                  border: currentStep === 1 ? '2px solid #e2e8f0' : '2px solid #7c3aed',
                  borderRadius: '12px',
                  color: currentStep === 1 ? '#9ca3af' : '#7c3aed',
                  fontWeight: '600',
                  cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => {
                  if (currentStep !== 1) {
                    e.target.style.background = '#f3e8ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentStep !== 1) {
                    e.target.style.background = 'white';
                  }
                }}
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  style={{
                    padding: '0.875rem 2rem',
                    background: isStepValid() 
                      ? 'linear-gradient(135deg, #1e40af, #7c3aed)' 
                      : '#e2e8f0',
                    border: 'none',
                    borderRadius: '12px',
                    color: isStepValid() ? 'white' : '#9ca3af',
                    fontWeight: '600',
                    cursor: isStepValid() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    fontSize: '1rem',
                    boxShadow: isStepValid() 
                      ? '0 4px 16px rgba(30, 64, 175, 0.3)' 
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (isStepValid()) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 24px rgba(30, 64, 175, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isStepValid()) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(30, 64, 175, 0.3)';
                    }
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.875rem 2rem',
                    background: isSubmitting 
                      ? '#e2e8f0' 
                      : 'linear-gradient(135deg, #059669, #10b981)',
                    border: 'none',
                    borderRadius: '12px',
                    color: isSubmitting ? '#9ca3af' : 'white',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '1rem',
                    boxShadow: isSubmitting 
                      ? 'none' 
                      : '0 4px 16px rgba(5, 150, 105, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(5, 150, 105, 0.3)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #9ca3af',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Submitting...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: '#64748b',
          fontSize: '0.875rem'
        }}>
          Need help? Contact our support team for assistance with registration.
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem 0.5rem !important;
          }
          
          .dashboard-container h1 {
            font-size: 2rem !important;
          }
          
          .form-container {
            padding: 1.5rem !important;
          }
          
          .step-header {
            font-size: 1.5rem !important;
          }
          
          .progress-step {
            width: 32px !important;
            height: 32px !important;
            font-size: 0.875rem !important;
          }
          
          .progress-line {
            width: 40px !important;
          }
          
          .nav-buttons {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          
          .nav-button {
            width: 100% !important;
            justify-content: center !important;
          }
          
          .domain-grid {
            grid-template-columns: 1fr !important;
          }
          
          .interaction-grid {
            grid-template-columns: 1fr !important;
          }
          
          .level-grid {
            grid-template-columns: 1fr !important;
          }
          
          .interest-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .dashboard-container h1 {
            font-size: 1.75rem !important;
          }
          
          .form-container {
            padding: 1rem !important;
            border-radius: 16px !important;
          }
          
          .step-header {
            font-size: 1.375rem !important;
          }
          
          .progress-step {
            width: 28px !important;
            height: 28px !important;
            font-size: 0.75rem !important;
          }
          
          .progress-line {
            width: 30px !important;
          }
          
          .form-input {
            padding: 0.75rem !important;
            font-size: 0.875rem !important;
          }
          
          .checkbox-item {
            padding: 0.625rem !important;
            font-size: 0.8125rem !important;
          }
          
          .radio-item {
            padding: 0.75rem !important;
          }
          
          .nav-button {
            padding: 0.75rem 1.5rem !important;
            font-size: 0.875rem !important;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 0.75rem 0.25rem !important;
          }
          
          .dashboard-container h1 {
            font-size: 1.5rem !important;
          }
          
          .form-container {
            padding: 0.75rem !important;
          }
          
          .step-header {
            font-size: 1.25rem !important;
          }
          
          .progress-container {
            gap: 0.5rem !important;
          }
          
          .progress-step {
            width: 24px !important;
            height: 24px !important;
            font-size: 0.625rem !important;
          }
          
          .progress-line {
            width: 20px !important;
          }
          
          .form-group {
            margin-bottom: 1.5rem !important;
          }
          
          .form-label {
            font-size: 0.875rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .form-input {
            padding: 0.625rem !important;
          }
          
          .checkbox-grid {
            gap: 0.5rem !important;
          }
          
          .checkbox-item {
            padding: 0.5rem !important;
            font-size: 0.75rem !important;
          }
          
          .nav-button {
            padding: 0.625rem 1.25rem !important;
            font-size: 0.8125rem !important;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .form-container {
            border: 2px solid #000 !important;
          }
          
          .form-input {
            border: 2px solid #000 !important;
          }
          
          .nav-button {
            border: 2px solid #000 !important;
          }
        }

        /* Focus styles for better accessibility */
        input:focus,
        button:focus {
          outline: 3px solid #7c3aed !important;
          outline-offset: 2px !important;
        }

        /* Print styles */
        @media print {
          .dashboard-container {
            background: white !important;
            padding: 1rem !important;
          }
          
          .form-container {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
          }
          
          .progress-container {
            display: none !important;
          }
          
          .nav-buttons {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MentorRegistration;