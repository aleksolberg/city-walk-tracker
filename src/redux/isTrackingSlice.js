import { createSlice } from "@reduxjs/toolkit";

export const isTrackingSlice = createSlice({
    name: 'isTracking',
    initialState: {
        value: null,
    },
    reducers: {
        setIsTrackingTrue: state => {
            state.value = true;
        },
        setIsTrackingFalse: state => {
            state.value = false;
        }
    }
})

export const { setIsTrackingTrue, setIsTrackingFalse } = isTrackingSlice.actions;
export const isTrackingReducer = isTrackingSlice.reducer;