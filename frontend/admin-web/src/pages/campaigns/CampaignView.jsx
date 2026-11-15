import axiosInstance from "../../application-wide/axios/axios-instance";
import moment from "moment";
import DocumentPreview from "./DocumentPreview";
import CampaignHistory from "./CampaignHistory";
import CampaignViewSkeleton from "@src/components/Skeletons/CampaignViewSkeleton";
import PlatformDecisionModal from "./PlatformDecisionModal";
import ConfirmationModal from "@src/components/ConfirmationModal/ConfirmationModal";
import useUpdateCampaignStatus from "@src/application-wide/api-gateway-hooks/use-update-campaign-status";
import ReviewModal from "@src/components/ReviewModal/ReviewModal";
import Review from "../brand-profile/Review";
import "./CampaignView.less";

import { useEffect, useMemo, useState } from "react";
import {
  Collapse,
  Flex,
  message,
  notification,
  Popover,
  theme,
  Tooltip,
} from "antd";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { UBUModal, Text as UBUText } from "@src/components";
import { useGetUserQuery } from "@src/store/api/userApi";
import { CaretRightOutlined } from "@ant-design/icons";
import ReviewStatusMessage from "./ReviewStatusMessage";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import CampaignPaymentModal from "@src/components/Campaign/CampaignPayment/CampaignPaymentModal";

import AccountCreationModal from "@src/components/Campaign/CampaignPayment/AccountCreationModal";
import Stepper from "@src/components/Common/Widgets/Stepper/Stepper";
import {
  CampaignStatus,
  connectedAccountStatuses,
  FALLBACK_ERROR_MESSAGE,
} from "@src/utils/constant";

import SuccessModal from "@src/components/Common/Modals/SuccessModal";
import TransferFundsModal from "@src/components/Campaign/CampaignPayment/TransferFundsModal";
import { useConnectedAccount } from "@src/components/Providers/ConnectedAccountProvider";
import AccountCompletionModal from "@src/components/Campaign/CampaignPayment/AccountCompletionModal";
import useNotificationEvents from "@src/application-wide/api-gateway-hooks/use-notification-events";
import useChatEvents from "@src/application-wide/api-gateway-hooks/use-chat-events";
import useCampaignEvents from "@src/application-wide/api-gateway-hooks/use-campaign-events";
import { Button } from "@src/components/Common/Widgets";
import CreateDisputeModal from "@src/components/Campaign/Dispute/CreateDisputeModal";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import { capitalize, getFormattedDate } from "@src/utils/helpers";
import { formattedAmount } from "@src/utils/helpers";

const campaignStatuses = [
  { title: "Pending", key: "pending" },
  { title: "Accepted", key: "accepted" },
  { title: "Rejected", status: "error", key: "rejected" },
  { title: "Payment Held", key: "payment-held" },
  { title: "Contract Signing", key: "contract-signing" },
  { title: "In Progress", key: "in-progress" },
  { title: "Publishing", key: "publishing" },
  { title: "Submitted", key: "submitted" },
  {
    title: "Disputed",
    key: "disputed",
  },
  {
    title: "Funds Transferred",
    key: "funds-transferred",
  },
  {
    title: "Refunded",
    key: "rejected-refunded",
    status: "finish",
  },
  {
    title: "Completed",
    key: "completed",
  },
];

