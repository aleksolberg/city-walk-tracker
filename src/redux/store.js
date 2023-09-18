import { configureStore } from "@reduxjs/toolkit";
import { isTrackingReducer } from "./isTrackingSlice";

export const store = configureStore({
    reducer: {
        isTracking: isTrackingReducer
    },
    devTools: true
})