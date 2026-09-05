import axiosInstance from './axiosInstance';

export const stockAPI = {
  // Fetches full CategoryStock tracking array directly from MongoDB Atlas
  getAllStock: async () => {
    const res = await axiosInstance.get('/stocks/all');
    return res.data;
  },
  // Appends transaction metrics logs straight to the Reports log collection
  getReports: async () => {
    const res = await axiosInstance.get('/reports/logs');
    return res.data;
  },
  // Process out-bound item trade de-allocations securely
  stackOut: async (productId, quantity) => {
    const res = await axiosInstance.post('/stocks/product/stackout', { productId, quantity });
    return res.data;
  }
};
