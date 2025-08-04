// SignIn.jsx
import React from "react";
import { SignCard } from "./signcard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignInClick = async (event) => {
    event.preventDefault();
    setLoading((isLoading) => true);
    const response = await axios.post("http://localhost:8000/api/auth/signin", {
      email,
      password,
    });
    console.log(response.data.message);
    localStorage.setItem("token", response.data.token);
    navigate("/");
  };

  // const handleLinkedInSignIn = () => {
  //   window.location.href = "http://localhost:8000/api/auth/linkedin";
  // };

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
        // isLinkedIn={true}
        // handleLinkedInSignIn={handleLinkedInSignIn}
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
