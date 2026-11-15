import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../services/baseQueryWithReauth";

const campaignPaymentApi = createApi({
  reducerPath: "campaignPaymentApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}campaignPayment`,
  }),
  tagTypes: [
    "AllCountries",
    "ConnectedAccountDetails",
    "CampaignTransactions",
    "CampaignTransactionsSummary",
  ],

  endpoints: (build) => ({
    createPaymentIntent: build.mutation({
      query: (payload) => ({
        url: "/create-payment-intent",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),

    createConnectedAccount: build.mutation({
      query: (payload) => ({
        url: "/create-connected-account",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),

    updateConnectedAccount: build.mutation({
      query: (payload) => ({
        url: "/update-connected-account",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),

    getConnectedAccountDetails: build.query({
      query: () => ({
        url: "/connected-account/details",
      }),

      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["ConnectedAccountDetails"],
    }),

    getCampaignTransactions: build.query({
      query: ({
        currentPage,
        itemsPerPage,
        searchTerm,
        status,
        startDate,
        endDate,
      }) => ({
        url: `/transactions-logs?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&status=${status}${
          startDate && `&startDate=${startDate}`
        }${endDate && `&endDate=${endDate}`}`,
      }),

      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["CampaignTransactions"],
    }),

    getCampaignTransactionsSummary: build.query({
      query: () => ({
        url: "/transactions-summary",
      }),

      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["CampaignTransactionsSummary"],
    }),

    releaseFunds: build.mutation({
      query: (payload) => ({
        url: "/release-funds",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),

    processRefund: build.mutation({
      query: (payload) => ({
        url: "/refunds-request",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (result, error) => {
        return error
          ? []
          : ["CampaignTransactions", "CampaignTransactionsSummary"];
      },
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    getCountries: build.query({
      query: () => ({
        url: "/country-list",
      }),
      transformResponse: (response, meta, arg) => {
        const countriesData = response?.data?.data;
        const data = countriesData?.supported_bank_account_currencies ?? {};

        const countries = [
          ...new Set(Object.values(data).flatMap((countries) => countries)),
        ]?.map((country) => ({
          label: country,
          value: country,
        }));

        return {
          defaultCountry: {
            label: countriesData?.id,
            value: countriesData?.id,
          },
          countries,
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["AllCountries"],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetConnectedAccountDetailsQuery,
  useCreatePaymentIntentMutation,
  useCreateConnectedAccountMutation,
  useUpdateConnectedAccountMutation,
  useReleaseFundsMutation,
  useProcessRefundMutation,
  useGetCampaignTransactionsQuery,
  useGetCampaignTransactionsSummaryQuery,
} = campaignPaymentApi;

export default campaignPaymentApi;
