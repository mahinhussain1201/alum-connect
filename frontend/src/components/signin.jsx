import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Linkedin, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import logo from "../media/logo.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const handleSignInClick = async (event) => {
    event.preventDefault();
    setLoading((isLoading) => true);
    
    try {
      console.log("Attempting to sign in with:", { email, password: "***" });
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email,
        password,
      });
      console.log("Sign in successful:", response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      console.error("Sign in error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response.data);
        alert(`Sign in failed: ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        alert("Network error: No response from server. Please check if the backend is running.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInSignIn = () => {
    console.log("LinkedIn sign in");
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '50px',
    paddingRight: '50px', // Added more right padding for password toggle
    paddingTop: '14px',
    paddingBottom: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: '#f9fafb',
    outline: 'none',
    boxSizing: 'border-box'
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="signin-header">
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
            Welcome Back
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.1rem',
            fontWeight: '400'
          }}>
            Sign in to continue to your account
          </p>
        </div>


        {/* Form Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          width: '100%',
          boxSizing: 'border-box'
        }} className="signin-card">
          
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
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
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
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
          </div>

          {/* Password Input */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
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
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showPassword ? (
                <EyeOff size={20} color="#9ca3af" />
              ) : (
                <Eye size={20} color="#9ca3af" />
              )}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }} className="remember-forgot">
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#6b7280'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  marginRight: '8px',
                  width: '16px',
                  height: '16px',
                  accentColor: '#4f46e5',
                  cursor: 'pointer'
                }}
              />
              Remember me
            </label>
            {/* <button
              type="button"
              style={{
                color: '#4f46e5',
                fontWeight: '500',
                fontSize: '0.9rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.textDecoration = 'underline';
              }}
              onMouseOut={(e) => {
                e.target.style.textDecoration = 'none';
              }}
            >
              Forgot password?
            </button> */}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            onClick={handleSignInClick}
            style={{
              width: '100%',
              background: isLoading || !email || !password 
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: (isLoading || !email || !password) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}
            onMouseOver={(e) => {
              if (!isLoading && email && password) {
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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link 
                to="/register"
                style={{
                  color: '#4f46e5',
                  fontWeight: '600',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
                onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (maxWidth: 480px) {
          .signin-header h1 {
            fontSize: 2rem !important;
          }
          .signin-card {
            padding: 1.5rem !important;
            margin: 0 0.5rem;
          }
          .remember-forgot {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SignIn;