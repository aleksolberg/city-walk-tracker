import { configureStore } from "@reduxjs/toolkit";
import { isTrackingReducer } from "./isTrackingSlice";
import { currentRawPathReducer } from "./currentRawPathSlice";
import { currentNodesReducer } from "./currentNodesSlice";

export const store = configureStore({
    reducer: {
        isTracking: isTrackingReducer,
        currentRawPath: currentRawPathReducer,
        currentNodes: currentNodesReducer
    },
    devTools: true
})