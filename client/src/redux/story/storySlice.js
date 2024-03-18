import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    error: null,
    loading: false
}

const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        updateStoryStart: (state) => {
            state.loading = true;
        },
        updateStorySuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateStoryFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})

export const { updateStoryStart, updateStorySuccess, updateStoryFailure } = storySlice.actions;
export default storySlice.reducer;