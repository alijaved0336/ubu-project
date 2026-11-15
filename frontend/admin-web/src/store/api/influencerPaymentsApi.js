import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../services/baseQueryWithReauth";

const influencerPaymentsApi = createApi({
  reducerPath: "influencerPaymentsApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}influencerPayments`,
  }),
  tagTypes: ["GetInfluencerPayments"],
  endpoints: (build) => ({
    createPayout: build.mutation({
      query: (payload) => ({
        url: "/transfer-funds",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: (result, error) => {
        return error ? [] : ["GetInfluencerPayments"];
      },
    }),
    getInfluencerPayments: build.query({
      query: (id) => ({
        url: `/${id}`,
      }),

      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["GetInfluencerPayments"],
    }),
  }),
});

export const { useGetInfluencerPaymentsQuery, useCreatePayoutMutation } =
  influencerPaymentsApi;

export default influencerPaymentsApi;
