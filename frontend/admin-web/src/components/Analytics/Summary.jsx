import PropTypes from "prop-types";
import { Card, List, Typography } from "antd";

import { useMemo } from "react";
import cn from "@src/cn";

const Summary = ({ data, isLoading, className }) => {
  const summary = useMemo(
    () => [
      { label: "Total Item Shipped", value: data?.total_items_shipped || 0 },
      { label: "Total Orders Items", value: data?.total_items_ordered || 0 },
      { label: "Total Sales", value: data?.total_sales || 0 },
      { label: "Clicks", value: data?.total_clicks || 0 },
      { label: "Month / Year", value: data?.month_year || "N/A" },
      {
        label: "Total Sales",
        value: data?.total_ad_fees
          ? data?.total_ad_fees ?? 0
          : data && data?.total_sales
          ? data?.total_sales ?? 0
          : 0,
      },
    ],
    [data]
  );
  return (
    <Card
      title={<span className="tw-font-semibold">Summary of this Month</span>}
      className={cn(
        "tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-200 tw-h-full tw-w-full",
        className
      )}
    >
      <List
        itemLayout="horizontal"
        dataSource={summary}
        split={false}
        rootClassName="tw-font-manrope"
        loading={isLoading}
        renderItem={({ label, value }) => (
          <List.Item className="tw-py-2 tw-border-b tw-border-gray-100 last:tw-border-b-0">
            <Typography.Text className="tw-text-gray-600">
              {label}
            </Typography.Text>
            <div className="tw-font-medium">{value}</div>
          </List.Item>
        )}
      />
    </Card>
  );
};

Summary.propTypes = {
  data: PropTypes.Object,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

export default Summary;
