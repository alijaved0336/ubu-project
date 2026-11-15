import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../services/baseQueryWithReauth";

const instagramApi = createApi({
  reducerPath: "instagramApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}instagram`,
  }),
  tagTypes: ["InfluencersInstagramStats"],
  endpoints: (build) => ({
    getInfluencersInstagramStats: build.query({
      query: (influencerId) => ({ url: `/${influencerId}/user-stats` }),
    }),
    transformResponse: (response, meta, arg) => response.data,
    transformErrorResponse: (response, meta, arg) => response.data,
    providesTags: ["InfluencersInstagramStats"],
  }),
});

export const {
  useLazyGetInfluencersInstagramStatsQuery,
  useGetInfluencersInstagramStatsQuery,
} = instagramApi;

export default instagramApi;
