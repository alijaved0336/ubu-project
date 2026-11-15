import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../services/baseQueryWithReauth";

const withdrawalsApi = createApi({
  reducerPath: "withdrawalsApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}`,
  }),
  tagTypes: ["Withdrawals"],
  endpoints: (build) => ({
    createWithdrawal: build.mutation({
      query: ({ amount, influencer_id }) => {
        // Ensure amount and influencer_id are numbers
        const numericAmount = Number(amount);
        const numericInfluencerId = Number(influencer_id);

        // Basic validation to ensure they are not NaN or empty after conversion
        if (isNaN(numericAmount) || isNaN(numericInfluencerId)) {
          throw new Error("Amount and Influencer ID must be valid numbers.");
        }
        if (
          amount === null ||
          amount === undefined ||
          amount === "" ||
          influencer_id === null ||
          influencer_id === undefined ||
          influencer_id === ""
        ) {
          throw new Error("Amount and Influencer ID cannot be empty.");
        }
        return {
          url: `withdrawals`,
          method: "POST",
          data: { amount: numericAmount, influencer_id: numericInfluencerId },
        };
      },
      invalidatesTags: ["Withdrawals"],
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    getWithdrawalsByInfluencerId: build.query({
      query: (influencerId) => {
        if (influencerId) {
          return {
            url: `withdrawals/influencer/${influencerId}`,
            method: "GET",
          };
        }
      },
      providesTags: ["Withdrawals"],
    }),
  }),
});

export const {
  useCreateWithdrawalMutation,
  useGetWithdrawalsByInfluencerIdQuery,
} = withdrawalsApi;

export default withdrawalsApi;
