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

// Interceptor để thêm token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ============ THỐNG KÊ TỔNG QUAN ============
export const getOverviewStats = () => {
    return API.get('/stats/overview');
};

// ============ THỐNG KÊ DOANH THU THEO THỜI GIAN ============
// period: 'day', 'week', 'month', 'quarter', 'year'
// Optional params: year, month, fromDate, toDate
export const getSalesStats = (period, params = {}) => {
    const queryParams = { period, ...params };
    return API.get('/stats/sales', { params: queryParams });
};

// ============ SẢN PHẨM BÁN CHẠY NHẤT ============
// limit: số lượng sản phẩm (mặc định 10)
// period: 'day', 'week', 'month', 'quarter', 'year'
export const getTopProducts = (limit = 10, period = 'month') => {
    return API.get('/stats/top-products', { params: { limit, period } });
};

// ============ TÌNH TRẠNG ĐƠN HÀNG ============
export const getOrderStatusStats = () => {
    return API.get('/stats/order-status');
};

// ============ SO SÁNH DOANH THU THÁNG ============
// So sánh tháng hiện tại với tháng trước
export const getMonthlyComparison = () => {
    return API.get('/stats/monthly-comparison');
};

// ============ SO SÁNH DOANH THU QUÝ ============
// So sánh quý hiện tại với quý trước
export const getQuarterlyComparison = () => {
    return API.get('/stats/quarterly-comparison');
};

// ============ THỐNG KÊ 4 QUÝ TRONG NĂM ============
export const getQuarterlyStats = () => {
    return API.get('/stats/quarterly-stats');
};

// ============ HIỆU SUẤT DOANH THU THÁNG ============
// month: 1-12, year: 2024, 2025, ...
export const getMonthlyPerformance = (month, year) => {
    return API.get('/stats/monthly-performance', { params: { month, year } });
};