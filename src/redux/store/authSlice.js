import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  default_year: null,
  user_position: null,
  user_type: null,
  token_expire_time: null,
  allUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.default_year = action.payload.default_year;
      state.user_position = action.payload.user_position;
      state.user_type = action.payload.user_type;
      state.token_expire_time = action.payload.token_expire_time;
      state.allUsers = action.payload.allUsers;
    },
    logout: (state) => {
      return initialState;
    },
    updateDefaultYear: (state, action) => {
      state.default_year = action.payload; // Updates only default_year
    },
  },
});

export const { loginSuccess, logout, updateDefaultYear } = authSlice.actions;
export default authSlice.reducer;
