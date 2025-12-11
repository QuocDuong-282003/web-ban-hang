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

// ============ THỐNG KÊ DOANH THU THEO FILTER (API MỚI) ============
// Dựa trên API documentation: /api/stats/sales-by-filter
// Params:
//   - filterType: 'day', 'month', 'quarter', 'year', 'custom'
//   - month: 1-12 (khi filterType='month')
//   - year: 2000-2100 (khi filterType='month', 'quarter', 'year')
//   - fromDate: 'DD/MM/YYYY' hoặc 'YYYY-MM-DD' (khi filterType='custom')
//   - toDate: 'DD/MM/YYYY' hoặc 'YYYY-MM-DD' (khi filterType='custom')
//   - groupBy: 'day', 'week', 'month', 'quarter'
//   - compareWithPrevious: true/false hoặc 'true'/'false'
export const getSalesByFilter = (params = {}) => {
    // Convert date format from YYYY-MM-DD to DD/MM/YYYY if needed
    const processedParams = { ...params };
    
    if (processedParams.fromDate && processedParams.fromDate.includes('-')) {
        const [year, month, day] = processedParams.fromDate.split('-');
        processedParams.fromDate = `${day}/${month}/${year}`;
    }
    
    if (processedParams.toDate && processedParams.toDate.includes('-')) {
        const [year, month, day] = processedParams.toDate.split('-');
        processedParams.toDate = `${day}/${month}/${year}`;
    }
    
    // Convert boolean to string if needed
    if (typeof processedParams.compareWithPrevious === 'boolean') {
        processedParams.compareWithPrevious = processedParams.compareWithPrevious ? 'true' : 'false';
    }
    
    return API.get('/stats/sales-by-filter', { params: processedParams });
};

// ============ ĐƠN HÀNG PHỔ BIẾN NHẤT ============
// limit: số lượng đơn hàng (mặc định 10, tối đa 50)
// sortBy: 'value' (theo giá trị) hoặc 'items' (theo số lượng sản phẩm)
// status: trạng thái đơn hàng (mặc định 'delivered')
// fromDate, toDate: khoảng thời gian (format: 'YYYY-MM-DD' hoặc 'DD/MM/YYYY')
export const getTopOrders = (limit = 10, sortBy = 'value', status = 'delivered', fromDate = null, toDate = null) => {
    const params = { limit, sortBy, status };
    
    // Convert date format from YYYY-MM-DD to DD/MM/YYYY if needed
    if (fromDate && fromDate.includes('-')) {
        const [year, month, day] = fromDate.split('-');
        params.fromDate = `${day}/${month}/${year}`;
    } else if (fromDate) {
        params.fromDate = fromDate;
    }
    
    if (toDate && toDate.includes('-')) {
        const [year, month, day] = toDate.split('-');
        params.toDate = `${day}/${month}/${year}`;
    } else if (toDate) {
        params.toDate = toDate;
    }
    
    return API.get('/stats/top-orders', { params });
};