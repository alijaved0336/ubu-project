import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../services/baseQueryWithReauth";

const influencersApi = createApi({
  reducerPath: "influencersApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}influencer`,
  }),
  tagTypes: ["InfluencerInfo"],
  endpoints: (build) => ({
    getInfluencerInfo: build.query({
      query: () => ({
        url: `/info`,
      }),

      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["InfluencerInfo"],
    }),

    updateAccountModalStatus: build.mutation({
      query: () => ({
        url: `/update-modal-status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error) => {
        return error ? [] : ["InfluencerInfo"];
      },
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
  }),
});

export const {
  useGetInfluencerInfoQuery,
  useUpdateAccountModalStatusMutation,
} = influencersApi;

export default influencersApi;
