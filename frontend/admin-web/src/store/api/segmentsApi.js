import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../services/baseQueryWithReauth";

const segmentsApi = createApi({
  reducerPath: "segmentsApi",

  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}segments`,
  }),

  tagTypes: [
    "AllInfluencers",
    "AllAiInfluencers",
    "SegmentSummary",
    "MarkedCandidatesAndSavedFilter",
  ],

  endpoints: (build) => ({
    getAllInfluencers: build.query({
      query: ({ id, currentPage, itemsPerPage, searchTerm }) => ({
        url: `/${id}/get_influencers?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`,
      }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["AllInfluencers"],
    }),

    getAllAiInfluencers: build.query({
      query: ({ id, currentPage, itemsPerPage }) => ({
        url: `/${id}/get_ai_influencers?page=${currentPage}&limit=${itemsPerPage}`,
      }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["AllAiInfluencers"],
    }),

    getMarkedCandidatesAndSavedFilter: build.query({
      query: (id) => ({
        url: `/${id}/get_record`,
      }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["MarkedCandidatesAndSavedFilter"],
    }),

    getSegmentSummary: build.query({
      query: (id) => ({
        url: `/segment_summary/${id}`,
      }),
      transformResponse: (response, meta, arg) => {
        const summary = response?.data;

        const data = [
          {
            title: "Planned",
            count: summary.Planned.count,
            influencers: summary.Planned.influencers.map((influencer) => ({
              id: influencer.id,
              name: influencer.name,
              profilePicture: influencer.profilePicture,
              segmentName: influencer.segmentName,
            })),
          },
          {
            title: "Completed",
            count: summary.Completed.count,
            influencers: summary.Completed.influencers.map((influencer) => ({
              id: influencer.id,
              name: influencer.name,
              profilePicture: influencer.profilePicture,
              segmentName: influencer.segmentName,
            })),
          },
          {
            title: "Current",
            count: summary.Current.count,
            influencers: summary.Current.influencers.map((influencer) => ({
              id: influencer.id,
              name: influencer.name,
              profilePicture: influencer.profilePicture,
              segmentName: influencer.segmentName,
            })),
          },
          {
            title: "Considering",
            count: summary.Considering.count,
            influencers: summary.Considering.influencers.map((influencer) => ({
              id: influencer.id,
              name: influencer.name,
              profilePicture: influencer.profilePicture,
              segmentName: influencer.segmentName,
            })),
          },
        ];

        return data;
      },
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["SegmentSummary"],
    }),

    markCandidate: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}/mark_candidate`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error) => {
        return error ? [] : ["SegmentSummary"];
      },
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,

      async onQueryStarted(
        { id, influencerId, isMarked },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled; // wait for actual server response

          dispatch(
            segmentsApi.util.updateQueryData(
              "getMarkedCandidatesAndSavedFilter",
              id,
              (draft) => {
                return {
                  ...draft,
                  markedCandidates: !isMarked
                    ? [...draft.markedCandidates, influencerId]
                    : draft?.markedCandidates?.filter(
                        (candidate) => candidate !== influencerId
                      ),
                };
              }
            )
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),

    updateSegmentFilters: build.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (result, error) => {
        return error ? [] : ["AllInfluencers"];
      },
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
  }),
});

export const {
  useGetAllAiInfluencersQuery,
  useGetAllInfluencersQuery,
  useLazyGetAllAiInfluencersQuery,
  useLazyGetAllInfluencersQuery,
  useGetSegmentSummaryQuery,
  useMarkCandidateMutation,
  useGetMarkedCandidatesAndSavedFilterQuery,
  useUpdateSegmentFiltersMutation,
} = segmentsApi;

export default segmentsApi;
