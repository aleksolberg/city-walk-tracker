import { createSlice } from "@reduxjs/toolkit";

export const isTrackingSlice = createSlice({
    name: 'isTracking',
    initialState: {
        value: false,
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

export const { setIsTrackingTrue: setTrue, setIsTrackingFalse: setFalse } = isTrackingSlice.actions;
export const isTrackingReducer = isTrackingSlice.reducer;