import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../services/baseQueryWithReauth";

const disputeApi = createApi({
  reducerPath: "disputeApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}`,
  }),
  tagTypes: ["AllDisputes"],

  endpoints: (build) => ({
    createDispute: build.mutation({
      query: (payload) => ({
        url: "campaign/create-dispute",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    updateDispute: build.mutation({
      query: ({ campaignDisputeId, ...data }) => ({
        url: `campaignDispute/${campaignDisputeId}/update-concerns`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    updateDisputeStatus: build.mutation({
      query: ({ campaignDisputeId, ...data }) => ({
        url: `campaignDispute/${campaignDisputeId}/update-status`,
        method: "PATCH",
        data,
      }),

      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: (result, error) => {
        return error ? [] : ["AllDisputes"];
      },
    }),

    resolveDispute: build.mutation({
      query: ({ campaignDisputeId, ...data }) => ({
        url: `campaignDispute/${campaignDisputeId}/mark-as-resolved`,
        method: "PATCH",
        data,
      }),

      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: (result, error) => {
        return error ? [] : ["AllDisputes"];
      },
    }),

    getAllDisputes: build.query({
      query: ({
        currentPage,
        itemsPerPage,
        status,
        resolutionAction,
        searchTerm,
        startDate,
        endDate,
      }) => ({
        url: `campaignDispute?page=${currentPage}&limit=${itemsPerPage}&status=${status}&resolution_action=${resolutionAction}&search=${searchTerm}${
          startDate && `&startDate=${startDate}`
        }${endDate && `&endDate=${endDate}`}`,
      }),

      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["AllDisputes"],
    }),
  }),
});

export const {
  useCreateDisputeMutation,
  useUpdateDisputeMutation,
  useResolveDisputeMutation,
  useGetAllDisputesQuery,
  useUpdateDisputeStatusMutation,
} = disputeApi;

export default disputeApi;
