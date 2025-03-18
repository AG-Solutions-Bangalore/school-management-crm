import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentOpenItem: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrentOpenItem: (state, action) => {
      state.currentOpenItem = action.payload;
    },
  },
});

export const { setCurrentOpenItem } = uiSlice.actions;
export default uiSlice.reducer;
