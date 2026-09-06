import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const API_URL = `${API_BASE.replace(/\/$/, '')}/stock`;

const authConfig = () => ({ withCredentials: true });

export const stockAPI = {
  getAllStock: async () => {
    const res = await axios.get(`${API_URL}/all`, authConfig());
    return res.data;
  },
  getReports: async () => {
    const res = await axios.get(`${API_BASE.replace(/\/$/, '')}/reports/logs`, authConfig());
    return res.data;
  },
  addCategory: async (categoryName) => {
    const res = await axios.post(`${API_URL}/category/add`, { categoryName }, authConfig());
    return res.data;
  },
  updateCategory: async (catId, categoryName) => {
    const res = await axios.put(`${API_URL}/category/update/${catId}`, { categoryName }, authConfig());
    return res.data;
  },
  deleteCategory: async (catId) => {
    const res = await axios.delete(`${API_URL}/category/delete/${catId}`, authConfig());
    return res.data;
  },
  addProduct: async (catId, product) => {
    const res = await axios.post(`${API_URL}/product/add/${catId}`, product, authConfig());
    return res.data;
  },
  updateProduct: async (prodId, product) => {
    const res = await axios.put(`${API_URL}/product/update/${prodId}`, product, authConfig());
    return res.data;
  },
  deleteProduct: async (prodId) => {
    const res = await axios.delete(`${API_URL}/product/delete/${prodId}`, authConfig());
    return res.data;
  },
  stackOut: async (productId, quantity) => {
    const res = await axios.post(`${API_URL}/product/stackout`, { productId, quantity }, authConfig());
    return res.data;
  }
};
