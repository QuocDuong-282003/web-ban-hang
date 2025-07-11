// File: src/container/redux/cartSlice.js - PHIÊN BẢN SIÊU DỄ HIỂU

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalQuantity: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Action duy nhất: Nhận dữ liệu giỏ hàng mới và cập nhật state
        // File: src/container/redux/cartSlice.js
        // ...
        setCart: (state, action) => {
            const newCartData = action.payload; // vd: { items: [...], totalItems: 5 }
            state.items = newCartData.items || [];

            // SỬA Ở ĐÂY: Lấy thẳng totalItems từ backend trả về
            // thay vì tự tính toán lại.
            state.totalQuantity = newCartData.totalItems || 0;

        },
        // ...
        // Action để xóa giỏ hàng khi người dùng đăng xuất
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
        }
    },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;