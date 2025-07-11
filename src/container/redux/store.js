// Khởi tạo store redux
import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice';
import authReducer from './authSlice';
import analyticsSlice from './analyticsSlice';
import userAuthSlice from './userAuthSlice';
import wishlistSlice from '../../components/store/actions/wishlistSlice';
import cartSlice from '../../components/store/actions/cartSlice';

const store = configureStore({
    reducer: {
        adminAuth: authReducer,
        userAuth: userAuthSlice,
        sidebar: sidebarReducer,
        stats: analyticsSlice,
        cart: cartSlice,
        wishlist: wishlistSlice,
    }
});

export default store;
