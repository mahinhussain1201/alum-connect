import axios from "axios";
import API_BASE_URL from "../config/api";

export const fetchUserInfo = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/userInfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.user; // Return the user data
      } else {
        console.error("Failed to fetch user info");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  }
  return null; // Return null if no token is found
};

export const fetchInternships = async (url) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data.internships;

    const internships = data.map((internship) => {
      return {
        ...internship,
        startTime: internship.startTime.split("T")[0],
        endTime: internship.endTime.split("T")[0],
      };
    });

    return internships;
  } catch (error) {
    console.error("Error fetching internships:", error);
  }
};

export const fetchProfile = async (url) => {
  try{
    const token=localStorage.getItem("token");
    const response=await axios.get(`${API_BASE_URL}/${url}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return response.data.basicProfile;
  }catch(error){
    console.error("Error fetching profile:", error);
  }
};

export const fetchExperience = async (url) => {
  try{
    const token=localStorage.getItem("token");
  const response=await axios.get(`${API_BASE_URL}/${url}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return response.data.pastExperiences;
  }catch(error){
    console.error("Error fetching profile:", error);
  }
};

export const fetchInternshipApplications=async(id)=>{
  console.log("inside ftehcApplicatiosn")
  console.log("internship Id :",id);
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE_URL}/alumni/getAllApplications/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    const appliedStudents=response.data.appliedStudents.map(({status,student,...application})=>{
      return {status,student};
    })

    console.log("applied students returned by fetch function:",appliedStudents)

    return appliedStudents; 
  } catch (error) {
    console.error("Error fetching internship applications:", error);
    throw error;
  }
}


export const fetchUpcomingEvents = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/events/getUpcomingEvents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
};

export const fetchPastEvents = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/events/getPastEvents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching past events:", error);
    return [];
  }
};


export const fetchMentors = async ()=>{
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE_URL}/student/getMentors`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
    
  } catch (error) {
    console.error("Error fetching Mentors : ", error);
    throw error;
  }
}

export const fetchMentorships = async ()=>{
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE_URL}/alumni/getMentorshipsForMentors`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
    
  } catch (error) {
    console.error("Error fetching Mentors : ", error);
    throw error;
  }
}

export const acceptMentorship = async (mentorshipId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(`${API_BASE_URL}/alumni/acceptMentorship`, {
      mentorshipId: mentorshipId,
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Response:', response.data);
  } catch (error) {
    console.error("Error accepting Mentorsship : ", error);
  }
};
