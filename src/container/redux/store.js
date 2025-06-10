// Khởi tạo store redux
import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice';
import authReducer from './authSlice';
import analyticsSlice from './analyticsSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        sidebar: sidebarReducer,
        stats: analyticsSlice,
    }
});

export default store;
