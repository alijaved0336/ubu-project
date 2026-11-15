import { Button } from "@src/components/Common/Widgets";
import Table from "@src/components/Common/Widgets/Table/Table";
import BarChart from "@src/components/Charts/BarChart";
import Summary from "@src/components/Analytics/Summary";
import { useSelector } from "react-redux";
import { Tooltip, Skeleton, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import { showNotification } from "@src/utils/showNotification";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import { useParams } from "react-router-dom";
import InfluencerPaymentModal from "./InfluencerPaymentModal";
import { useGetInfluencersAffiliateMonthlyReportQuery } from "@src/store/api/affiliateReportApi";
import { useGetInfluencerPaymentsQuery } from "@src/store/api/influencerPaymentsApi";

import { Heading } from "@src/components/Common/Typography";
import PayoutTransactionsTable from "./PayoutTransactionsTable";

const InfluencerAnalytics = () => {
  const { id } = useParams();
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false);

  const {
    commissionArray,
    currentMonthSales,
    infConnectedAccountId,
    monthlyData,
    year,
    isLoadingReport,
  } = useGetInfluencersAffiliateMonthlyReportQuery(id, {
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

  const { influencerPayments, isLoadingPayments } =
    useGetInfluencerPaymentsQuery(id, {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        influencerPayments: data || [],
        isLoadingPayments: isLoading || isFetching,
      }),
      refetchOnMountOrArgChange: true,
    });

  const pendingCommistions = useMemo(() => {
    return commissionArray?.filter(
      (commision) =>
        !influencerPayments?.some(
          (payment) =>
            payment.month === commision?.month_year &&
            payment?.status?.toLowerCase() === "succeeded"
        )
    );
  }, [commissionArray, influencerPayments]);

  const hasPendingCommission = pendingCommistions?.length > 0;

  const handlePaymentConfirm = () => {
    setIsOpenPaymentModal(false);
  };

  return (
    <div className="tw-space-y-6 tw-mx-auto tw-max-w-full md:tw-max-w-[58.75rem] lg:tw-max-w-[67.5rem] xl:tw-max-w-[80rem]  tw-mb-12 tw-mt-12">
      <UBUBreadCrumb
        items={[{ title: "Dashboard" }, { title: "Influencer Analytics" }]}
      />

      {isOpenPaymentModal && (
        <InfluencerPaymentModal
          isOpen={isOpenPaymentModal}
          onConfirm={handlePaymentConfirm}
          monthRecords={pendingCommistions}
          influencerId={id}
          connectedAccountId={infConnectedAccountId}
          onCancel={() => setIsOpenPaymentModal(false)}
        />
      )}

      <div className="tw-grid tw-items-center md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-8">
        <BarChart data={monthlyData} isLoading={isLoadingReport} year={year} />
        <Summary
          data={currentMonthSales}
          isLoading={isLoadingReport}
          className="md:tw-justify-self-end md:tw-max-w-[500px]"
        />
      </div>

      <div className="tw-flex tw-justify-between tw-flex-wrap tw-items-center tw-gap-4 tw-py-4">
        <Heading level={3} className="tw-font-semibold ">
          Transaction History
        </Heading>
        <Tooltip
          className="tw-ml-auto "
          title={
            !infConnectedAccountId
              ? "Cannot initiate payment because influencer has not completed their Stripe connection"
              : !hasPendingCommission
              ? "No pending commision"
              : ""
          }
          placement="top"
        >
          <Button
            variant="outlined"
            type="primary"
            onClick={() => setIsOpenPaymentModal(true)}
            disabled={!infConnectedAccountId || !hasPendingCommission}
          >
            Initiate Payment
          </Button>
        </Tooltip>
      </div>
      <PayoutTransactionsTable
        isLoading={isLoadingPayments}
        payments={influencerPayments}
      />
    </div>
  );
};

export default InfluencerAnalytics;
