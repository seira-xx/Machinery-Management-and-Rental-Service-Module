import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; 

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; 
  } catch (error) {
    throw error.response?.data || { message: "Server unreachable" };
  }
};