const CampaignView = () => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const {
    isComplete: isAccountCreated,
    status: currentAccountStatus,
    isLoadingConnectedAccountDetails,
    accountStatusMessage,
  } = useConnectedAccount();

  const { id } = useParams(); // Gets the segment ID from the URL

  const [campaignData, setCampaignData] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allowAcceptAndReject, setAllowAcceptAndReject] = useState(true);
  const [currentExhibitId, setCurrentExhibitId] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(null);
  const [isPlatformDecisionModal, setPlatformDecisionModal] = useState(false);
  const [confirmationMethodSelected, setConfirmatioMethod] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [brandAndInfluencerForReview, setBrandAndInfluencerForReview] =
    useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const [isOpenAccountCreationModal, setIsOpenAccountCreationModal] =
    useState(false);

  const [isOpenAccountCompletionModal, setIsOpenAccountCompletionModal] =
    useState(false);

  const [isOpenFundsTransferModal, setIsOpenFundsTransferModal] =
    useState(false);

  const [isOpenCreateDisputeModal, setIsOpenCreateDisputeModal] =
    useState(false);

  const navigate = useNavigate();
  const { updateCampaignStatusTrigger, updatedCampaign } = useCampaignEvents();
  const { pushNotification } = useNotificationEvents();
  const { sendMessage, newChat } = useChatEvents();
  const { loading: isSubmitCampaignLoading, onUpdateCampaignStatus } =
    useUpdateCampaignStatus();

  useEffect(() => {
    if (campaign) {
      setCampaign((prev) => {
        return prev?.id === updatedCampaign.campaign_id
          ? { ...prev, status: updatedCampaign.campaign_status }
          : prev;
      });
    }
  }, [updatedCampaign]);

  const fetchCampaignData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/campaign/${id}`);
      const data = response.data.result?.exhibitDocuments?.[0];
      const separatedValues =
        data?.hashtags.flatMap((item) =>
          item.split(",").map((value) => value.trim())
        ) ?? [];
      if (separatedValues) {
        data.hashtags = separatedValues;
      }

      setAllowAcceptAndReject(response.data.allowAcceptAndReject);
      setCampaignData(data);
      setCampaign(response.data.result);
      setCurrentExhibitId(data.id);
    } catch (error) {
      console.error("Error fetching segment data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchCampaignData();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const submitCampaign = async () => {
    try {
      await onUpdateCampaignStatus(campaign.id, "submitted");
      message.success("Campaign Submitted Successfully!");
      updateCampaignStatusTrigger(campaign.id);
      setConfirmationModalOpen(false);
      fetchCampaignData();
    } catch (error) {
      message.error(`Submission failed: ${error.message}`);
    }
  };

  const completeCampaign = async () => {
    try {
      await onUpdateCampaignStatus(campaign.id, "completed");
      message.success("Campaign Completed Successfully!");
      updateCampaignStatusTrigger(campaign.id);
      fetchCampaignData();
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

  const fetchNewExhibitDocument = async (exhibitId) => {
    setCurrentExhibitId(exhibitId);
    setModalVisible(false);
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/exhibit_document/${exhibitId}`
      );
      const data = response.data;
      const separatedValues =
        data?.hashtags.flatMap((item) =>
          item.split(",").map((value) => value.trim())
        ) ?? [];
      if (separatedValues) {
        () => (data.hashtags = separatedValues);
      }
      setCampaignData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (updatedStatus) => {
    setButtonLoading(updatedStatus);
    try {
      const response = await axiosInstance.patch(
        `campaign/${id}/update_status`,
        { status: updatedStatus }
      );
      message.success("Status Updated Successfully");
      setCampaign(response.data);
      if (response.status === 200 || response.status === 201) {
        updateCampaignStatusTrigger(campaign.id);
        if (updatedStatus == "accepted") {
          sendMessage(
            response.data.influencer.user, //user object of sender
            response.data.brand.user, //user object of reciever
            "Hi! I am interested." //message
          );
          pushNotification(
            user.id,
            campaign.brandId,
            `${user.first_name + " " + user.last_name + " " + updatedStatus}`,
            "ACCEPTED",
            user.type,
            "brand",
            "brand",
            campaign.id
          );
        }

        if (updatedStatus === "rejected") {
          pushNotification(
            user.id,
            campaign.brandId,
            `${user.first_name + " " + user.last_name + " " + updatedStatus}`,
            "REJECTED",
            user.type,
            "brand",
            "brand",
            campaign.id
          );
        }
      }
    } catch (error) {
      if (error && error.response) {
        notification.error({
          message: "Error",
          description: error?.response?.data?.message || FALLBACK_ERROR_MESSAGE,
        });
      } else {
        notification.error({
          message: "Error",
          description: FALLBACK_ERROR_MESSAGE,
        });
      }
    } finally {
      setButtonLoading(null);
    }
  };

  useEffect(() => {
    if (newChat != 0) {
      navigate(`/dashboard/chats/${newChat}/chat-wrapper`);
    }
  }, [newChat, navigate]);
  const handleOpenSuccessModal = (message = "") => {
    setSuccessMessage(message);
    setIsOpenSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setSuccessMessage("");
    setIsOpenSuccessModal(false);
    fetchCampaignData();
  };

  const handlePaymentConfirm = () => {
    setIsOpenPaymentModal(false);
    handleOpenSuccessModal("Your payment has been successfully processed.");
  };

  const handleBack = async () => {
    navigate(`/dashboard/campaigns`);
  };

  const handleCreateAccount = () => {
    if (isAccountCreated) {
      handleStatusChange("accepted");
    } else if (currentAccountStatus === connectedAccountStatuses.IN_ACTIVE) {
      setIsOpenAccountCreationModal(true);
    } else {
      setIsOpenAccountCompletionModal(true);
    }
  };

  const handleOpenFundsTransferModal = () => setIsOpenFundsTransferModal(true);

  const handleCloseFundsTransferModal = () =>
    setIsOpenFundsTransferModal(false);

  const handleOpenCreateDisputeModal = () => setIsOpenCreateDisputeModal(true);

  const handleCloseCreateDisputeModal = () =>
    setIsOpenCreateDisputeModal(false);

  const handleConfirmDisputeCreated = () => {
    handleCloseCreateDisputeModal();
    fetchCampaignData();
  };

  const handleConfirmFundsReleased = (message) => {
    handleCloseFundsTransferModal();
    handleOpenSuccessModal(message);
  };

  const filterByReviewerType = (reviews, type) => {
    return reviews.filter((review) => review.reviewer_type !== type);
  };

  const amount = campaign?.exhibitDocuments?.[0]?.totalCompensation;

  const allDisputes = campaign?.campaignDisputes?.slice()?.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA; // Descending order (b - a)
  });

  const dispute = allDisputes?.[0];

  const isResolvedDispute = dispute?.status === "resolved";
  const raised_by = dispute?.raised_by?.id;
  const isDisputedByYou = raised_by === user?.id && !isResolvedDispute;

  const isUpdatingDispute =
    Array.isArray(allDisputes) && allDisputes?.length > 0 && !isResolvedDispute;

  const isDisputeCreatedAndUpdated =
    !!dispute?.brand_concerns?.trim() &&
    !!dispute?.influencer_concerns?.trim() &&
    !isResolvedDispute;

  const { statuses, activeStep } = useMemo(() => {
    let statuses = [...campaignStatuses];

    if (campaign?.status !== CampaignStatus.REJECTED) {
      statuses = statuses.filter(
        (status) => status.key !== CampaignStatus.REJECTED
      );
    } else {
      statuses = statuses.filter(
        (status) => status.key !== CampaignStatus.ACCEPTED
      );
    }

    const hasDisputeAndStatusEqualAfterDispute =
      allDisputes?.length > 0 &&
      [
        CampaignStatus.DISPUTED,
        CampaignStatus.FUNDS_TRANSFERRED,
        CampaignStatus.REFUNDED,
        CampaignStatus.COMPLETED,
      ].includes(campaign?.status);

    if (
      campaign?.status !== CampaignStatus.DISPUTED &&
      !hasDisputeAndStatusEqualAfterDispute
    ) {
      statuses = statuses.filter(
        (status) => status.key !== CampaignStatus.DISPUTED
      );
    }

    const index = statuses?.findIndex(
      (status) => status.key === campaign?.status
    );

    if (index !== -1 && statuses[index].status !== "error") {
      const isCompleted = statuses[index].key === CampaignStatus.COMPLETED;

      if (isCompleted) statuses[index]["status"] = "finish";
    }

    if (campaign?.status !== CampaignStatus.REFUNDED) {
      statuses = statuses.filter(
        (status) => status.key !== CampaignStatus.REFUNDED
      );
    } else {
      statuses = statuses.filter(
        (status) =>
          ![
            CampaignStatus.FUNDS_TRANSFERRED,
            CampaignStatus.COMPLETED,
          ].includes(status?.key)
      );
    }

    return { statuses, activeStep: index || 0 };
  }, [campaign, allDisputes]);

  const isLoading = loading || isLoadingConnectedAccountDetails;

  const getItems = useMemo(
    () => (allDisputes, panelStyle) =>
      allDisputes?.map((dispute) => {
        return {
          key: dispute?.id?.toString(),
          label: (
            <Paragraph level={6} className="tw-font-semibold">
              Dispute #{dispute?.id} - {dispute?.status}
            </Paragraph>
          ),
          children: (
            <div className="tw-flex tw-justify-between tw-items-center">
              <div>
                <p>
                  <strong>
                    {user?.is_brand ? "Your Concerns" : "Business Concerns"}:
                  </strong>{" "}
                  {dispute?.brand_concerns}
                </p>
                <p>
                  <strong>
                    {user?.is_influencer ? "Your Concerns" : "Creator Concerns"}
                    :
                  </strong>{" "}
                  {dispute?.influencer_concerns}
                </p>
                <p>
                  <strong>Admin Remarks:</strong> {dispute?.admin_remarks}
                </p>
              </div>

              <div>
                <p>
                  <strong>Action Performed:</strong>{" "}
                  {capitalize(dispute?.resolution_action?.replaceAll("_", " "))}
                </p>
                <p className="tw-text-sm tw-text-gray-500">
                  Raised By: {dispute?.raised_by?.first_name}{" "}
                  {dispute?.raised_by?.last_name}
                </p>
                <p className="tw-text-sm tw-text-gray-400">
                  Created At:{" "}
                  {getFormattedDate(
                    dispute?.created_at ?? "",
                    "MMMM D, YYYY h:mm A"
                  )}
                </p>
              </div>
            </div>
          ),
          style: panelStyle,
        };
      }),
    [user]
  );

  const { token } = theme.useToken();

  const panelStyle = useMemo(
    () => ({
      marginBottom: 8,
      background: "#f9f9fc",
      borderRadius: token.borderRadiusLG,
      border: "none",
    }),
    [token]
  );

  const campaignAcceptanceDate =
    campaign?.exhibitDocuments?.[0]?.campaignAcceptanceDeadline;
  const isCampaignAcceptanceDeadlinePassed =
    campaignAcceptanceDate && new Date(campaignAcceptanceDate) < new Date();

  const disableAcceptButton =
    !allowAcceptAndReject || isCampaignAcceptanceDeadlinePassed;

  return (
    <Flex vertical gap={"1.5rem"} className="campaign-view-container">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          {
            title: <NavLink to={"/dashboard/campaigns"}>Campaigns</NavLink>,
          },
          { title: "View" },
        ]}
      />
      {isOpenPaymentModal && (
        <CampaignPaymentModal
          isOpen={isOpenPaymentModal}
          amount={amount}
          campaignId={campaign?.id}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setIsOpenPaymentModal(false)}
        />
      )}

      {isOpenSuccessModal && (
        <SuccessModal
          message={successMessage}
          isOpen={isOpenSuccessModal}
          onCancel={handleCloseSuccessModal}
        />
      )}

      {isOpenAccountCreationModal && (
        <AccountCreationModal
          isOpen={isOpenAccountCreationModal}
          onCancel={() => setIsOpenAccountCreationModal(false)}
          onConfirm={() => setIsOpenAccountCreationModal(false)}
        />
      )}

      {isOpenAccountCompletionModal && (
        <AccountCompletionModal
          isOpen={isOpenAccountCompletionModal}
          message={accountStatusMessage}
          onCancel={() => setIsOpenAccountCompletionModal(false)}
          onConfirm={() => setIsOpenAccountCompletionModal(false)}
        />
      )}

      {isOpenFundsTransferModal && (
        <TransferFundsModal
          isOpen={isOpenFundsTransferModal}
          campaignId={campaign?.id}
          onCancel={handleCloseFundsTransferModal}
          onConfirm={handleConfirmFundsReleased}
        />
      )}

      {isOpenCreateDisputeModal && (
        <CreateDisputeModal
          isOpen={true}
          campaignId={campaign?.id}
          campaignDisputes={allDisputes}
          onCancel={handleCloseCreateDisputeModal}
          onConfirm={handleConfirmDisputeCreated}
        />
      )}

      {isLoading ? (
        <CampaignViewSkeleton />
      ) : (
        <>
          <div>
            <Stepper
              size="small"
              className="tw-overflow-auto tw-py-3  tw-custom-scrollbar"
              activeStep={activeStep}
              items={statuses}
            />
          </div>
          <div className="campaign-view-header  tw-flex tw-items-center tw-justify-between tw-gap-4 tw-flex-wrap">
            <Heading level={3}>Campaign</Heading>
            <div className="campaign-buttons tw-flex-wrap">
              {user &&
                user.type === "influencer" &&
                campaign?.status === "publishing" && (
                  <Button
                    variant="outlined"
                    type="primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      setConfirmationMessage(
                        "Are you sure you want submit your campaign work?"
                      );
                      setConfirmatioMethod("submitCampaign");
                      setConfirmationModalOpen(true);
                    }}
                  >
                    Submit
                  </Button>
                )}
              {user &&
                user.type === "brand" &&
                campaign?.status === CampaignStatus.FUNDS_TRANSFERRED && (
                  <Button
                    variant="outlined"
                    type="primary"
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
                    }}
                  >
                    Complete
                  </Button>
                )}

              {user &&
                user.type === "brand" &&
                campaign?.status === CampaignStatus.SUBMITTED && (
                  <Button
                    variant="outlined"
                    type="primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenFundsTransferModal();
                    }}
                  >
                    Transfer Funds
                  </Button>
                )}

              {user &&
                user.type === "brand" &&
                (campaign?.status === "publishing" ||
                  campaign?.status === "submitted" ||
                  campaign?.status === "completed") && (
                  <Button
                    variant="outlined"
                    type="primary"
                    // className="view-campaign-work-button"
                    // shape="circle"
                    // icon={
                    //   <InstagramOutlined
                    //   // style={{ color: "white", fontSize: "20px" }}
                    //   />
                    // }
                    // style={{
                    //   backgroundColor: "black",
                    //   border: "1px solid black",
                    //   color: "white",
                    // }}
                    onClick={(event) => {
                      event.stopPropagation();
                      window.open(
                        `https://instagram.com/ubu_platform0034`,
                        "_blank"
                      );
                    }}
                  >
                    View Campaign Work
                  </Button>
                )}
              {((user &&
                user?.is_brand &&
                campaign?.status === CampaignStatus.PAYMENT_HELD) ||
                (user?.is_influencer &&
                  campaign.status === "contract-signing")) && (
                <Button
                  // className="sign-contract-button"
                  variant="outlined"
                  type="primary"
                  // icon={
                  //   <SignatureOutlined
                  //     style={{ color: "white", fontSize: "20px" }}
                  //   />
                  // }
                  // style={{
                  //   backgroundColor: "black",
                  //   border: "1px solid black",
                  //   color: "white",
                  // }}

                  onClick={() => {
                    navigate(`/dashboard/campaigns/${id}/review-contract`);
                  }}
                >
                  Sign Contract
                </Button>
              )}

              {user &&
                user.type == "influencer" &&
                (campaign && campaign?.status == CampaignStatus.PENDING ? (
                  <div className="campaign-buttons">
                    <Popover
                      content={
                        disableAcceptButton && (
                          <ReviewStatusMessage
                            isDeadlinePassed={
                              isCampaignAcceptanceDeadlinePassed
                            }
                          />
                        )
                      }
                      title={disableAcceptButton && "Cannot Accept Campaign"}
                      placement="bottom"
                    >
                      <Button
                        variant="outlined"
                        type="primary"
                        disabled={disableAcceptButton}
                        loading={buttonLoading === "accepted"}
                        onClick={handleCreateAccount}
                      >
                        Accept
                      </Button>
                    </Popover>
                    <Button
                      variant="outlined"
                      color="danger"
                      loading={buttonLoading === "rejected"}
                      onClick={() => handleStatusChange("rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                ) : campaign && campaign?.status == "contract-signing" ? (
                  // This button will take influencer to sign the contract, it will not take user to handleStatusChange
                  // <Button className="sign-campaign-button" onClick={() => navigate('sign-contract')}>Sign Contract</Button>
                  <div></div>
                ) : (
                  campaign &&
                  (campaign?.status == "in-progress" ||
                    campaign?.status == "publishing") && (
                    <Button
                      variant="outlined"
                      type="primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPlatformDecisionModal(true);
                      }}
                    >
                      Publish
                    </Button>
                  )
                ))}
              <Button
                variant="outlined"
                type="primary"
                onClick={() => setModalVisible(true)}
              >
                View History
              </Button>

              {user?.is_brand &&
                campaign?.status === CampaignStatus.ACCEPTED && (
                  <Button
                    variant="outlined"
                    type="primary"
                    onClick={() => setIsOpenPaymentModal(true)}
                  >
                    Initiate Payment
                  </Button>
                )}

              {!isDisputedByYou &&
                !isDisputeCreatedAndUpdated &&
                (campaign?.status === CampaignStatus.SUBMITTED ||
                  campaign?.status === CampaignStatus.DISPUTED) && (
                  <Button
                    variant="outlined"
                    type="primary"
                    onClick={handleOpenCreateDisputeModal}
                  >
                    {isUpdatingDispute ? "Update" : "Create"} Dispute
                  </Button>
                )}
            </div>
          </div>
          {allDisputes?.length > 0 && (
            <div className="tw-space-y-4">
              <Heading level={5}>Disputes</Heading>
              <Collapse
                bordered={false}
                defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                style={{
                  background: token.colorBgContainer,
                }}
                items={getItems(allDisputes, panelStyle)}
              />
            </div>
          )}
          <div
            // gap={"2rem"}
            // justify="space-between"
            className=" tw-grid lg:tw-grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] tw-gap-10"
          >
            <div className="tw-w-full tw-space-y-4">
              <div className="campaign-section">
                <div className="section-header">Hashtags</div>
                <div className="section-content">
                  {campaignData?.hashtags?.map((hashtag, index) => (
                    <div key={index} className="content-box">
                      <div className="content-item">{hashtag}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="campaign-section">
                <div className="section-header">Draft Submission Dates:</div>
                <div className="section-content">
                  <div className="content-date">
                    {moment(campaignData?.draftSubmissionDate).format(
                      "MM/DD/YYYY"
                    ) ?? "MM/DD/YYYY"}
                  </div>
                </div>
              </div>
              <div className="campaign-section">
                <div className="section-header">Publication Dates:</div>
                <div className="section-content">
                  <div className="content-date">
                    {moment(campaignData?.publicationDates).format(
                      "MM/DD/YYYY"
                    ) ?? "MM/DD/YYYY"}
                  </div>
                </div>
              </div>

              <div className="campaign-section">
                <div className="section-header">Campaign Acceptance Date:</div>
                <div className="section-content">
                  <div className="content-date">
                    {moment(campaignData?.campaignAcceptanceDeadline).format(
                      "MM/DD/YYYY"
                    ) ?? "MM/DD/YYYY"}
                  </div>
                </div>
              </div>

              <div className="campaign-section">
                <div className="section-header">Total Compensation:</div>
                <div className="section-content">
                  <div className="content-date">
                    {formattedAmount(campaignData?.totalCompensation)}
                  </div>
                </div>
              </div>

              <div className="campaign-section">
                <div className="section-header">No of Deliverables:</div>
                <div className="section-content">
                  <div className="content-date">
                    <div className="description-content">
                      {campaignData?.numberOfDeliverables?.length > 0 ? (
                        <ul>
                          {campaignData.numberOfDeliverables.map(
                            (deliverable, index) => (
                              <li key={index}>
                                <span>{deliverable.type}</span>:{" "}
                                {deliverable.count}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p>No deliverables available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Flex
                vertical
                gap={".75rem"}
                className="description-container tw-break-all"
              >
                <div className="description-header">
                  <div className="header-text">
                    {campaignData?.advertisemntUrl
                      ? "Advertisemnt Url"
                      : "Product"}
                    :
                  </div>
                </div>
                <div className="description-content">
                  {campaignData?.product
                    ? campaignData?.product?.name
                    : campaignData?.advertisemntUrl}
                </div>
              </Flex>

              <div className="campaign-section">
                <div className="section-header">Brand Guidelines:</div>
                <div className="section-content">
                  <div className="content-date">
                    {campaignData?.brandGuidelines ?? "https://www.example.com"}
                  </div>
                </div>
              </div>
            </div>

            <Flex vertical gap={".75rem"} className="description-container">
              <div className="description-header">
                <div className="header-text">Description:</div>
              </div>
              <div className="description-content">
                {campaignData?.description}
              </div>
            </Flex>
          </div>

          <div className=" tw-grid lg:tw-grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] tw-gap-4">
            <Flex vertical gap={"1rem"} className="details-column">
              <UBUText className={"fs-20 fw-600"}>Revisions</UBUText>

              <div className="campaign-section">
                <div className="section-header">No of Revisions:</div>
                <div className="section-content">
                  <div className="content-date">
                    {campaignData?.numberOfRevisions ?? "N/A"}
                  </div>
                </div>
              </div>

              <div className="campaign-section">
                <div className="section-header">Revision Turnaround Time:</div>
                <div className="section-content">
                  <div className="content-date">
                    {campaignData?.turnAroundTime ?? "MM/DD/YYYY"}
                  </div>
                </div>
              </div>

              <div className="campaign-section additional-req-section">
                <div className="section-header">Additional Requirements:</div>
                <div className="section-content additional-content">
                  <div className="content-date">
                    {campaignData?.specialConditions ?? "None"}
                  </div>
                </div>
              </div>
            </Flex>

            <Flex
              vertical
              gap={"1rem"}
              className="description-container special-condition-campaign"
            >
              <UBUText className={"fs-20 fw-600"}>Advertisement Stuff</UBUText>
              <div className="description-header">
                <div className="header-text">Special Conditions:</div>
              </div>
              <div className="description-content">
                {campaignData?.specialConditions}
              </div>
            </Flex>
          </div>

          {/* Documents Section */}

          <Flex gap={"2rem"} className="additional-details-row">
            <Flex vertical gap={"1rem"} className="details-column">
              <div className="document-container">
                <div className="header-title-wrapper">
                  <UBUText className={"fs-20 fw-600"}>Documents</UBUText>
                </div>
                <DocumentPreview docUrl={campaignData?.documentUrl} />
              </div>
            </Flex>
            {campaign?.status == "completed" &&
            campaign?.reviews?.length == 2 ? (
              <Flex
                vertical
                gap={"1rem"}
                className="description-container special-condition-campaign"
              >
                <UBUText className={"fs-20 fw-600"}>
                  {user?.is_brand ? "Influencer" : "Brand"} Review
                </UBUText>
                <Review
                  allowAnonymityCheck={false}
                  allReviews={filterByReviewerType(
                    campaign.reviews,
                    user?.is_brand ? "brand" : "influencer"
                  )}
                />
              </Flex>
            ) : (
              <></>
            )}

            {campaign?.status == "completed" &&
            campaign?.reviews?.length == 1 &&
            campaign?.reviews[0]?.reviewerInfluencer?.user.id == user.id ? (
              <Flex
                vertical
                gap={"1rem"}
                className="description-container special-condition-campaign"
              >
                <UBUText className={"fs-20 fw-600"}>
                  {user?.is_brand ? "Influencer" : "Brand"} Review
                </UBUText>
                <div className="section-header">Review is pending</div>
              </Flex>
            ) : (
              <></>
            )}

            {campaign?.status == "completed" &&
            campaign?.reviews?.length == 1 &&
            campaign?.reviews[0]?.reviewerBrand?.user.id == user.id ? (
              <Flex
                vertical
                gap={"1rem"}
                className="description-container special-condition-campaign"
              >
                <UBUText className={"fs-20 fw-600"}>
                  {user?.is_brand ? "Influencer" : "Brand"} Review
                </UBUText>
                <div className="section-header">Review is pending</div>
              </Flex>
            ) : (
              <></>
            )}
          </Flex>

          <UBUModal
            title="Campaign History"
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            width="70%"
            footer={[]}
          >
            <CampaignHistory
              campaignId={campaign?.id}
              currentExhibitId={currentExhibitId}
              fetchNewExhibitDocument={fetchNewExhibitDocument}
            />
          </UBUModal>
        </>
      )}
      {isPlatformDecisionModal && (
        <PlatformDecisionModal
          onClose={() => setPlatformDecisionModal(false)}
          campaign={campaign}
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
        sideEffect={() => completeCampaign()}
        prioritizeSideEffect
      />
    </Flex>

    // </div>
  );
};

export default CampaignView;
