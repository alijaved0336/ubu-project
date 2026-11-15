import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../services/baseQueryWithReauth";

const subscriptionsApi = createApi({
  reducerPath: "subscriptionsApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}ubusubscription`,
  }),
  tagTypes: ["AllSubscriptions, Invoice"],
  endpoints: (build) => ({
    getAllSubscriptions: build.query({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => ({ url: "/products" }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["AllSubscriptions"],
    }),

    getInvoice: build.query({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => ({ url: "/get-invoice" }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["Invoice"],
    }),

    createCheckoutSession: build.mutation({
      // note: an optional `queryFn` may be used in place of `query`
      query: (body) => ({
        url: "/create-checkout-session",
        method: "POST",
        data: body,
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    cancelSubscription: build.mutation({
      // note: an optional `queryFn` may be used in place of `query`
      query: (subscriptionId) => ({
        url: `/un_subscribe/subscription/${subscriptionId}`,
        method: "DELETE",
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
  }),
});

// create-checkout-session

export const {
  useGetAllSubscriptionsQuery,
  useGetInvoiceQuery,
  useCreateCheckoutSessionMutation,
  useCancelSubscriptionMutation,
} = subscriptionsApi;

export default subscriptionsApi;
