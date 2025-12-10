import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

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

// ============ LOGIN ============
export const handleLoginApi = (email, password) => {
    return API.post('/login', { email, password });
};

// Login riêng cho admin - có thể bypass verify email check
// Backend nên có endpoint riêng hoặc tự động bypass verify cho admin role
export const handleAdminLoginApi = async (email, password) => {
    try {
        // Thử dùng API login thông thường trước
        const response = await API.post('/login', { email, password });
        return response;
    } catch (error) {
        // Nếu lỗi là về verify email, có thể thử endpoint riêng cho admin
        // Hoặc backend cần sửa để bypass verify cho admin
        throw error;
    }
};

export const loginWithGoogleToken = async (id_token) => {
    const response = await API.post('/auth/google', { id_token });
    return response.data;
};

// ============ USER INFO ============
export const getMe = async () => {
    const response = await API.get('/me');
    return response.data;
};

export const logout = async () => {
    const response = await API.post('/auth/logout');
    return response.data;
};

// ============ REGISTER (FLOW MỚI: Email + Pass + OTP) ============

// Bước 1: Gửi thông tin để nhận OTP
// Backend: router.post('/auth/register', ...)
export const registerWithEmail = async (email, name, password) => {
    // Lưu ý: Backend controller registerWithEmail trả về JSON
    const response = await API.post('/auth/register', { email, name, password });
    return response.data;
};

// Bước 2: Verify OTP và tạo User
// Backend: router.post('/auth/verify-otp', ...)
export const verifyOTPAndRegister = async (email, code, name, password) => {
    const response = await API.post('/auth/verify-otp', {
        email,
        code, // Backend authController dòng 650 lấy { code }
        name,
        password
    });
    return response.data;
};

// ============ FORGOT PASSWORD (FLOW MỚI) ============

// Bước 1: Gửi OTP quên mật khẩu
// Backend: router.post('/auth/forgot-password-send-otp', ...)
export const forgotPasswordSendOTP = async (email) => {
    const response = await API.post('/auth/forgot-password-send-otp', { email });
    return response.data;
};

// Bước 2: Verify OTP và Đổi mật khẩu
// Backend: router.post('/auth/verify-forgot-password-otp', ...)
export const verifyOTPAndResetPassword = async (email, otpCode, newPassword) => {
    // Backend authController dòng 1024 lấy { otp } chứ không phải otpCode
    // Nên ta phải map otpCode -> otp
    const response = await API.post('/auth/verify-forgot-password-otp', {
        email,
        otp: otpCode,
        newPassword
    });
    return response.data;
};

// ============ HÀM CŨ - GIỮ LẠI ĐỂ TƯƠNG THÍCH ============
/**
 * Gửi OTP (OLD API)
 * POST /api/send-otp
 */
export const sendOTP = async (email, type = 'register') => {
    return API.post('/send-otp', { email, type });
};

/**
 * Kiểm tra email tồn tại (OLD - cho ForgotPasswordPage)
 * POST /api/forgot-password
 */
export const checkEmailExist = async (email) => {
    try {
        const response = await API.post('/forgot-password', { email });
        return response.data && response.data.success !== false;
    } catch (error) {
        return false;
    }
};

/**
 * Đặt lại mật khẩu (OLD - không dùng OTP)
 * POST /api/reset-password
 */
export const updatePasswordUser = async (email, newPassword) => {
    try {
        const response = await API.post('/reset-password', { email, newPassword });
        return response.data && response.data.success !== false;
    } catch (error) {
        return false;
    }
};

/**
 * Đăng ký cũ (có upload avatar) - OLD
 * POST /api/register
 * Hỗ trợ 2 cách gọi:
 * 1. handleRegisterApi(formData) - FormData với avatar
 * 2. handleRegisterApi(email, password, name, role) - Tham số riêng lẻ
 */
export const handleRegisterApi = (formDataOrEmail, password, name, role) => {
    // Nếu tham số đầu tiên là FormData
    if (formDataOrEmail instanceof FormData) {
        return API.post('/register', formDataOrEmail, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }

    // Nếu là tham số riêng lẻ (email, password, name, role)
    const formData = new FormData();
    formData.append('email', formDataOrEmail);
    formData.append('password', password);
    formData.append('name', name);
    if (role) formData.append('role', role);

    return API.post('/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

export default API;