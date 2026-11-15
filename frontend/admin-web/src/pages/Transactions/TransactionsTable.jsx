import { Button } from "@src/components/Common/Widgets";
import Status from "@src/components/Common/Typography/Status";
import Table from "@src/components/Common/Table/Table";

import { formattedAmount, getFormattedDate } from "@src/utils/helpers";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { useCampaignTransactions } from "@src/components/Providers/CampaignTransactionsProvider";
import { Empty, Tooltip } from "antd";

const expandable = {
  expandedRowRender: (transaction) => (
    <div className="tw-bg-gray-100 tw-p-4 tw-rounded-lg tw-flex tw-gap-4">
      {/* Funds Released Section */}
      <div className="tw-flex-grow">
        <h3 className="tw-font-semibold tw-text-lg tw-mb-2">Funds Released</h3>
        {transaction.fundRelease?.length > 0 ? (
          <div className="tw-space-y-2">
            {transaction?.fundRelease?.map((fund, index) => (
              <div
                key={index}
                className="tw-flex tw-justify-between tw-bg-white tw-p-3 tw-rounded-lg tw-shadow-sm"
              >
                <span>
                  <span className="tw-font-bold">Amount:</span>{" "}
                  <span>{formattedAmount(fund?.amount / 100)}</span>
                </span>
                <span className="tw-flex tw-items-center tw-gap-2">
                  <span className="tw-font-bold"> Status:</span>{" "}
                  <span className="tw-capitalize">
                    {fund?.status?.replace("-", " ")}
                  </span>
                </span>
                <span>
                  <span className="tw-font-bold"> Date:</span>{" "}
                  <span>{getFormattedDate(fund?.created_at)}</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="tw-text-gray-500">No funds have been released yet.</p>
        )}
      </div>

      {/* Refund Section */}
      <div className="tw-flex-grow">
        <h3 className="tw-font-semibold tw-text-lg tw-mb-2">Refund</h3>
        {transaction?.refund?.length > 0 ? (
          <div className="tw-space-y-2">
            {transaction?.refund?.map((refund, index) => (
              <div
                key={index}
                className="tw-flex tw-justify-between tw-gap-3 tw-bg-white tw-p-3 tw-rounded-lg tw-shadow-sm"
              >
                <span>
                  <span className="tw-font-bold">Amount: </span>
                  <span>{formattedAmount(refund?.amount)}</span>
                </span>
                <span className="tw-flex tw-items-center tw-gap-2">
                  <span className="tw-font-bold">Status:</span>{" "}
                  <span className="tw-capitalize">
                    {refund?.status?.replace("-", " ")}
                  </span>
                </span>
                <span className="tw-font-bold">
                  <span className="">Transaction ID:</span>{" "}
                  <span>{refund?.transaction_id}</span>
                </span>
                <span>
                  <span className="tw-font-bold">Date:</span>{" "}
                  <span>{getFormattedDate(refund?.created_at)}</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="tw-text-gray-500">
            No refunds have been processed yet.
          </p>
        )}
      </div>
    </div>
  ),
  rowExpandable: (transaction) =>
    transaction.fundRelease?.length || transaction?.refund?.length, // Expandable logic
};

const TransactionsTable = () => {
  const { user } = useSelector((state) => state.auth || {});

  const { campaignTransactions, isLoading, onOpenProcessRefundModal } =
    useCampaignTransactions();

  const columns = useMemo(
    () => [
      {
        title: "Payment ID",
        dataIndex: "payment_intent_id",
        key: "payment_intent_id",
      },
      {
        title: "Campaign ID",
        dataIndex: "campaign",
        key: "campaign.id",
        render: (campaign) => campaign?.id,
      },
      {
        title: "Creator",
        dataIndex: "campaign.influencer",
        key: "influencer",
        render: (_, transaction) =>
          `${transaction?.campaign?.influencer?.user?.first_name} ${transaction?.campaign?.influencer?.user?.last_name}`,
        hidden: user?.type === "influencer",
      },
      {
        title: "Business",
        dataIndex: "user",
        key: "user.brand",
        render: (user) => user?.brand?.brand_name || "N/A",
        hidden: user?.type === "brand",
      },
      {
        title: "Charged Amount",
        dataIndex: "amount",
        key: "amount",
        render: (amount) => formattedAmount(amount / 100),
        hidden: user?.type === "influencer",
      },
      {
        title: "Campaign Amount",
        dataIndex: "campaign",
        key: "campaign.exhibitDocuments[0].totalCompensation",
        render: (campaign) =>
          formattedAmount(campaign?.exhibitDocuments?.[0]?.totalCompensation),
      },
      {
        title: (
          <Tooltip
            title={
              user?.type === "influencer"
                ? "You will receive 80% of the campaign amount after UBU’s 20% platform fee is deducted."
                : null
            }
          >
            Amount To Receive
          </Tooltip>
        ),
        dataIndex: "campaign",
        key: "amountToReceive",
        render: (campaign) => {
          const campaignAmount =
            +campaign?.exhibitDocuments?.[0]?.totalCompensation || 0;
          const ubuPercentage = (campaignAmount * 20) / 100;
          const amountToReceive = campaignAmount - ubuPercentage;
          return formattedAmount(amountToReceive);
        },
      },

      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status, transaction) => {
          let fundsStatus =
            transaction?.fundRelease?.length > 0
              ? transaction?.fundRelease?.[0]?.status
              : "";

          console.log({ status, fundsStatus, transaction });
          if (!fundsStatus) {
            switch (status) {
              case "refunded":
              case "in-complete":
                fundsStatus = "cancelled";
                break;
              case "succeeded":
                fundsStatus = "payment-held";
                break;
              default:
                fundsStatus =
                  transaction?.fundRelease?.length > 0
                    ? transaction?.fundRelease?.[0]?.status
                    : "";
            }
          }

          return <Status text={status} />;
        },
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        key: "created_at",
        render: (createdAt) => getFormattedDate(createdAt),
      },
      // {
      //   title: "Actions",
      //   dataIndex: "actions",
      //   key: "actions",
      //   hidden: user?.type === "influencer",
      //   render: (_, transaction) => {
      //     const notRefundable =
      //       transaction?.is_transferred || transaction?.refund?.length > 0;

      //     return (
      //       <Button
      //         variant="outlined"
      //         disabled={notRefundable}
      //         onClick={() => {
      //           if (!notRefundable)
      //             onOpenProcessRefundModal(transaction?.campaign?.id);
      //         }}
      //       >
      //         Refund
      //       </Button>
      //     );
      //   },
      // },
    ],
    [user]
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      loading={isLoading}
      dataSource={campaignTransactions}
      pagination={false}
      expandable={user?.type === "brand" ? expandable : null}
      tableLayout="auto"
      scroll={{ x: "max-content" }} // Allow horizontal scrolling
      rowClassName="tw-font-manrope"
      className="tw-font-manrope tw-w-full tw-overflow-x-auto"
      locale={{
        emptyText: isLoading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Fetching transactions"
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No transaction found"
          />
        ),
      }}
    />
  );
};

export default memo(TransactionsTable);
