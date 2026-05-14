import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.hydrated = true;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.hydrated = true;
    },
    setHydrated: (state) => {
      state.hydrated = true;
    },
  },
});

export const { setCredentials, clearCredentials, setHydrated } = authSlice.actions;
export const authReducer = authSlice.reducer;
