import axios from "axios";

export const updateBasicProfile = async (url, profileData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:8000/api/${url}`,
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

export const addExperience = async (url, experienceData) => {
  try {
    const token = localStorage.getItem("token");
    const response=await axios.post(`http://localhost:8000/api/${url}`, experienceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};

export const postNewInternship = async (internshipData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:8000/api/alumni/postInternship",
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
      `http://localhost:8000/api/alumni/closeInternship/${id}`,
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
      "http://localhost:8000/api/events/registerForUpcomingEvent",
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
      'http://localhost:8000/api/student/connectMentor', 
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
      'http://localhost:8000/api/alumni/getMentorProfile', 
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
      'http://localhost:8000/api/student/getMentorProfile', 
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
      `http://localhost:8000/api/alumni/acceptStudent/${internshipId}`,
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
      `http://localhost:8000/api/alumni/rejectStudent/${internshipId}`,
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
