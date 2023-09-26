import { configureStore } from "@reduxjs/toolkit";
import { isTrackingReducer } from "./isTrackingSlice";
import { currentPositionReducer } from "./currentPositionSlice";
import { lastLoggedPositionReducer } from "./lastLoggedPositionSlice";
import { sessionReducer } from "./sessionSlice";

export const store = configureStore({
    reducer: {
        isTracking: isTrackingReducer,
        currentPosition: currentPositionReducer,
        lastLoggedPosition: lastLoggedPositionReducer,
        session: sessionReducer
    },
    devTools: true
})