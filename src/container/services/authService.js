import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

// Send OTP
export const sendOTP = async (email, type = 'register') => {
    return API.post('/send-otp', { email, type });
};

// Login with OTP
export const loginWithOTP = async (email, otpCode) => {
    const response = await API.post('/login-with-otp', { email, otpCode });
    return response.data;
};

// Register with OTP
export const registerWithOTP = async (name, email, otpCode) => {
    const response = await API.post('/register-with-otp', { name, email, otpCode });
    return response.data;
};

// Login with Google
export const loginWithGoogle = async (googleData) => {
    const response = await API.post('/login-with-google', googleData);
    return response.data;
};

export default API;




