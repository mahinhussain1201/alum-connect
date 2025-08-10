import axios from "axios";
import API_BASE_URL from "../config/api";

export const updateBasicProfile = async (url, profileData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/${url}`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.message);
    return response.data.updateBasicProfile;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};

export const addExperience = async (url, data) => {
  try {
    const token = localStorage.getItem("token"); 
    const res = await axios.post(`http://localhost:8000/api/${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { error: true, message: error.message };
  }
};

export const postNewInternship = async (internshipData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/alumni/postInternship`,
      internshipData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.new_internship;
  } catch (error) {
    console.error("Error posting internship:", error);
    throw error;
  }
};

export const closeInternship = async (id) => {
  console.log("Inside closing internship function")
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/alumni/closeInternship/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error closing internship:", error);
    throw error;
  }
};

export const registerForEvent = async (eventId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_BASE_URL}/events/registerForUpcomingEvent`,
      { eventId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Contains success message and registration data
  } catch (error) {
    console.error("Error registering for event:", error);

    const message =
      error.response?.data?.message || "Failed to register for the event.";
    return { success: false, message };
  }
};


export const sendMentorshipRequest = async (mentorUserId) =>{
  try {
    const token = localStorage.getItem('token');
    const body = {
      mentorUserId: mentorUserId,
    };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${API_BASE_URL}/student/connectMentor`, 
      body,
      { headers } 
    );
    console.log('Response:', response.data);
  } catch (error) {
    console.error("Error sending mentorship request : ", error);
  }

}

export const fetchMentorProfileForMentor = async(mentorUserId) =>{
  try {
    const token = localStorage.getItem('token');
    const body = {
      mentorUserId: mentorUserId,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${API_BASE_URL}/alumni/getMentorProfile`, 
      body,
      { headers } 
    );
    console.log('Response:', response.data);
    return response.data.basicProfile;
  } catch (error) {
    console.error("Error fetching mentor profile : ", error);
  }

}

export const fetchMentorProfile = async(mentorUserId) =>{
  console.log("Here");
  
  try {
    const token = localStorage.getItem('token');
    const body = {
      mentorUserId: mentorUserId,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${API_BASE_URL}/student/getMentorProfile`, 
      body,
      { headers } 
    );
    console.log('Response:', response.data);
    return response.data.basicProfile;
  } catch (error) {
    console.error("Error fetching mentor profile : ", error);
  }

}
export const acceptInternshipApplication = async (internshipId, studentId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.patch(
      `${API_BASE_URL}/alumni/acceptStudent/${internshipId}`,
      {
        studentId: studentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error closing internship:", error);
    throw error;
  }
};


export const rejectInternshipApplication = async (internshipId, studentId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.patch(
      `${API_BASE_URL}/alumni/rejectStudent/${internshipId}`,
      {
        studentId: studentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error closing internship:", error);
    throw error;
  }
};
