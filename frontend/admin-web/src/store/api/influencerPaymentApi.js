import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../services/baseQueryWithReauth";

const influencerPaymentApi = createApi({
  reducerPath: "influencerPaymentApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}influencerPayments`,
  }),
  tagTypes: [
  ],

  endpoints: (build) => ({
    createPayout: build.mutation({
      query: (payload) => ({
        url: "/transfer-funds",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),

  }),
});

export const {
  useCreatePayoutMutation,
} = influencerPaymentApi

export default influencerPaymentApi
