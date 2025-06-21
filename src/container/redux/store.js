// Khởi tạo store redux
import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice';
import authReducer from './authSlice';
import analyticsSlice from './analyticsSlice';
import userAuthSlice from './userAuthSlice';
const store = configureStore({
    reducer: {
        adminAuth: authReducer,
        userAuth: userAuthSlice,
        sidebar: sidebarReducer,
        stats: analyticsSlice,
    }
});

export default store;
