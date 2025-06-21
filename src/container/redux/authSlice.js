// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     user: JSON.parse(localStorage.getItem('authUser')) || null,
// };

// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         loginSuccess: (state, action) => {
//             state.user = action.payload;
//         },
//         logout: (state) => {
//             state.user = null;
//             localStorage.removeItem('authUser');
//         },
//     },
// });

// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

// Hàm helper để parse an toàn, tránh lỗi "undefined" is not valid JSON
const safeJSONParse = (item) => {
    try {
        return JSON.parse(item);
    } catch (e) {
        return null;
    }
};

const adminUserFromStorage = safeJSONParse(localStorage.getItem('adminUser'));
const adminTokenFromStorage = localStorage.getItem('adminToken');

const initialState = {
    isAdminAuthenticated: !!adminTokenFromStorage,
    adminUser: adminUserFromStorage,
    adminToken: adminTokenFromStorage,
};

const authSlice = createSlice({
    name: 'adminAuth', // Tên slice cho admin
    initialState,
    reducers: {
        adminLoginSuccess: (state, action) => {
            state.isAdminAuthenticated = true;
            state.adminUser = action.payload.user;
            state.adminToken = action.payload.token;
            localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
            localStorage.setItem('adminToken', action.payload.token);
        },
        adminLogout: (state) => {
            state.isAdminAuthenticated = false;
            state.adminUser = null;
            state.adminToken = null;
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminToken');
        },
    },
});

export const { adminLoginSuccess, adminLogout } = authSlice.actions;
export default authSlice.reducer;