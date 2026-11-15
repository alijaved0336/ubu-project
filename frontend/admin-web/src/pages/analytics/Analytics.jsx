import { Button } from "@src/components/Common/Widgets";
import Table from "@src/components/Common/Widgets/Table/Table";
import BarChart from "@src/components/Charts/BarChart";
import Summary from "@src/components/Analytics/Summary";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import { showNotification } from "@src/utils/showNotification";
import { Skeleton } from "antd";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import {
  useGetAffiliateMonthlyReportQuery,
  useGetAffiliateTransactionsQuery,
} from "@src/store/api/affiliateReportApi";
import AffiliateTransactionsTable from "./AffiliateTransactionsTable";
import { Heading } from "@src/components/Common/Typography";

const header = [
  {
    name: "Tracking Id",
    selector: "trackingId",
  },
  {
    name: "Revenue",
    selector: "revenue",
  },
  {
    name: "Clicks",
    selector: "clicks",
  },
  {
    name: "Ad Fees",
    selector: "adFees",
  },
  {
    name: "Items Shipped",
    selector: "itemsShipped",
  },
  {
    name: "Items Ordered",
    selector: "itemsOrdered",
  },
];
const Analytics = () => {
  const { currentMonthSales, monthlyData, year, isLoadingReport } =
    useGetAffiliateMonthlyReportQuery(undefined, {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        currentMonthSales: data?.currentMonthSales,
        infConnectedAccountId: data?.infConnectedAccountId,
        commissionArray: data?.commissionArray,
        monthlyData: data?.monthlyData,
        isLoadingReport: isLoading || isFetching,
        year: data?.year,
      }),
      refetchOnMountOrArgChange: true,
    });

  const { isLoadingTransactions, transactions } =
    useGetAffiliateTransactionsQuery(undefined, {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        transactions: data,
        isLoadingTransactions: isLoading || isFetching,
      }),
      refetchOnMountOrArgChange: true,
    });

  const downloadCSV = () => {
    if (!transactions?.length) {
      showNotification({
        notificationType: "error",
        message: "Data not found to export",
      });
      return;
    }
    const headers = header.map((h) => h.name).join(",");
    const rows = transactions?.map((tb) => [
      tb.trackingId || "N/A",
      tb.revenue >= 0 ? tb.revenue : "N/A",
      tb.clicks >= 0 ? tb.clicks : "N/A",
      tb.adFees >= 0 ? tb.adFees : "N/A",
      tb.itemsShipped >= 0 ? tb.itemsShipped : "N/A",
      tb.itemsOrdered >= 0 ? tb.itemsOrdered : "N/A",
    ]);

    const csvContent = [headers, ...rows.map((row) => row.join(","))].join(
      "\n"
    );

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "transaction-history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="tw-space-y-6 tw-mx-auto tw-max-w-full md:tw-max-w-[58.75rem] lg:tw-max-w-[67.5rem] xl:tw-max-w-[80rem]  tw-mb-12 tw-mt-12">
      <UBUBreadCrumb items={[{ title: "Dashboard" }, { title: "Analytics" }]} />
      <div className="analytics-main">
        <div className="tw-grid tw-items-center md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-8">
          <BarChart
            data={monthlyData}
            isLoading={isLoadingReport}
            year={year}
          />
          <Summary
            data={currentMonthSales}
            isLoading={isLoadingReport}
            className="md:tw-justify-self-end md:tw-max-w-[500px]"
          />
        </div>

        <div className="tw-flex tw-flex-wrap tw-justify-between tw-my-5 tw-gap-4 tw-py-4">
          <Heading level={3} className="tw-font-semibold">
            Transaction History
          </Heading>
          <Button
            variant="outlined"
            type="secondary"
            className="tw-ml-auto"
            onClick={downloadCSV}
          >
            Download CSV
          </Button>
        </div>

        <div className="tw-w-full">
          <AffiliateTransactionsTable
            transactions={transactions}
            isLoading={isLoadingTransactions}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
