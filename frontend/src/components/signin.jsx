// SignIn.jsx
import React from "react";
import { SignCard } from "./signcard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

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
    window.location.href = `${API_BASE_URL}/auth/linkedin`;
  };

  return (
    <div className="signin-container">
      <SignCard
        heading="Sign In"
        about="Please enter your credentials to sign in."
        buttonText="Sign In"
        linkText="Don't have an account?"
        linkUrl="Register"
        to="/register"
        onSubmit={handleSignInClick}
        isLoading={isLoading}
        isLinkedIn={true}
        handleLinkedInSignIn={handleLinkedInSignIn}
      >
        <input
          type="text"
          placeholder="Email or Username"
          className="signcard-input"
          required
          onChange={(event) => setEmail((email) => event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="signcard-input"
          required
          onChange={(event) => setPassword((password) => event.target.value)}
        />
      </SignCard>
    </div>
  );
};

export default SignIn;
