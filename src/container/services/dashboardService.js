
import axios from 'axios';

// Thay bằng URL gốc của backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with credentials
const API = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Include cookies in requests
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getOverviewStats = () => {
    return API.get('/stats/overview');
};

export const getSalesStats = (period) => {
    // Gửi period làm query param, ví dụ: /api/stats/sales?period=month
    return API.get('/stats/sales', { params: { period } });
};

export const getOrderStatusStats = () => {
    return API.get('/stats/order-status');
};