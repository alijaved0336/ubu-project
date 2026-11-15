import { useMemo } from "react";
import cn from "@src/cn";
import Table from "@src/components/Common/Table/Table";
import { Paragraph } from "@src/components/Common/Typography";
import Status from "@src/components/Common/Typography/Status";
import { capitalize, getFormattedDate } from "@src/utils/helpers";
import { Empty, Tooltip } from "antd";
import PropTypes from "prop-types";
import { Button } from "@src/components/Common/Widgets";
import BrandIcon from "@src/assets/icons/BrandIcon";
import InfluencerIcon from "@src/assets/icons/InfluencerIcon";

const DisputesTable = ({ disputes, isLoading, onOpenDisputeResolveModal }) => {
  const columns = useMemo(
    () => [
      {
        title: "Campaign ID",
        dataIndex: "campaign",
        key: "campaign",
        render: (campaign) => {
          return campaign?.id;
        },
      },
      {
        title: "Raised By",
        dataIndex: "raised_by",
        key: "raised_by",
        render: (raised_by) => {
          return (
            <Tooltip
              className="tw-cursor-pointer"
              title={raised_by?.is_brand ? "Business" : "Creator"}
            >
              <div className="tw-flex tw-items-center tw-gap-2">
                {raised_by?.is_brand ? (
                  <BrandIcon width="24" height="24" />
                ) : (
                  <InfluencerIcon width="24" height="24" />
                )}
                <span>
                  {raised_by?.first_name} {raised_by?.last_name}
                </span>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: "Against",
        dataIndex: "against_by",
        key: "against_by",
        render: (against_by) => {
          return (
            <Tooltip
              className="tw-cursor-pointer"
              title={against_by?.is_brand ? "Business" : "Creator"}
            >
              <div className="tw-flex tw-items-center tw-gap-2">
                {against_by?.is_brand ? (
                  <BrandIcon width="24" height="24" />
                ) : (
                  <InfluencerIcon width="24" height="24" />
                )}

                <span>
                  {against_by?.first_name} {against_by?.last_name}
                </span>
              </div>
            </Tooltip>
          );
        },
      },

      {
        title: "Business Remarks",
        dataIndex: "brand_concerns",
        key: "brand_concerns",
        width: 250,
      },
      {
        title: "Refund Requested",
        dataIndex: "is_refund_requested",
        key: "is_refund_requested",
        // width: 250,
        render: (is_refund_requested) => {
          return (
            <Paragraph
              className={cn("tw-font-manrope tw-text-sm", {
                "tw-text-green-500": is_refund_requested,
                "tw-text-red-500": !is_refund_requested,
              })}
            >
              {is_refund_requested ? "Yes" : "No"}
            </Paragraph>
          );
        },
      },
      {
        title: "Creator Remarks",
        dataIndex: "influencer_concerns",
        key: "influencer_concerns",
        width: 250,
      },
      {
        title: "Admin Remarks",
        dataIndex: "admin_remarks",
        key: "admin_remarks",
        width: 250,
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
        title: "Action Performed",
        dataIndex: "resolution_action",
        key: "resolution_action",
        render: (resolution_action, dispute) => {
          return capitalize(resolution_action?.replaceAll("_", " "));
        },
      },

      {
        title: "Created At",
        dataIndex: "created_at",
        key: "created_at",
        render: (createdAt) => (
          <Tooltip title={getFormattedDate(createdAt, "h:mm A")}>
            {getFormattedDate(createdAt, "MMMM D, YYYY")}
          </Tooltip>
        ),
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        width: 200,
        render: (_, dispute) => {
          return (
            <div className="tw-flex tw-justify-center ">
              <Button
                className="tw-mx-auto tw-w-auto"
                variant="outlined"
                disabled={dispute?.status === "resolved"}
                onClick={() => onOpenDisputeResolveModal(dispute)}
              >
                Resolve
              </Button>
            </div>
          );
        },
      },
    ],
    [onOpenDisputeResolveModal]
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      loading={isLoading}
      dataSource={disputes}
      pagination={false}
      tableLayout="auto"
      scroll={{ x: "max-content" }} // Allow horizontal scrolling
      rowClassName="tw-font-manrope"
      className="tw-font-manrope tw-w-full tw-overflow-x-auto "
      locale={{
        emptyText: isLoading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Fetching Disputes"
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No dispute found"
          />
        ),
      }}
    />
  );
};

DisputesTable.propTypes = {
  isLoading: PropTypes.bool,
  disputes: PropTypes.array,
  onOpenDisputeResolveModal: PropTypes.func,
};

export default DisputesTable;
