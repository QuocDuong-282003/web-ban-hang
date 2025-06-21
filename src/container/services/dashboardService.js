
import axios from 'axios';

// Thay bằng URL gốc của backend
const API_URL = 'http://localhost:5000/api';

export const getOverviewStats = () => {
    return axios.get(`${API_URL}/stats/overview`);
};

export const getSalesStats = (period) => {
    // Gửi period làm query param, ví dụ: /api/stats/sales?period=month
    return axios.get(`${API_URL}/stats/sales`, { params: { period } });
};

export const getOrderStatusStats = () => {
    return axios.get(`${API_URL}/stats/order-status`);
};