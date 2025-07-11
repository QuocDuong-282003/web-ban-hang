import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    itemIds: JSON.parse(localStorage.getItem('wishlistItems')) || [],
};
const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        toggleWishlistItem: (state, action) => {
            const productId = action.payload;
            const existingIndex = state.itemIds.indexOf(productId);
            if (existingIndex >= 0) {
                state.itemIds.splice(existingIndex, 1);
            } else {
                state.itemIds.push(productId);
            }
            localStorage.setItem('wishlistItem', JSON.stringify(state.itemIds));
        },
    },
});
export const { toggleWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;