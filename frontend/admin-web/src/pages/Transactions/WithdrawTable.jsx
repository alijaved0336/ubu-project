import React, { useMemo } from "react";
import Table from "@src/components/Common/Table/Table";
import { formattedAmount, getFormattedDate } from "@src/utils/helpers";
import { Empty, Tag } from "antd";
import PropTypes from "prop-types";

const WithdrawTable = ({ isLoading, withdrawals }) => {
  const columns = useMemo(
    () => [
      {
        title: "Withdraw Amount",
        dataIndex: "amount",
        key: "amount",
        render: (amount) => formattedAmount(amount),
      },
      {
        title: "Currency",
        dataIndex: "currency",
        key: "currency",
      },
      {
        title: "Withdraw Date",
        dataIndex: "updated_at",
        key: "updated_at",
        render: (date) => getFormattedDate(date),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusMap = {
            pending: "orange",
            succeeded: "green",
            failed: "red",
          };

          return (
            <Tag color={statusMap[status] || "default"}>
              {status.toUpperCase()}
            </Tag>
          );
        },
      },
    ],
    []
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      loading={isLoading}
      dataSource={withdrawals?.data ?? []}
      pagination={false}
      tableLayout="auto"
      rootClassName="tw-custom-scrollbar"
      rowClassName="tw-font-manrope"
      className="tw-font-manrope tw-w-full tw-overflow-x-auto"
      locale={{
        emptyText: isLoading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Fetching Withdrawals"
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No withdrawal records found"
          />
        ),
      }}
    />
  );
};

WithdrawTable.propTypes = {
  isLoading: PropTypes.bool,
  withdrawals: PropTypes.array,
};

export default WithdrawTable;
