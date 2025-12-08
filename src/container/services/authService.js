import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ============ AXIOS INSTANCE ============
const API = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Include cookies in requests (for HttpOnly cookies)
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============ LOGIN APIs ============
/**
 * Đăng nhập bằng Email và Mật khẩu
 * POST /api/login
 */
export const handleLoginApi = (email, password) => {
    return API.post('/login', { email, password });
};

/**
 * Google Login với ID Token (cho @react-oauth/google)
 * POST /api/auth/google
 */
export const loginWithGoogleToken = async (id_token) => {
    const response = await API.post('/auth/google', { id_token }, {
        withCredentials: true
    });
    return response.data;
};

/**
 * Google Login - Old endpoint (giữ lại để tương thích)
 * POST /api/login-with-google
 */
export const loginWithGoogle = async (googleData) => {
    const response = await API.post('/login-with-google', googleData);
    return response.data;
};

/**
 * Đăng nhập bằng OTP (không cần password)
 * POST /api/login-with-otp
 */
export const loginWithOTP = async (email, otpCode) => {
    const response = await API.post('/login-with-otp', { email, otpCode });
    return response.data;
};

// ============ REGISTER APIs ============
/**
 * Đăng ký với Email + Password + OTP (NEW)
 * POST /api/auth/register - Gửi OTP đăng ký
 */
export const registerWithEmail = async (email, name, password) => {
    const response = await API.post('/auth/register', {
        email,
        name,
        password
    }, {
        withCredentials: true
    });
    return response.data;
};

/**
 * Verify OTP và tạo user mới với password
 * POST /api/auth/verify-otp
 */
export const verifyOTPAndRegister = async (email, code, name, password) => {
    const response = await API.post('/auth/verify-otp', {
        email,
        code,
        name,
        password
    }, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

/**
 * Đăng ký bằng OTP (không cần password) - OLD
 * POST /api/register-with-otp
 */
export const registerWithOTP = async (name, email, otpCode) => {
    const response = await API.post('/register-with-otp', { name, email, otpCode });
    return response.data;
};

/**
 * Đăng ký cũ (có upload avatar) - OLD
 * POST /api/register
 */
export const handleRegisterApi = (formData) => {
    return API.post('/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

// ============ OTP APIs ============
/**
 * Gửi OTP
 * POST /api/send-otp
 * @param {string} email - Email của user
 * @param {string} type - Loại OTP: 'register', 'login', 'reset-password'
 */
export const sendOTP = async (email, type = 'register') => {
    return API.post('/send-otp', { email, type });
};

// ============ USER INFO APIs ============
/**
 * Lấy thông tin user hiện tại sau khi login thành công
 * GET /api/me - Trả về thông tin user dựa trên HttpOnly cookie hoặc token
 */
export const getMe = async () => {
    const response = await API.get('/me', {
        withCredentials: true
    });
    return response.data;
};

// ============ LOGOUT API ============
/**
 * Logout - Clear HttpOnly cookie
 * POST /api/auth/logout
 * QUAN TRỌNG: Phải gọi API này trước khi clear Redux state
 */
export const logout = async () => {
    const response = await API.post('/auth/logout', {}, {
        withCredentials: true
    });
    return response.data;
};

// ============ FORGOT PASSWORD & RESET PASSWORD ============
/**
 * Kiểm tra email tồn tại (cho forgot password)
 * POST /api/forgot-password
 */
export const checkEmailExist = (email) => {
    return API.post('/forgot-password', { email });
};

/**
 * Đặt lại mật khẩu
 * POST /api/reset-password
 */
export const updatePasswordUser = (email, newPassword) => {
    return API.post('/reset-password', { email, newPassword });
};

export default API;
