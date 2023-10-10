import { createSlice } from "@reduxjs/toolkit";

export const currentPositionSlice = createSlice({
    name: 'currentPosition',
    initialState: {
        value: null
    },
    reducers: {
        setCurrentPosition: (state, action) => {
            state.value = action.payload;
        },
    }
})

export const { setCurrentPosition } = currentPositionSlice.actions;
export const currentPositionReducer = currentPositionSlice.reducer;