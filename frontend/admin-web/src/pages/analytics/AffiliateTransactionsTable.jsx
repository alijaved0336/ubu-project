import React, { useMemo } from "react";
import Table from "@src/components/Common/Table/Table";
import { formattedAmount, getFormattedDate } from "@src/utils/helpers";
import { Empty } from "antd";
import PropTypes from "prop-types";

const AffiliateTransactionsTable = ({
  isLoading,
  amazonAffiliateTransactionsSummary,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "Tracking Id",
        dataIndex: "trackingId",
        key: "trackingId",
      },

      {
        title: "Revenue",
        dataIndex: "revenue",
        key: "revenue",
        width: 250,
        render: (revenue) => {
          return formattedAmount(revenue);
        },
      },
      {
        title: "Clicks",
        dataIndex: "clicks",
        key: "clicks",
      },

      {
        title: "Ad Fees",
        dataIndex: "adFees",
        key: "adFees",
        render: (adFees) => {
          return formattedAmount(adFees);
        },
      },
      {
        title: "Items Shipped",
        dataIndex: "itemsShipped",
        key: "itemsShipped",
      },
      {
        title: "Items Ordered",
        dataIndex: "itemsOrdered",
        key: "itemsOrdered",
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        key: "created_at",
        render: (createdAt) => getFormattedDate(createdAt),
      },
    ],
    []
  );

  return (
    <Table
      rowKey="trackingId"
      columns={columns}
      loading={isLoading}
      dataSource={amazonAffiliateTransactionsSummary}
      pagination={false}
      tableLayout="auto"
      rootClassName="tw-custom-scrollbar"
      rowClassName="tw-font-manrope"
      className="tw-font-manrope tw-w-full tw-overflow-x-auto"
      locale={{
        emptyText: isLoading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Fetching Transactions"
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

AffiliateTransactionsTable.propTypes = {
  isLoading: PropTypes.bool,
  amazonAffiliateTransactionsSummary: PropTypes.array,
};
export default AffiliateTransactionsTable;
