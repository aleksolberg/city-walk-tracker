import { createSlice } from "@reduxjs/toolkit";

export const lastLoggedPositionSlice = createSlice({
    name: 'lastLoggedPosition',
    initialState: {
        value: null,
    },
    reducers: {
        setLastLoggedPosition: (state, action) => {
            state.value = action.payload;
        },
    }
})

export const { setLastLoggedPosition } = lastLoggedPositionSlice.actions;
export const lastLoggedPositionReducer = lastLoggedPositionSlice.reducer;