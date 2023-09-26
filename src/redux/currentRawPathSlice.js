import { createSlice } from "@reduxjs/toolkit";

export const currentRawPathSlice = createSlice({
    name: 'currentRawPath',
    initialState: {
        value: [],
    },
    reducers: {
        addPointToCurrentRawPath: (state, action) => {
            state.value = [...state.value, action.payload]
        },
        clearCurrentRawPath: state => {state.value = []}
    }
})

export const { addPointToCurrentRawPath, clearCurrentRawPath } = currentRawPathSlice.actions;
export const currentRawPathReducer = currentRawPathSlice.reducer;