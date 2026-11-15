/* eslint-disable react/prop-types */
import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import TransactionsSummaryCard from "./TransactionsSummaryCard";
import TransactionsSummaryCardSkeleton from "./TransactionsSummaryCardSkeleton";
import { formattedAmount } from "@src/utils/helpers";
import { getTotalWithdrawnAmount } from "@src/utils/commonFunctions";

const TransactionsSummary = ({
  campaignTransactionsSummary = {},
  withdrawalsTransactions = [],
  amazonAffiliateTransactions = [],
  isLoading,
}) => {
  const { user } = useSelector((state) => state.auth || {});

  const totalAmazonRevenue = useMemo(() => {
    return amazonAffiliateTransactions.reduce((sum, txn) => {
      return sum + parseFloat(txn?.revenue || 0);
    }, 0);
  }, [amazonAffiliateTransactions]);

  const totalWithdrawn = useMemo(() => {
    return getTotalWithdrawnAmount(withdrawalsTransactions);
  }, [withdrawalsTransactions]);

  const totalTransferred =
    (campaignTransactionsSummary?.totalTransferredFunds || 0) / 100;

  const totalWithdrawable =
    totalTransferred + totalAmazonRevenue - totalWithdrawn;

  // Formatted Values
  const totalWithdrawableFormatted = formattedAmount(
    Math.max(totalWithdrawable, 0)
  );
  const totalWithdrawnFormatted = formattedAmount(totalWithdrawn);
  const totalCompletedRefunds = formattedAmount(
    (campaignTransactionsSummary?.totalCompletedRefunds || 0) / 100
  );
  const totalSuccessfulPayments = formattedAmount(
    (campaignTransactionsSummary?.totalSuccessfulPayments || 0) / 100
  );
  const totalTransferredFunds = formattedAmount(totalTransferred);
  const totalAmazonRevenueFormatted = formattedAmount(totalAmazonRevenue);

  if (isLoading) {
    return user?.type === "brand" ? (
      <div className="tw-grid tw-grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] tw-gap-4 tw-p-4 tw-border-b tw-border-[#D7D8DC]">
        <TransactionsSummaryCardSkeleton />
        <TransactionsSummaryCardSkeleton />
        <TransactionsSummaryCardSkeleton />
      </div>
    ) : (
      <div className="tw-flex tw-justify-center tw-gap-4 tw-p-4 tw-border-b tw-border-[#D7D8DC]">
        <TransactionsSummaryCardSkeleton className="tw-flex-grow-0" />
      </div>
    );
  }

  return (
    <div className="tw-grid tw-grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] tw-gap-4 tw-p-4 tw-border-b tw-border-[#D7D8DC]">
      {user?.type === "brand" ? (
        <>
          <TransactionsSummaryCard
            status="Total Processed Refunds"
            amount={totalCompletedRefunds}
          />
          <TransactionsSummaryCard
            status="Total Amount Charged"
            amount={totalSuccessfulPayments}
          />
          <TransactionsSummaryCard
            status="Total Transferred Funds"
            amount={totalTransferredFunds}
          />
        </>
      ) : (
        <>
          <TransactionsSummaryCard
            status="Total Withdrawable Balance"
            amount={totalWithdrawableFormatted}
          />
          <TransactionsSummaryCard
            status="Total Amount Already Withdrawn"
            amount={totalWithdrawnFormatted}
          />
          <TransactionsSummaryCard
            status="Total Campaign Revenue"
            amount={totalTransferredFunds}
          />
          <TransactionsSummaryCard
            status="Total Amazon Affiliate Revenue"
            amount={totalAmazonRevenueFormatted}
          />
        </>
      )}
    </div>
  );
};

TransactionsSummary.propTypes = {
  isLoading: PropTypes.bool,
  campaignTransactionsSummary: PropTypes.object,
  withdrawalsTransactions: PropTypes.array,
  amazonAffiliateTransactions: PropTypes.array,
};

export default memo(TransactionsSummary);
