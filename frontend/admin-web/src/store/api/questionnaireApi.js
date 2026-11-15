import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../services/baseQueryWithReauth";

const questionnaireApi = createApi({
  reducerPath: "questionnaireApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}questionnaire`,
  }),
  tagTypes: ["SegmentQuestionnaire", "InfluencerQuestionnaire"],
  endpoints: (build) => ({
    getSegmentQuestionnaire: build.query({
      query: () => ({ url: `/segment` }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["SegmentQuestionnaire"],
    }),

    getInfluencerQuestionnaire: build.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return { url: `/influencer?aa=true&${queryString}` };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["InfluencerQuestionnaire"],
    }),
  }),
});

export const {
  useGetSegmentQuestionnaireQuery,
  useGetInfluencerQuestionnaireQuery,
} = questionnaireApi;

export default questionnaireApi;
