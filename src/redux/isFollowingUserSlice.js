import { createSlice } from "@reduxjs/toolkit";

export const isFollowingUserSlice = createSlice({
    name: 'isFollowingUser',
    initialState: {
        value: true,
    },
    reducers: {
        setIsFollowingUserTrue: state => {
            state.value = true;
        },
        setIsFollowingUserFalse: state => {
            state.value = false;
        }
    }
})

export const { setIsFollowingUserTrue, setIsFollowingUserFalse } = isFollowingUserSlice.actions;
export const isFollowingUserReducer = isFollowingUserSlice.reducer;