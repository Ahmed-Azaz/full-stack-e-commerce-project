import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: localStorage.getItem("lang") || "en"
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage(state, action) {
            state.value = action.payload;
            localStorage.setItem("lang", action.payload);
        }
    }
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;