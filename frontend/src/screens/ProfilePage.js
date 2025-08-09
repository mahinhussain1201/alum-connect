import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import NavBar from "./NavBar";
import defaultProfilePic from "../media/default-profile.png";
import {
  fetchExperience,
  fetchProfile,
  fetchUserInfo,
} from "../components/fetchData";
import { addExperience, updateBasicProfile } from "../components/postData";

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
  "BUSINESS_MANAGEMENT",
  "FINANCE",
  "ACCOUNTING",
  "HUMAN_RESOURCES",
  "MARKETING",
  "SALES",
  "OPERATIONS",
  "STRATEGY",
  "PROJECT_MANAGEMENT",
  "SUPPLY_CHAIN_MANAGEMENT",
  "CONSULTING",
  "ENTREPRENEURSHIP",
  "BUSINESS_DEVELOPMENT",
  "BUSINESS_ANALYTICS",
  "ECONOMICS",
  "PUBLIC_RELATIONS",
];

const ProfilePage = () => {
  const [user, setuser] = useState(null);

  const [profile, setProfile] = useState({
    username: null,
    role: null,
    profilePic: defaultProfilePic,
    alumniProfile: {
      fullName: null,
      presentCompany: null,
      yearsOfExperience: null,
      domain: null,
      experiences: [],
      newExperience: {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    },
    studentProfile: {
      fullName: null,
      cgpa: null,
      cv: null,
      department: null,
      rollno: null,
      domain: null,
      experiences: [],
      newExperience: {
        title: "",
        techStacks: [],
        startDate: "",
        endDate: "",
        description: "",
      },
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        if (userInfo) {
          setuser(userInfo);
        }
      } catch (error) {
        console.log("Error:", error.message);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user) {
      const fetchCompleteProfile = async () => {
        try {
          const isAlumni = user.role === "ALUMNI";
          const basicProfileUrl = isAlumni
            ? "alumni/getBasicProfile"
            : "student/getBasicProfile";
          const experienceUrl = isAlumni
            ? "alumni/getExperience"
            : "student/getExperience";

          // Fetch profile and experience in parallel
          const [basicProfile, experiences] = await Promise.all([
            fetchProfile(basicProfileUrl),
            fetchExperience(experienceUrl),
          ]);

          // Set profile state correctly
          setProfile((prevProfile) => ({
            ...prevProfile,
            username: user.username,
            role: user.role,
            ...(isAlumni
              ? {
                  alumniProfile: {
                    fullName: basicProfile?.fullName || null,
                    presentCompany: basicProfile?.presentCompany || null,
                    yearsOfExperience: basicProfile?.yearsOfExperience || null,
                    domain: basicProfile?.domain || null,
                    experiences: experiences || [],
                    newExperience: {
                      company: "",
                      role: "",
                      startDate: "",
                      endDate: "",
                      description: "",
                    },
                  },
                }
              : {
                  studentProfile: {
                    fullName: basicProfile?.fullName || null,
                    cgpa: basicProfile?.cgpa || null,
                    cv: basicProfile?.cv || null,
                    department: basicProfile?.department || null,
                    rollno: basicProfile?.rollno || null,
                    domain: basicProfile?.domain || null,
                    experiences: experiences || [],
                    newExperience: {
                      title: "",
                      techStacks: [],
                      startDate: "",
                      endDate: "",
                      description: "",
                    },
                  },
                }),
          }));
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setIsProfileLoading(false);
        }
      };

      fetchCompleteProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [profileType, field] = name.split(".");
    setProfile((prev) => ({
      ...prev,
      [profileType]: {
        ...prev[profileType],
        [field]: value,
      },
    }));
  };

  const handleExperienceInputChange = (e) => {
    const { name, value } = e.target;
    const profileType =
      profile.role === "ALUMNI" ? "alumniProfile" : "studentProfile";

    setProfile((prev) => ({
      ...prev,
      [profileType]: {
        ...prev[profileType],
        newExperience: {
          ...prev[profileType].newExperience,
          [name]:
            name === "techStacks"
              ? value.split(",").map((t) => t.trim())
              : value,
        },
      },
    }));
  };

  const handleAddExperienceClick = () => {
    setIsAddingExperience(true);
    const profileType =
      profile.role === "ALUMNI" ? "alumniProfile" : "studentProfile";

    setProfile((prev) => ({
      ...prev,
      [profileType]: {
        ...prev[profileType],
        newExperience:
          profile.role === "ALUMNI"
            ? {
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                description: "",
              }
            : {
                title: "",
                techStacks: [],
                startDate: "",
                endDate: "",
                description: "",
              },
      },
    }));
  };

  const handleSaveNewExperience = async () => {
    const profileType = profile.role === "ALUMNI" ? "alumniProfile" : "studentProfile";
  
    if (!profile[profileType]?.newExperience) {
      console.error("newExperience is undefined!");
      return;
    }
  
    try {
      const url = profile.role === "ALUMNI"
        ? "alumni/addExperience"
        : "student/addExperience";
  
      const experienceData = profile.role === "ALUMNI"
        ? {
            company: profile[profileType].newExperience.company,
            role: profile[profileType].newExperience.role,
            startDate: profile[profileType].newExperience.startDate,
            endDate: profile[profileType].newExperience.endDate,
            description: profile[profileType].newExperience.description,
          }
        : {
            title: profile[profileType].newExperience.title,
            techStacks: profile[profileType].newExperience.techStacks,
            startDate: profile[profileType].newExperience.startDate,
            endDate: profile[profileType].newExperience.endDate,
            description: profile[profileType].newExperience.description,
          };
  
      const response = await addExperience(url, experienceData);
  
      if (response.ok) {
        setProfile((prev) => ({
          ...prev,
          [profileType]: {
            ...prev[profileType],
            experiences: [
              ...prev[profileType].experiences,
              prev[profileType].newExperience,
            ],
            newExperience: profile.role === "ALUMNI"
              ? { company: "", role: "", startDate: "", endDate: "", description: "" }
              : { title: "", techStacks: [], startDate: "", endDate: "", description: "" },
          },
        }));
      }
    } catch (error) {
      console.error("Error while saving new experience:", error.message);
    } finally {
      setIsAddingExperience(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        profile.role === "ALUMNI"
          ? "alumni/updateBasicProfile"
          : "student/updateBasicProfile";

      const profileData =
        profile.role === "ALUMNI"
          ? {
              fullName: profile.alumniProfile.fullName,
              presentCompany: profile.alumniProfile.presentCompany,
              domain: profile.alumniProfile.domain,
              yearsOfExperience: profile.alumniProfile.yearsOfExperience,
            }
          : {
              fullName: profile.studentProfile.fullName,
              domain: profile.studentProfile.domain,
              rollno: profile.studentProfile.rollno,
              department: profile.studentProfile.department,
              cv: profile.studentProfile.cv,
              cgpa: profile.studentProfile.cgpa,
            };

      const updatedProfile = await updateBasicProfile(url, profileData);

      setProfile((prev) => ({
        ...prev,
        [prev.role === "ALUMNI" ? "alumniProfile" : "studentProfile"]: {
          ...prev[prev.role === "ALUMNI" ? "alumniProfile" : "studentProfile"],
          ...(prev.role === "ALUMNI"
            ? {
                fullName: updatedProfile.fullName,
                presentCompany: updatedProfile.presentCompany,
                domain: updatedProfile.domain,
                yearsOfExperience: updatedProfile.yearsOfExperience,
              }
            : {
                fullName: updatedProfile.fullName,
                domain: updatedProfile.domain,
                rollno: updatedProfile.rollno,
                department: updatedProfile.department,
                cv: updatedProfile.cv,
                cgpa: updatedProfile.cgpa,
              }),
        },
      }));

      console.log("Updated Profile:", updatedProfile);
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsEditing(false);
    }
    console.log("Updated Profile:", profile);
  };

  const currentProfile =
  profile && profile.role
    ? profile[profile.role === "ALUMNI" ? "alumniProfile" : "studentProfile"]
    : null;
    if (!currentProfile) {
      return <div>Loading profile...</div>;
    }
  const currentExperiences = currentProfile?.experiences || [];

  if (isProfileLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#C45A12",
          backgroundColor: "#f9f9f9",
        }}
      >
        Loading, please wait...
      </div>
    );
  }
  return (
    <>
      <NavBar />
      <div
        className="profile-page"
        data-profile-type={profile.role.toLowerCase()}
      >
        <h1 className="profile-header">Profile</h1>
        {!isEditing ? (
          <div className="profile-details">
            <div className="profile-info-box">
              <div className="header-section">
                <div className="profile-photo-container">
                  <img
                    src={profile.profilePic}
                    alt="Profile"
                    className="profile-photo"
                  />
                  <h2>{currentProfile.fullName || "No name available"}</h2>
                  <div className="role-pill">{profile.role}</div>
                </div>
              </div>

              <div className="info-section">
                <ul className="info-list">
                  {profile.role === "ALUMNI" ? (
                    <>
                      <li>
                        <span className="info-label">Present Company:</span>
                        <span className="info-value">
                          {currentProfile.presentCompany}
                        </span>
                      </li>
                      <li>
                        <span className="info-label">Years of Experience:</span>
                        <span className="info-value">
                          {currentProfile.yearsOfExperience}
                        </span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <span className="info-label">Roll Number:</span>
                        <span className="info-value">
                          {currentProfile.rollno}
                        </span>
                      </li>
                      <li>
                        <span className="info-label">Department:</span>
                        <span className="info-value">
                          {currentProfile.department}
                        </span>
                      </li>
                      <li>
                        <span className="info-label">CGPA:</span>
                        <span className="info-value">
                          {currentProfile.cgpa || "N/A"}
                        </span>
                      </li>
                    </>
                  )}
                  <li>
                    <span className="info-label">Domain:</span>
                    <span className="info-value">{currentProfile.domain}</span>
                  </li>
                  {profile.role === "STUDENT" && (
                    <li>
                      <span className="info-label">Resume:</span>
                      <a
                        href={currentProfile.cv}
                        className="cv-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View CV
                      </a>
                    </li>
                  )}
                </ul>
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="profile-experience-box">
              <div className="experience-section">
                <h3 className="section-title">Experiences</h3>
                <div className="experience-list">
                  {currentExperiences.length > 0 ? (
                    currentExperiences.map((exp, index) => (
                      <div key={index} className="experience-item">
                        <div className="experience-header">
                          <span className="company">
                            {profile.role === "ALUMNI"
                              ? exp.company
                              : exp.title}
                          </span>
                          <span className="dates">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </span>
                        </div>
                        {profile.role === "STUDENT" && (
                          <div className="tech-stacks">
                            {exp.techStacks?.join(", ")}
                          </div>
                        )}
                        <div className="role">
                          {profile.role === "ALUMNI"
                            ? exp.role
                            : exp.description}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">No experiences added</div>
                  )}
                </div>
                {isAddingExperience && (
                  <div className="new-experience-form">
                    {profile.role === "ALUMNI" ? (
                      <>
                        <div className="form-group">
                          <label className="form-label">Company</label>
                          <input
                            type="text"
                            className="form-input"
                            name="company"
                            value={currentProfile.newExperience.company}
                            onChange={handleExperienceInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Role</label>
                          <input
                            type="text"
                            className="form-input"
                            name="role"
                            value={currentProfile.newExperience.role}
                            onChange={handleExperienceInputChange}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            className="form-input"
                            name="title"
                            value={currentProfile.newExperience.title}
                            onChange={handleExperienceInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Tech Stacks</label>
                          <input
                            type="text"
                            className="form-input"
                            name="techStacks"
                            value={currentProfile.newExperience.techStacks.join(
                              ", "
                            )}
                            onChange={handleExperienceInputChange}
                          />
                        </div>
                      </>
                    )}
                    <div className="date-group">
                      <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          className="form-input"
                          name="startDate"
                          value={currentProfile.newExperience.startDate}
                          onChange={handleExperienceInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          className="form-input"
                          name="endDate"
                          value={currentProfile.newExperience.endDate}
                          onChange={handleExperienceInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-textarea"
                        name="description"
                        value={currentProfile.newExperience.description}
                        onChange={handleExperienceInputChange}
                      />
                    </div>
                    <div className="form-buttons">
                      <button
                        type="button"
                        className="save-button"
                        onClick={handleSaveNewExperience}
                      >
                        Save Experience
                      </button>
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setIsAddingExperience(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {!isAddingExperience && (
                  <button
                    type="button"
                    className="add-button"
                    onClick={handleAddExperienceClick}
                  >
                    + Add Experience
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form className="edit-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Edit Profile</h2>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                name={`${
                  profile.role === "ALUMNI" ? "alumniProfile" : "studentProfile"
                }.fullName`}
                value={currentProfile.fullName || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            {profile.role === "ALUMNI" ? (
              <>
                <div className="form-group">
                  <label className="form-label">Present Company</label>
                  <input
                    type="text"
                    className="form-input"
                    name="alumniProfile.presentCompany"
                    value={currentProfile.presentCompany}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    className="form-input"
                    name="alumniProfile.yearsOfExperience"
                    value={currentProfile.yearsOfExperience}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input
                    type="text"
                    className="form-input"
                    name="studentProfile.rollno"
                    value={currentProfile.rollno}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    name="studentProfile.department"
                    value={currentProfile.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-input"
                    name="studentProfile.cgpa"
                    value={currentProfile.cgpa || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CV Link</label>
                  <input
                    type="url"
                    className="form-input"
                    name="studentProfile.cv"
                    value={currentProfile.cv}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Domain</label>
              <select
                className="form-select"
                value={currentProfile.domain}
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      name: `${
                        profile.role === "ALUMNI"
                          ? "alumniProfile"
                          : "studentProfile"
                      }.domain`,
                      value: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select Domain</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-buttons">
              <button type="submit" className="save-button">
                Save Changes
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
