import { createApi } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../features/authSlice";
import { axiosBaseQuery } from "../services/axiosBaseQuery";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    refreshToken: build.mutation({
      query: (refresh_token) => ({
        url: "refresh_token",
        method: "POST",
        data: { refresh_token },
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const user = data?.data;

          dispatch(setCredentials(user));
        } catch {
          dispatch(logout()); // Logout if token refresh fails
        }
      },
    }),
  }),
});

// create-checkout-session

export const { useRefreshTokenMutation } = authApi;

export default authApi;
