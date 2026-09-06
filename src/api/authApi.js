import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const API_URL = `${API_BASE.replace(/\/$/, '')}/auth`;

export const authAPI = {
  login: async (username, password) => {
    const res = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true });
    return res.data;
  },
  logout: async () => {
    const res = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return res.data;
  }
};
