import axiosInstance from './axiosInstance';

export const reportAPI = {
  // Streams time-sorted chronological logs directly from the MongoDB Atlas cloud cluster
  getReports: async () => {
    const res = await axiosInstance.get('/reports/logs');
    return res.data;
  }
};
