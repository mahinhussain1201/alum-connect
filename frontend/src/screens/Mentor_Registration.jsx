import { useState } from 'react';
import './Mentor_Registration.css';
import API_BASE_URL from "../config/api";

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

const Mentor_Registration = () => {
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

    // Transform to match Zod enums
    const payload = {
      keywords: formData.domains.map(d => d.toUpperCase()), // matches Domain enum
      experience: Number(formData.experience),
      interaction: formData.interaction.toUpperCase().replace(" ", "_"), // matches InteractionLevel enum
      maxMentees: Number(formData.maxMentees),
      levelsOfMentees: formData.menteeLevels.map(l => l.toUpperCase().replace(" ", "_")), // matches MenteeLevel enum
      linkedinProfile: formData.linkedinProfile || undefined,
      currentOrganization: formData.currentOrganization || undefined,
      passingYear: formData.passingYear ? Number(formData.passingYear) : undefined,
      interests: formData.interests.map(i => i.toUpperCase().replace(" ", "_")), // matches MentorInterest enum
    };

    try {
      const res = await fetch(`${API_BASE_URL}/alumni/setMentorProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Mentor registered successfully!");
      window.location.href = "/";
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
    } catch (err) {
      console.error(err.message);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="mentor-registration">
      <h2>Register as a Mentor</h2>
      <form className="mentor-form" onSubmit={handleSubmit}>
        
        {/* Domains */}
        <div className="form-group">
          <label>Areas of Expertise (Select multiple)</label>
          <select
            multiple
            size={6}
            className="form-input"
            name="domains"
            value={formData.domains}
            onChange={handleChange}
            required
          >
            {domains.map(domain => (
              <option key={domain} value={domain}>
                {formatDomain(domain)}
              </option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div className="form-group">
          <label>Years of Experience</label>
          <input
            type="number"
            className="form-input"
            name="experience"
            min="0"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>

        {/* Interaction Level */}
        <div className="form-group">
          <label>Interaction Level</label>
          <select
            className="form-input"
            name="interaction"
            value={formData.interaction}
            onChange={handleChange}
            required
          >
            <option value="">Select interaction</option>
            <option value="VERY_LOW">Very Low</option>
            <option value="MODERATE">Moderate</option>
            <option value="HIGH">High</option>

          </select>
        </div>

        {/* Max Mentees */}
        <div className="form-group">
          <label>Maximum Mentees</label>
          <input
            type="number"
            className="form-input"
            name="maxMentees"
            min="1"
            max="10"
            value={formData.maxMentees}
            onChange={handleChange}
          />
        </div>

        {/* Mentee Levels */}
        <div className="form-group">
          <label>Mentee Levels</label>
          <div className="checkbox-group">
            {menteeLevelsEnum.map(level => (
              <label key={level}>
                <input
                  type="checkbox"
                  name="menteeLevels"
                  value={level}
                  checked={formData.menteeLevels.includes(level)}
                  onChange={handleChange}
                />
                {formatDomain(level)}
              </label>
            ))}
          </div>
        </div>

        {/* LinkedIn Profile */}
        <div className="form-group">
          <label>LinkedIn Profile</label>
          <input
            type="url"
            className="form-input"
            name="linkedinProfile"
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedinProfile}
            onChange={handleChange}
          />
        </div>

        {/* Current Organization */}
        <div className="form-group">
          <label>Current Organization</label>
          <input
            type="text"
            className="form-input"
            name="currentOrganization"
            value={formData.currentOrganization}
            onChange={handleChange}
          />
        </div>

        {/* Passing Year */}
        <div className="form-group">
          <label>Passing Year</label>
          <input
            type="number"
            className="form-input"
            name="passingYear"
            min="1900"
            max={new Date().getFullYear()}
            value={formData.passingYear}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="join-mentor-button">Join</button>
      </form>
    </div>
  );
};

export default Mentor_Registration;
