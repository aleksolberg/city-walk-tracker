import { createSlice } from "@reduxjs/toolkit";

export const currentNodesSlice = createSlice({
    name: 'currentNodes',
    initialState: {
        value: [],
    },
    reducers: {
        addNodeToCurrentNodes: (state, action) => {
            if (!state.value.includes(action.payload)){
                state.value = [...state.value, action.payload];
            }
        },
        clearCurrentNodes: state => {state.value = []}
    }
})

export const { addNodeToCurrentNodes, clearCurrentNodes } = currentNodesSlice.actions;
export const currentNodesReducer = currentNodesSlice.reducer;