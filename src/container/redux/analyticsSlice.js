import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStats } from '../services/userService';

// Thunk lấy dữ liệu thống kê

export const fetchStats = createAsyncThunk('stats/fetchStats', async () => {
    const res = await getStats();
    return res.data;
});

const statsSlice = createSlice({
    name: 'stats',
    initialState: {
        totalLogins: 0,
        totalVisits: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.loading = false;
                state.totalLogins = action.payload.totalLogins;
                state.totalVisits = action.payload.totalVisits;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default statsSlice.reducer;
