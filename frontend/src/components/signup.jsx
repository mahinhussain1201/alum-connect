import React, { useState } from "react";
import { SignCard } from "./signcard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading((isLoading) => true);
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
      username,
      email,
      password,
      role
    });
    console.log(response.data.message);
    localStorage.setItem("token", response.data.token);
    navigate("/");
  };

  return (
    <div className="signup-container">
      <SignCard
        heading="Create Account"
        about="Please fill in the details below to create an account."
        buttonText="Create Account"
        linkText="Already have an account?"
        linkUrl="Sign In"
        to="/signin"
        onSubmit={handleSignUp}
        isLoading={isLoading}
      >
        <input
          type="text"
          placeholder="Username"
          className="signcard-input"
          required
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="email"
          placeholder="Email ID"
          className="signcard-input"
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="signcard-input"
          required
          onChange={(event) => setPassword(event.target.value)}
        />
        <select
          name="role"
          onChange={(event) => setRole(event.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            fontSize: "16px",
            cursor: "pointer",
          }}
          value={role} // Ensures the state controls the select
        >
          <option value="" disabled selected>
            Select Role
          </option>
          <option value="STUDENT">Student</option>
          <option value="ALUMNI">Alumni</option>
        </select>
      </SignCard>
    </div>
  );
};

export default SignUp;
