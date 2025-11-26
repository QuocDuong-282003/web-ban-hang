// --- SỬA FILE: src/container/redux/userAuthSlice.js (Cho User) ---

import { createSlice } from '@reduxjs/toolkit';

// Hàm helper để parse an toàn
const safeJSONParse = (item) => {
    try {
        return JSON.parse(item);
    } catch (e) {
        return null;
    }
};

const userFromStorage = safeJSONParse(localStorage.getItem('user'));
const tokenFromStorage = localStorage.getItem('token');

const initialState = {
    isAuthenticated: !!tokenFromStorage,
    user: userFromStorage,
    token: tokenFromStorage,
    error: null,
};

// Đổi tên biến slice cho đúng với tên file
const userAuthSlice = createSlice({
    name: 'userAuth', // Tên slice cho user
    initialState,
    reducers: {
        userLoginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token; // Can be null if using HttpOnly cookie
            state.error = null;
            // Save user to localStorage for persistence
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            // Only save token to localStorage if it's provided (not HttpOnly cookie)
            if (action.payload.token) {
                localStorage.setItem('token', action.payload.token);
            } else {
                // If token is null, it means we're using HttpOnly cookie
                // Remove any existing token from localStorage
                localStorage.removeItem('token');
            }
        },
        userLoginFailure: (state, action) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = action.payload;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        userLogout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { userLoginSuccess, userLoginFailure, userLogout } = userAuthSlice.actions;
export default userAuthSlice.reducer;