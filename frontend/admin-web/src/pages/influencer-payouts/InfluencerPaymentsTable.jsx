import React, { useMemo } from "react";
import Table from "@src/components/Common/Table/Table";

import { formattedAmount, getFormattedDate } from "@src/utils/helpers";
import { Empty } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const InfluencerPaymentsTable = ({ isLoading, payments }) => {
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        title: "User ID",
        dataIndex: "user_id",
        key: "user_id",
      },

      {
        title: "First Name",
        dataIndex: "first_name",
        key: "first_name",
        width: 250,
      },
      {
        title: "Last Name",
        dataIndex: "last_name",
        key: "last_name",
      },
      {
        title: "Total Pending Revenue",
        dataIndex: "total_pending_revenue",
        key: "total_pending_revenue",
        render: (total_pending_revenue) => {
          return formattedAmount(total_pending_revenue);
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
      scroll={{ x: "max-content" }} // Allow horizontal scrolling
      rootClassName="tw-font-manrope"
      rowClassName="tw-cursor-pointer tw-font-manrope"
      className="tw-font-manrope tw-w-full tw-overflow-x-auto"
      onRow={(influencer) => ({
        onClick: () =>
          navigate(`/dashboard/inf-analytics/${influencer?.user_id}`), // Click event on row
      })}
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

InfluencerPaymentsTable.propTypes = {
  isLoading: PropTypes.bool,
  payments: PropTypes.array,
};

export default InfluencerPaymentsTable;
