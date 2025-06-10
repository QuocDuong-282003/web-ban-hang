// // Quản lý trạng thái sidebar (mở/đóng, active item)
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     activeItem: 'Dashboard'
// };

// const sidebarSlice = createSlice({
//     name: 'sidebar',
//     initialState,
//     reducers: {
//         setActiveItem: (state, action) => {
//             state.activeItem = action.payload;
//         }
//     }
// });

// export const { setActiveItem } = sidebarSlice.actions;
// export default sidebarSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeItem: 'Dashboard', // Item đang active trong sidebar
    isSidebarOpen: true      // Trạng thái toggle sidebar
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setActiveItem: (state, action) => {
            state.activeItem = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload;
        }
    }
});

export const { setActiveItem, toggleSidebar, setSidebarOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
