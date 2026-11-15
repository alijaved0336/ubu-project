import React, { useMemo } from "react";
import Table from "@src/components/Common/Table/Table";

import { formattedAmount, getFormattedDate } from "@src/utils/helpers";
import { Empty } from "antd";
import PropTypes from "prop-types";
import Status from "@src/components/Common/Typography/Status";

const PayoutTransactionsTable = ({ isLoading, payments }) => {
  const columns = useMemo(
    () => [
      {
        title: "Month",
        dataIndex: "month",
        key: "month",
      },

      {
        title: "Revenue",
        dataIndex: "amount",
        key: "amount",
        width: 250,
        render: (revenue) => {
          return formattedAmount(revenue);
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          return <Status text={status} />;
        },
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
      rowKey="id"
      columns={columns}
      loading={isLoading}
      dataSource={payments}
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

PayoutTransactionsTable.propTypes = {
  isLoading: PropTypes.bool,
  payments: PropTypes.array,
};

export default PayoutTransactionsTable;
