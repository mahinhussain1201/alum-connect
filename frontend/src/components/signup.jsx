import React, { useState } from "react";
import { SignCard } from "./signcard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

const SignUp = () => {
  const [activeTab, setActiveTab] = useState("STUDENT");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleLinkedInSignIn = () => {
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

      const response = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
      console.log("Signup successful:", response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response.data);
        alert(`Signup failed: ${error.response.data.message}`);
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

  const renderStudentFields = () => (
    <>
      <input
        type="text"
        placeholder="Full Name"
        className="signcard-input"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        placeholder="CGPA"
        className="signcard-input"
        required
        value={cgpa}
        onChange={(e) => setCgpa(e.target.value)}
      />
      <input
        type="url"
        placeholder="CV/Resume Drive Link"
        className="signcard-input"
        required
        value={cv}
        onChange={(e) => setCv(e.target.value)}
      />
      <input
        type="text"
        placeholder="Department"
        className="signcard-input"
        required
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <input
        type="text"
        placeholder="Roll Number"
        className="signcard-input"
        required
        value={rollno}
        onChange={(e) => setRollno(e.target.value)}
      />
      <select
        value={studentDomain}
        onChange={(e) => setStudentDomain(e.target.value)}
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
        required
      >
        <option value="" disabled>
          Select Domain
        </option>
        <option value="SOFTWARE">Software Development</option>
        <option value="FRONTEND">Frontend Development</option>
        <option value="BACKEND">Backend Development</option>
        <option value="PRODUCT_MANAGEMENT">Product Management</option>
        <option value="WEB_DEVELOPMENT">Web Development</option>
        <option value="MOBILE_DEVELOPMENT">Mobile Development</option>
        <option value="MACHINE_LEARNING">Machine Learning</option>
        <option value="DATA_SCIENCE">Data Science</option>
        <option value="BLOCKCHAIN">Blockchain</option>
        <option value="CLOUD_COMPUTING">Cloud Computing</option>
        <option value="CYBERSECURITY">Cybersecurity</option>
        <option value="BUSINESS_MANAGEMENT">Business Management</option>
        <option value="FINANCE">Finance</option>
        <option value="ACCOUNTING">Accounting</option>
        <option value="HUMAN_RESOURCES">Human Resources</option>
        <option value="MARKETING">Marketing</option>
        <option value="SALES">Sales</option>
        <option value="OPERATIONS">Operations</option>
        <option value="STRATEGY">Strategy</option>
        <option value="PROJECT_MANAGEMENT">Project Management</option>
        <option value="SUPPLY_CHAIN_MANAGEMENT">Supply Chain Management</option>
        <option value="CONSULTING">Consulting</option>
        <option value="ENTREPRENEURSHIP">Entrepreneurship</option>
        <option value="BUSINESS_DEVELOPMENT">Business Development</option>
        <option value="BUSINESS_ANALYTICS">Business Analytics</option>
        <option value="ECONOMICS">Economics</option>
        <option value="PUBLIC_RELATIONS">Public Relations</option>
      </select>
    </>
  );

  const renderAlumniFields = () => (
    <>
      <input
        type="text"
        placeholder="Full Name"
        className="signcard-input"
        required
        value={alumniFullName}
        onChange={(e) => setAlumniFullName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Present Company"
        className="signcard-input"
        required
        value={presentCompany}
        onChange={(e) => setPresentCompany(e.target.value)}
      />
      <input
        type="number"
        placeholder="Years of Experience"
        className="signcard-input"
        required
        value={yearsOfExperience}
        onChange={(e) => setYearsOfExperience(e.target.value)}
      />
      <select
        value={alumniDomain}
        onChange={(e) => setAlumniDomain(e.target.value)}
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
        required
      >
        <option value="" disabled>
          Select Domain
        </option>
        <option value="SOFTWARE">Software Development</option>
        <option value="FRONTEND">Frontend Development</option>
        <option value="BACKEND">Backend Development</option>
        <option value="PRODUCT_MANAGEMENT">Product Management</option>
        <option value="WEB_DEVELOPMENT">Web Development</option>
        <option value="MOBILE_DEVELOPMENT">Mobile Development</option>
        <option value="MACHINE_LEARNING">Machine Learning</option>
        <option value="DATA_SCIENCE">Data Science</option>
        <option value="BLOCKCHAIN">Blockchain</option>
        <option value="CLOUD_COMPUTING">Cloud Computing</option>
        <option value="CYBERSECURITY">Cybersecurity</option>
        <option value="BUSINESS_MANAGEMENT">Business Management</option>
        <option value="FINANCE">Finance</option>
        <option value="ACCOUNTING">Accounting</option>
        <option value="HUMAN_RESOURCES">Human Resources</option>
        <option value="MARKETING">Marketing</option>
        <option value="SALES">Sales</option>
        <option value="OPERATIONS">Operations</option>
        <option value="STRATEGY">Strategy</option>
        <option value="PROJECT_MANAGEMENT">Project Management</option>
        <option value="SUPPLY_CHAIN_MANAGEMENT">Supply Chain Management</option>
        <option value="CONSULTING">Consulting</option>
        <option value="ENTREPRENEURSHIP">Entrepreneurship</option>
        <option value="BUSINESS_DEVELOPMENT">Business Development</option>
        <option value="BUSINESS_ANALYTICS">Business Analytics</option>
        <option value="ECONOMICS">Economics</option>
        <option value="PUBLIC_RELATIONS">Public Relations</option>
      </select>
    </>
  );

  return (
    <div className="signup-container">
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            backgroundColor: "#f1f1f1",
            borderRadius: "25px",
            padding: "4px",
            marginBottom: "20px",
          }}
        >
          <button
            type="button"
            onClick={() => handleTabSwitch("STUDENT")}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "20px",
              backgroundColor: activeTab === "STUDENT" ? "#007bff" : "transparent",
              color: activeTab === "STUDENT" ? "white" : "#666",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("ALUMNI")}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "20px",
              backgroundColor: activeTab === "ALUMNI" ? "#007bff" : "transparent",
              color: activeTab === "ALUMNI" ? "white" : "#666",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Alumni
          </button>
        </div>
      </div>

      <SignCard
        heading={`Create ${activeTab === "STUDENT" ? "Student" : "Alumni"} Account`}
        about={`Please fill in the details below to create your ${activeTab.toLowerCase()} account.`}
        buttonText="Create Account"
        linkText="Already have an account?"
        linkUrl="Sign In"
        to="/signin"
        onSubmit={handleSignUp}
        isLoading={isLoading}
        isLinkedIn={true}
        handleLinkedInSignIn={handleLinkedInSignIn}
      >
        {/* Common fields */}
        <input
          type="text"
          placeholder="Username"
          className="signcard-input"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email ID"
          className="signcard-input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="signcard-input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role-specific fields */}
        {activeTab === "STUDENT" ? renderStudentFields() : renderAlumniFields()}
      </SignCard>
    </div>
  );
};

export default SignUp;