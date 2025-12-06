import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/users/";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getUserProfile = async () => {
    try {
        const res = await axios.get(API_URL + 'profile', getAuthHeaders());
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

export const updateUserProfile = async (userData) => {
    try {
        const res = await axios.put(API_URL + 'profile', userData, getAuthHeaders());
        return res.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

