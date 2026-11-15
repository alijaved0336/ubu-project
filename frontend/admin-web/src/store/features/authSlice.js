import { createSlice } from "@reduxjs/toolkit";
import userApi from "../api/userApi";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, msg, ...user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.user = user;

      if (Array.isArray(msg)) {
        state.user.msg = msg[0];
      } else {
        state.user.msg = msg;
      }
    },
    setUpdatedUser: (state, action) => {
      state.isAdmin = action.payload.is_admin;
      state.user.isSurveyDone = action.payload.is_questionnaire_completed;
      state.user.msg = action.payload.msg;
      state.user.isAdmin = action.payload.is_admin;
      state.user.isBrand = action.payload.is_brand;
      state.user.isInfluencer = action.payload.is_influencer;
      state.user.isConsumer = action.payload.is_consumer;
      state.user.type = action.payload.type;
      state.user.isScanned = action.payload.is_scanned || false;
    },
    setIsScanned: (state, action) => {
      state.user.isScanned = action.payload;
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const logout = () => (dispatch, getState) => {
  dispatch(authSlice.actions.logout());
  dispatch(userApi.util.resetApiState());
  dispatch(userApi.util.invalidateTags(["User"]));
};

export const { setCredentials, setUpdatedUser, setIsScanned } =
  authSlice.actions;

export default authSlice.reducer;
