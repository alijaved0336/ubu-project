import { memo } from "react";
import { Heading } from "@src/components/Common/Typography";
import TransactionsSummary from "./TransactionsSummary";
import TransactionsTable from "./TransactionsTable";
import TransactionsTableHeader from "./TransactionsTableHeader";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import AffiliateTransactionsTable from "../analytics/AffiliateTransactionsTable";
import WithdrawButton from "./WithdrawButton";

import CampaignTransactionsProvider from "@src/components/Providers/CampaignTransactionsProvider";

import { useGetUserQuery } from "@src/store/api/userApi";
import { useGetAffiliateTransactionsQuery } from "@src/store/api/affiliateReportApi";
import { useGetCampaignTransactionsSummaryQuery } from "@src/store/api/campaignPaymentApi";
import { useGetWithdrawalsByInfluencerIdQuery } from "@src/store/api/withdrawableAmountApi";
import WithdrawTable from "./WithdrawTable";

const Transactions = () => {
  const {
    data: affiliateData,
    isLoading: isLoadingAffiliate,
    isFetching: isFetchingAffiliate,
  } = useGetAffiliateTransactionsQuery();
  const amazonAffiliateTransactions = affiliateData || [];

  const {
    data: userData,
    isLoading: isLoadingUser,
    isFetching: isFetchingUser,
  } = useGetUserQuery();
  const influencerId = userData?.influencer?.id || null;

  const { campaignTransactionsSummary, isLoadingCampaign } =
    useGetCampaignTransactionsSummaryQuery(undefined, {
      selectFromResult: ({ isError, isLoading, isFetching, data }) => ({
        isLoadingCampaign: isLoading || isFetching,
        campaignTransactionsSummary: data?.data?.result || {},
      }),
      refetchOnMountOrArgChange: true,
    });

  const {
    data: withdrawalsTransactions = [],
    isFetching: isFetchingWithdrawals,
    isLoading: isLoadingWithdrawals,
  } = useGetWithdrawalsByInfluencerIdQuery(influencerId);

  const isLoading =
    isLoadingAffiliate ||
    isFetchingAffiliate ||
    isLoadingUser ||
    isFetchingUser ||
    isLoadingCampaign ||
    isFetchingWithdrawals ||
    isLoadingWithdrawals;

  return (
    <div>
      <UBUBreadCrumb
        items={[{ title: "Dashboard" }, { title: "Transactions" }]}
      />

      <div className="tw-space-y-6 tw-font-manrope">
        <div className="tw-flex tw-items-center tw-justify-between">
          <Heading level={3} className="tw-font-bold">
            Transactions
          </Heading>
          <WithdrawButton
            amazonAffiliateTransactions={amazonAffiliateTransactions ?? []}
            campaignTransactionsSummary={campaignTransactionsSummary}
            withdrawalsTransactions={withdrawalsTransactions ?? []}
          />
        </div>

        <div className="tw-rounded-xl tw-border tw-border-[#D7D8DC] tw-p-4 tw-space-y-8">
          <TransactionsSummary
            amazonAffiliateTransactions={amazonAffiliateTransactions}
            campaignTransactionsSummary={campaignTransactionsSummary}
            withdrawalsTransactions={withdrawalsTransactions}
            isLoading={isLoading}
          />

          <CampaignTransactionsProvider>
            <TransactionsTableHeader />
            <TransactionsTable />
          </CampaignTransactionsProvider>

          <Heading level={4} className="tw-font-bold">
            Advertisement Commission
          </Heading>

          <div className="tw-w-full">
            <AffiliateTransactionsTable
              amazonAffiliateTransactionsSummary={amazonAffiliateTransactions}
              isLoading={isLoading}
            />
          </div>
          <Heading level={4} className="tw-font-bold">
            Withdrawals
          </Heading>

          <div className="tw-w-full">
            <WithdrawTable
              withdrawals={withdrawalsTransactions}
              isLoading={isLoadingWithdrawals && isFetchingWithdrawals}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Transactions);
