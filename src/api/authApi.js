import axiosInstance from './axiosInstance';

export const authAPI = {
  // Routes credentials securely straight to your live Render API cluster node
  login: async (username, password) => {
    const res = await axiosInstance.post('/auth/login', { username, password });
    return res.data; // Expected output payload: { token, username, role }
  }
};
