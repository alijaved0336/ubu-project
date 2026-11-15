import PropTypes from "prop-types";
import titleize from "titleize";
import ReviewModal from "@src/components/ReviewModal/ReviewModal";
import PlatformDecisionModal from "./PlatformDecisionModal";
import ConfirmationModal from "@src/components/ConfirmationModal/ConfirmationModal";
import useUpdateCampaignStatus from "@src/application-wide/api-gateway-hooks/use-update-campaign-status";

import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Empty, message, Tooltip } from "antd";
import {
  SignatureOutlined,
  CheckCircleOutlined,
  InstagramOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useGetUserQuery } from "@src/store/api/userApi";
import { CampaignStatus } from "@src/utils/constant";
import useCampaignEvents from "@src/application-wide/api-gateway-hooks/use-campaign-events";
import Status from "@src/components/Common/Typography/Status";
import Table from "@src/components/Common/Table/Table";
import { isEmpty } from "lodash";
import { formattedAmount } from "@src/utils/helpers";
import { formattedDate } from "@src/utils/dateFormat";

const CampaignTable = ({
  fetchCampaigns,
  campaigns,
  setCampaigns,
  loading,
}) => {
  const { updatedCampaign, updateCampaignStatusTrigger } = useCampaignEvents();
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [brandAndInfluencerForReview, setBrandAndInfluencerForReview] =
    useState(null);
  const navigate = useNavigate();
  const [isPlatformDecisionModal, setPlatformDecisionModal] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMethodSelected, setConfirmatioMethod] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const { loading: isSubmitCampaignLoading, onUpdateCampaignStatus } =
    useUpdateCampaignStatus();
  const [selectedCampaign, setSelectedCampaign] = useState(false);

  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const allowReview = useCallback(
    (campaign) => {
      if (campaign?.reviews.length == 2 || !user || campaign.status !== "completed")
        return false;
      const hasGivenReview = campaign.reviews.some((review) => {
        if (user.is_brand) {
          return review.reviewerBrand?.user?.id === user.id;
        } else {
          return review.reviewerInfluencer?.user?.id === user.id;
        }
      });
      return !hasGivenReview;
    },
    [user]
  );

  const actionClick = useCallback(
    (event, navigationPath) => {
      event.stopPropagation();
      navigate(navigationPath);
    },
    [navigate]
  );

  const submitCampaign = async () => {
    try {
      await onUpdateCampaignStatus(selectedCampaign.id, "submitted");
      message.success("Campaign Submitted Successfully!");
      setConfirmationModalOpen(false);
      updateCampaignStatusTrigger(selectedCampaign.id);
      fetchCampaigns();
    } catch (error) {
      message.error(`Submission failed: ${error.message}`);
    }
  };

  useEffect(() => {
    if (updatedCampaign) {
      setCampaigns((prevCampaign) =>
        prevCampaign.map((c) =>
          c.id === updatedCampaign.campaign_id
            ? { ...c, status: updatedCampaign.campaign_status }
            : c
        )
      );
    }
  }, [updatedCampaign, setCampaigns]);

  const completeCampaign = async () => {
    try {
      await onUpdateCampaignStatus(selectedCampaign.id, "completed");
      message.success("Campaign Completed Successfully!");
      updateCampaignStatusTrigger(selectedCampaign.id);
      fetchCampaigns();
    } catch (error) {
      message.error(`Completion Failed: ${error.message}`);
    }
  };

  const handleConfirm = () => {
    if (confirmationMethodSelected === "submitCampaign") {
      submitCampaign();
    } else if (confirmationMethodSelected === "completeCampaign") {
      setConfirmationModalOpen(false);
      setIsReviewModalVisible(true);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Campaign Name",
        dataIndex: "campaignName",
        key: "campaignName",
        render: (campaignName) => (campaignName ? campaignName : "N/A"),
      },

      {
        title: "Creator",
        dataIndex: "influencer",
        key: "influencer",
        render: (influencer) =>
          `${influencer?.user?.first_name} ${influencer?.user?.last_name}`,
        hidden: isEmpty(user) || user?.type === "influencer",
      },
      {
        title: "Business",
        dataIndex: "brand",
        key: "brand",
        render: (brand) => brand?.brand_name,
        hidden: isEmpty(user) || user?.type === "brand",
      },
      {
        title: "Total Compensation",
        dataIndex: "exhibitDocuments",
        key: "exhibitDocuments",
        render: (exhibitDocuments) =>
          formattedAmount(exhibitDocuments?.[0]?.totalCompensation),
      },

      {
        title: "Acceptance Deadline",
        dataIndex: "exhibitDocuments",
        key: "exhibitDocuments",
        render: (exhibitDocuments) =>
          formattedDate(exhibitDocuments?.[0]?.campaignAcceptanceDeadline),
      },

      {
        title: "Publication Deadline",
        dataIndex: "exhibitDocuments",
        key: "exhibitDocuments",
        render: (exhibitDocuments) =>
          formattedDate(exhibitDocuments?.[0]?.publicationDates),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const finalStatus =
            status === "rejected-refunded" ? "refunded" : status;
          return <Status text={finalStatus} />;
        },
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (_, campaign) => {
          return (
            <div className="tw-flex tw-items-center tw-gap-3 tw-cursor-pointer tw-text-base">
              <Tooltip title="View">
                <i
                  className="fas fa-eye"
                  onClick={(event) => {
                    actionClick(event, `/dashboard/campaigns/${campaign.id}`);
                  }}
                />
              </Tooltip>

              {user?.is_brand && campaign.status === CampaignStatus.PENDING && (
                <Tooltip title="Edit">
                  <i
                    className="fas fa-edit"
                    onClick={(event) => {
                      actionClick(
                        event,
                        `/dashboard/campaigns/edit/${campaign.id}`
                      );
                    }}
                  />
                </Tooltip>
              )}

              {(user?.is_brand &&
                campaign?.status === CampaignStatus.PAYMENT_HELD) ||
              (user?.is_influencer &&
                campaign?.status === CampaignStatus.CONTRACT_SIGNING) ? (
                <Tooltip title="Sign Contract">
                  <SignatureOutlined
                    style={{ fontSize: "20px" }}
                    onClick={(event) => {
                      actionClick(
                        event,
                        `/dashboard/campaigns/${campaign.id}/review-contract`
                      );
                    }}
                  />
                </Tooltip>
              ) : null}

              {user?.type === "influencer" &&
                (campaign.status === CampaignStatus.IN_PROGRESS ||
                  campaign.status === CampaignStatus.PUBLISHING) && (
                  <Tooltip title="Publish">
                    <i
                      className="fas fa-paper-plane"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPlatformDecisionModal(true);
                        setSelectedCampaign(campaign);
                      }}
                    />
                  </Tooltip>
                )}

              {user?.type === "influencer" &&
                campaign.status === CampaignStatus.PUBLISHING && (
                  <Tooltip title="Submit">
                    <CheckCircleOutlined
                      style={{ fontSize: "20px" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setConfirmationMessage(
                          "Are you sure you want submit your campaign work?"
                        );
                        setConfirmatioMethod("submitCampaign");
                        setConfirmationModalOpen(true);
                        setSelectedCampaign(campaign);
                      }}
                    />
                  </Tooltip>
                )}
              {allowReview(campaign) && (
                <Tooltip title="Review">
                  <i
                    className="far fa-star fa-regular"
                    onClick={(event) => {
                      event.stopPropagation();
                      setBrandAndInfluencerForReview({
                        brand: campaign["brand"],
                        influencer: campaign["influencer"],
                        campaign: campaign,
                      });
                      setIsReviewModalVisible(true);
                    }}
                  />
                </Tooltip>
              )}

              {user &&
                user?.type === "brand" &&
                [
                  CampaignStatus.PUBLISHING,
                  CampaignStatus.SUBMITTED,
                  CampaignStatus.FUNDS_TRANSFERRED,
                  CampaignStatus.COMPLETED,
                  CampaignStatus.DISPUTED,
                ].includes(campaign?.status) && (
                  <Tooltip title="View Campaign Work">
                    <InstagramOutlined
                      style={{ fontSize: "20px" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        window.open(
                          `https://instagram.com/${
                            campaign?.influencer?.instagram_handle ||
                            "ubu_platform0034"
                          }`,
                          "_blank"
                        );
                      }}
                    />
                  </Tooltip>
                )}

              {user?.type === "brand" &&
                campaign?.status === CampaignStatus.FUNDS_TRANSFERRED && (
                  <Tooltip title="Mark Complete">
                    <CheckCircleFilled
                      style={{
                        fontSize: "20px",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setBrandAndInfluencerForReview({
                          brand: campaign["brand"],
                          influencer: campaign["influencer"],
                          campaign: campaign,
                        });
                        setConfirmatioMethod("completeCampaign");
                        setConfirmationMessage(
                          "Are you sure you want to mark your campaign completed?"
                        );
                        setConfirmationModalOpen(true);
                        setSelectedCampaign(campaign);
                      }}
                    />
                  </Tooltip>
                )}
            </div>
          );
        },
      },
    ],
    [user, actionClick, allowReview]
  );

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={campaigns}
        pagination={false}
        tableLayout="auto"
        scroll={{ x: "max-content" }}
        rowClassName="tw-font-manrope tw-cursor-pointer"
        className="tw-font-manrope tw-w-full tw-overflow-x-auto"
        onRow={(campaign) => ({
          onClick: () => navigate(`/dashboard/campaigns/${campaign.id}`), // Click event on row
        })}
        locale={{
          emptyText: loading ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Fetching Campaigns"
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No campaign found"
            />
          ),
        }}
      />
      {isPlatformDecisionModal && (
        <PlatformDecisionModal
          onClose={() => setPlatformDecisionModal(false)}
          campaign={selectedCampaign}
        />
      )}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          onClose={() => setConfirmationModalOpen(false)}
          message={confirmationMessage}
          onConfirm={handleConfirm}
          isConfirmLoading={isSubmitCampaignLoading}
        />
      )}
      <ReviewModal
        setIsReviewModalVisible={setIsReviewModalVisible}
        isReviewModalVisible={isReviewModalVisible}
        brand={brandAndInfluencerForReview?.brand}
        influencer={brandAndInfluencerForReview?.influencer}
        campaign={brandAndInfluencerForReview?.campaign}
        sideEffect={() =>
          (user?.type == "brand" && brandAndInfluencerForReview?.campaign.status == CampaignStatus.FUNDS_TRANSFERRED) ? completeCampaign() : fetchCampaigns()
        }
        prioritizeSideEffect={user?.type == "brand" && brandAndInfluencerForReview?.campaign.status == CampaignStatus.FUNDS_TRANSFERRED}
      />
    </>
  );
};

CampaignTable.propTypes = {
  fetchCampaigns: PropTypes.func,
  campaigns: PropTypes.array,
  setCampaigns: PropTypes.array,
  loading: PropTypes.bool,
};

export default CampaignTable;
