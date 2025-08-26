import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  currentPlan: null,
  subscription: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user, currentPlan } = action.payload;
      //   console.log("action.payload" , action.payload);
      state.token = token;
      state.user = user;
      state.currentPlan = currentPlan;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.currentPlan = null;
      state.subscription = null;
    },
    setSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  setSubscription,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentPlan = (state) => state.auth.currentPlan;
export const selectSubscription = (state) => state.auth.subscription;
export const selectAuthIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
