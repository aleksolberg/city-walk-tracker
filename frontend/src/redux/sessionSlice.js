import { createSlice } from '@reduxjs/toolkit';

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    id: null,
  },
  reducers: {
    setSessionId: (state, action) => {
        state.id = action.payload;
    },
    exitSession: state => {
        state.id = null;
    }
  },
});

export const { setSessionId, exitSession } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;