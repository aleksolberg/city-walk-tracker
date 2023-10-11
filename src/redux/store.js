import { configureStore } from "@reduxjs/toolkit";
import { isTrackingReducer } from "./isTrackingSlice";
import { currentPositionReducer } from "./currentPositionSlice";
import { lastLoggedPositionReducer } from "./lastLoggedPositionSlice";
import { sessionReducer } from "./sessionSlice";
import { isFollowingUserReducer } from "./isFollowingUserSlice";

export const store = configureStore({
    reducer: {
        isTracking: isTrackingReducer,
        isFollowingUser: isFollowingUserReducer,
        currentPosition: currentPositionReducer,
        lastLoggedPosition: lastLoggedPositionReducer,
        session: sessionReducer
    },
    devTools: true
})