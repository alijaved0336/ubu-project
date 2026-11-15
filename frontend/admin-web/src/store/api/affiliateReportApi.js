import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../services/baseQueryWithReauth";

const getMappedMonthlyReport = (data) => {
  const currentMonthSales = data?.currentMonthSales;
  const infConnectedAccountId = data?.stripe_connected_account_id;
  const type = data?.type;

  const monthlyData = Array(12).fill(0);
  let year = null;

  const commissionArray = data?.totalMonthlySales.map((item) => {
    const month_year = item.month_year;
    const value = type === "influencer" ? item.total_ad_fees : item.total_sales;
    const key = type === "influencer" ? "total_ad_fees" : "total_sales";

    const [yearStr, monthStr] = month_year.split("-");
    if (!year) year = parseInt(yearStr);

    const month = parseInt(monthStr, 10);
    monthlyData[month - 1] = value;

    return {
      month_year,
      [key]: value,
    };
  });

  return {
    currentMonthSales,
    infConnectedAccountId,
    commissionArray,
    monthlyData,
    year,
  };
};

const getMapppedTransactions = (transactions) => {
  return transactions?.map((d) => ({
    trackingId: d.trackingId,
    revenue: d.revenue,
    clicks: d.clicks,
    adFees: d.adFees,
    itemsShipped: d.itemsShipped,
    itemsOrdered: d.itemsOrdered,
  }));
};

const affiliateReportApi = createApi({
  reducerPath: "affiliateReportApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}affiliate_report`,
  }),
  tagTypes: [
    "GetAffiliateMonthlyReport",
    "GetInfluencersAffiliateMonthlyReport",
    "GetAffiliateTransactions",
  ],
  endpoints: (build) => ({
    getAffiliateMonthlyReport: build.query({
      query: () => ({
        url: `/affiliate-monthly-report`,
      }),

      transformResponse: (response, meta, arg) =>
        getMappedMonthlyReport(response.data),
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["GetAffiliateMonthlyReport"],
    }),
    getInfluencersAffiliateMonthlyReport: build.query({
      query: (id) => ({
        url: `/affiliate-monthly-report/${id}`,
      }),

      transformResponse: (response, meta, arg) =>
        getMappedMonthlyReport(response.data),
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["GetInfluencersAffiliateMonthlyReport"],
    }),
    getAffiliateTransactions: build.query({
      query: () => ({
        url: `/affiliate-transcations`,
      }),

      transformResponse: (response, meta, arg) =>
        getMapppedTransactions(response.data),
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["GetTransactions"],
    }),
  }),
});

export const {
  useGetInfluencersAffiliateMonthlyReportQuery,
  useGetAffiliateMonthlyReportQuery,
  useGetAffiliateTransactionsQuery,
} = affiliateReportApi;

export default affiliateReportApi;
