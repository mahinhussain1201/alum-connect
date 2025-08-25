import React, { useState } from "react";
import { User, Mail, Lock, GraduationCap, Building2, Calendar, FileText, Users, BookOpen, Briefcase, TrendingUp, Linkedin } from "lucide-react";
import logo from "../media/logo.png"
const SignUp = () => {
  const [activeTab, setActiveTab] = useState("STUDENT");
  const [isLoading, setLoading] = useState(false);

  // Common fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Student-specific fields
  const [fullName, setFullName] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [cv, setCv] = useState("");
  const [department, setDepartment] = useState("");
  const [rollno, setRollno] = useState("");
  const [studentDomain, setStudentDomain] = useState("");

  // Alumni-specific fields
  const [alumniFullName, setAlumniFullName] = useState("");
  const [presentCompany, setPresentCompany] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [alumniDomain, setAlumniDomain] = useState("");

  // Mock API base URL for development
  const API_BASE_URL = "http://localhost:8000/api";

  const handleLinkedInSignIn = () => {
    // In a real app, this would redirect to LinkedIn OAuth
    window.location.href = `${API_BASE_URL}/auth/linkedin`;
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setFullName("");
    setCgpa("");
    setCv("");
    setDepartment("");
    setRollno("");
    setStudentDomain("");
    setAlumniFullName("");
    setPresentCompany("");
    setYearsOfExperience("");
    setAlumniDomain("");
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Validate common fields
      if (!username || !email || !password) {
        alert("Please fill in all required fields (Username, Email, Password)");
        setLoading(false);
        return;
      }

      // Validate role-specific fields
      if (activeTab === "STUDENT") {
        if (!fullName || !cgpa || !cv || !department || !rollno || !studentDomain) {
          alert("Please fill in all student-specific fields");
          setLoading(false);
          return;
        }
        // Validate CGPA
        const cgpaValue = parseFloat(cgpa);
        if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
          alert("CGPA must be a number between 0 and 10");
          setLoading(false);
          return;
        }
      } else if (activeTab === "ALUMNI") {
        if (!alumniFullName || !presentCompany || !yearsOfExperience || !alumniDomain) {
          alert("Please fill in all alumni-specific fields");
          setLoading(false);
          return;
        }
        // Validate years of experience
        const expValue = parseInt(yearsOfExperience);
        if (isNaN(expValue) || expValue < 0) {
          alert("Years of experience must be a positive number");
          setLoading(false);
          return;
        }
      }

      let signupData = {
        username,
        email,
        password,
        role: activeTab,
      };

      if (activeTab === "STUDENT") {
        signupData.studentData = {
          fullName,
          cgpa: parseFloat(cgpa),
          cv,
          department,
          rollno,
          domain: studentDomain,
        };
      } else if (activeTab === "ALUMNI") {
        signupData.alumniData = {
          fullName: alumniFullName,
          presentCompany,
          yearsOfExperience: parseInt(yearsOfExperience),
          domain: alumniDomain,
        };
      }

      // Mock API call - replace with actual axios call
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Signup successful:", data.message);
      
      // Store token and user data (in a real app, use secure storage)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // In a real app, navigate using React Router
      alert("Account created successfully! You would now be redirected to the dashboard.");
      
    } catch (error) {
      console.error("Signup error:", error);
      if (error.message.includes('HTTP error')) {
        alert(`Signup failed: Server error. Please try again.`);
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert("Network error: No response from server. Please check if the backend is running.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const domainOptions = [
    { value: "SOFTWARE", label: "Software Development" },
    { value: "FRONTEND", label: "Frontend Development" },
    { value: "BACKEND", label: "Backend Development" },
    { value: "PRODUCT_MANAGEMENT", label: "Product Management" },
    { value: "WEB_DEVELOPMENT", label: "Web Development" },
    { value: "MOBILE_DEVELOPMENT", label: "Mobile Development" },
    { value: "MACHINE_LEARNING", label: "Machine Learning" },
    { value: "DATA_SCIENCE", label: "Data Science" },
    { value: "BLOCKCHAIN", label: "Blockchain" },
    { value: "CLOUD_COMPUTING", label: "Cloud Computing" },
    { value: "CYBERSECURITY", label: "Cybersecurity" },
    { value: "BUSINESS_MANAGEMENT", label: "Business Management" },
    { value: "FINANCE", label: "Finance" },
    { value: "ACCOUNTING", label: "Accounting" },
    { value: "HUMAN_RESOURCES", label: "Human Resources" },
    { value: "MARKETING", label: "Marketing" },
    { value: "SALES", label: "Sales" },
    { value: "OPERATIONS", label: "Operations" },
    { value: "STRATEGY", label: "Strategy" },
    { value: "PROJECT_MANAGEMENT", label: "Project Management" },
    { value: "SUPPLY_CHAIN_MANAGEMENT", label: "Supply Chain Management" },
    { value: "CONSULTING", label: "Consulting" },
    { value: "ENTREPRENEURSHIP", label: "Entrepreneurship" },
    { value: "BUSINESS_DEVELOPMENT", label: "Business Development" },
    { value: "BUSINESS_ANALYTICS", label: "Business Analytics" },
    { value: "ECONOMICS", label: "Economics" },
    { value: "PUBLIC_RELATIONS", label: "Public Relations" },
  ];

  const inputStyle = {
    width: '100%',
    paddingLeft: '50px',
    paddingRight: '16px',
    paddingTop: '14px',
    paddingBottom: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: '#f9fafb',
    outline: 'none'
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#4f46e5';
    e.target.style.backgroundColor = 'white';
    e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.backgroundColor = '#f9fafb';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '24px',
            marginBottom: '1rem',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)'
          }}>
            <img src={logo} alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Join Our Platform
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.1rem',
            fontWeight: '400'
          }}>
            Connect with students and alumni worldwide
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '4px',
          borderRadius: '16px',
          marginBottom: '2rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            <button
              type="button"
              onClick={() => handleTabSwitch("STUDENT")}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: activeTab === "STUDENT" ? 'white' : 'transparent',
                color: activeTab === "STUDENT" ? '#4f46e5' : 'rgba(255,255,255,0.9)',
                boxShadow: activeTab === "STUDENT" ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <GraduationCap size={18} style={{ marginRight: '8px' }} />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("ALUMNI")}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: activeTab === "ALUMNI" ? 'white' : 'transparent',
                color: activeTab === "ALUMNI" ? '#4f46e5' : 'rgba(255,255,255,0.9)',
                boxShadow: activeTab === "ALUMNI" ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <Building2 size={18} style={{ marginRight: '8px' }} />
              Alumni
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          
          {/* LinkedIn Button */}
          <button
            type="button"
            onClick={handleLinkedInSignIn}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              backgroundColor: 'white',
              color: '#374151',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '1.5rem'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#0077b5';
              e.target.style.backgroundColor = '#f8fafc';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.backgroundColor = 'white';
            }}
          >
            <Linkedin size={20} color="#0077b5" style={{ marginRight: '12px' }} />
            Continue with LinkedIn
          </button>

          {/* Divider */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', borderTop: '1px solid #e5e7eb' }} />
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <span style={{
                padding: '0 1rem',
                backgroundColor: 'white',
                color: '#9ca3af',
                fontSize: '0.875rem'
              }}>
                Or continue with email
              </span>
            </div>
          </div>

          {/* Common Fields */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative', marginBottom: '1rem', width:'85%' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1
              }}>
                <User size={20} color="#9ca3af" />
              </div>
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            <div style={{ position: 'relative', marginBottom: '1rem', width:'85%' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1
              }}>
                <Mail size={20} color="#9ca3af" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem', width:'85%' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1
              }}>
                <Lock size={20} color="#9ca3af" />
              </div>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
          </div>

          {/* Role-specific Section Header */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              {activeTab === "STUDENT" ? (
                <>
                  <GraduationCap size={20} color="#4f46e5" style={{ marginRight: '8px' }} />
                  Student Information
                </>
              ) : (
                <>
                  <Building2 size={20} color="#4f46e5" style={{ marginRight: '8px' }} />
                  Professional Information
                </>
              )}
            </h3>
          </div>

          {/* Student Fields */}
          {activeTab === "STUDENT" && (
            <div>
              <div style={{ position: 'relative', marginBottom: '1rem', width:'85%' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}>
                  <User size={20} color="#9ca3af" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', width:'85%' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1
                  }}>
                    <TrendingUp size={20} color="#9ca3af" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="CGPA"
                    required
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1
                  }}>
                    <BookOpen size={20} color="#9ca3af" />
                  </div>
                  <input
                    type="text"
                    placeholder="Roll Number"
                    required
                    value={rollno}
                    onChange={(e) => setRollno(e.target.value)}
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              <div style={{ position: 'relative', marginBottom: '1rem', width:'85%' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}>
                  <Building2 size={20} color="#9ca3af" />
                </div>
                <input
                  type="text"
                  placeholder="Department"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div style={{ position: 'relative', marginBottom: '1rem', width:'85%' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}>
                  <FileText size={20} color="#9ca3af" />
                </div>
                <input
                  type="url"
                  placeholder="CV/Resume Drive Link"
                  required
                  value={cv}
                  onChange={(e) => setCv(e.target.value)}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}>
                  <Briefcase size={20} color="#9ca3af" />
                </div>
                <select
                  required
                  value={studentDomain}
                  onChange={(e) => setStudentDomain(e.target.value)}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                    appearance: 'none'
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <option value="" disabled>Select Domain of Interest</option>
                  {domainOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Alumni Fields */}
          {activeTab === "ALUMNI" && (
            <div>
              <div style={{ position: 'relative', marginBottom: '1rem', width:'85%' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}>
                  <User size={20} color="#9ca3af" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={alumniFullName}
                  onChange={(e) => setAlumniFullName(e.target.value)}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div style={{ position: 'relative', marginBottom: '1rem', width:'85%' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}>
                  <Building2 size={20} color="#9ca3af" />
                </div>
                <input
                  type="text"
                  placeholder="Present Company"
                  required
                  value={presentCompany}
                  onChange={(e) => setPresentCompany(e.target.value)}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div style={{ position: 'relative', marginBottom: '1rem', width:'85%' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}>
                  <Calendar size={20} color="#9ca3af" />
                </div>
                <input
                  type="number"
                  placeholder="Years of Experience"
                  required
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}>
                  <Briefcase size={20} color="#9ca3af" />
                </div>
                <select
                  required
                  value={alumniDomain}
                  onChange={(e) => setAlumniDomain(e.target.value)}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                    appearance: 'none'
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <option value="" disabled>Select Professional Domain</option>
                  {domainOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 10px 20px rgba(79, 70, 229, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '12px'
                }} />
                Creating Account...
              </>
            ) : (
              `Create ${activeTab === "STUDENT" ? "Student" : "Alumni"} Account`
            )}
          </button>

          {/* Sign In Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <a 
                href="/signin"
                style={{
                  color: '#4f46e5',
                  fontWeight: '600',
                  textDecoration: 'underline',
                }}
              >
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SignUp;