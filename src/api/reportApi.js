import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const API_URL = `${API_BASE.replace(/\/$/, '')}/reports`;

export const reportAPI = {
  // Streams time-sorted chronological logs directly from the MongoDB Atlas cloud cluster
  getReports: async () => {
    const res = await axios.get(`${API_URL}/logs`, { withCredentials: true });
    return res.data;
  }
};
