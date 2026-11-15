import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import "./ReviewContract.less";
import axiosInstance from "../../application-wide/axios/axios-instance";
import { Skeleton, Flex, message, Spin } from "antd";
import SignatureComponent from "../segments/SignatureComponent";
import { CustomButton, Text } from "@src/components";
import { useGetUserQuery } from "@src/store/api/userApi";
import { useCookies } from "react-cookie";
import { useGetUser } from "@src/application-wide/api-gateway-hooks";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import SuccessModal from "@src/components/SuccessModal/SuccessModal";
import useNotificationEvents from "@src/application-wide/api-gateway-hooks/use-notification-events";
import useCampaignEvents from "@src/application-wide/api-gateway-hooks/use-campaign-events";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const ReviewContract = () => {
  const { user, isDetailsLoading } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      isDetailsLoading: isLoading || isFetching,
    }),
  });

  const [s3Link, sets3Link] = useState("");
  const {pushNotification} = useNotificationEvents()
  const DEFAULT_CONTRACT_S3_URL =
    "https://ubu-staging.s3.us-east-2.amazonaws.com/contract-documents_new/contract-document-1734619359466.pdf";
  const [authCookie] = useCookies(["auth"]);
  const { onGetUser } = useGetUser(authCookie);
  const navigate = useNavigate();
  const campaignId = Number(useParams().campaign_id);
  const [isMainLoading, setIsMainLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [signature, setSignature] = useState();
  const [isSendContractLoading, setSendContractLoading] = useState(false);
  const [signatureComplete, setSignatureComplete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isContractDocumentLoading, setContractDocumentLoading] =
    useState(false);
  const [isCampaignUsersLoading, setCampaignUserLoading] = useState(false);
  const {updateCampaignStatusTrigger} = useCampaignEvents()
  const [campaignUsers, setCampaignUsers] = useState({
    brandUser: null,
    influencerUser: null,
  });

  const is_influencer = user?.is_influencer;

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     setCampaignUserLoading(true);
  //     setContractDocumentLoading(true);
  //     try {
  //       //Get Document (if influencer)
  //       if (user?.is_influencer) {
  //         const contractDocumentUrl = await axiosInstance.get(
  //           `/contract/contract-document/by-campaign/${campaignId}`
  //         );
  //         sets3Link(contractDocumentUrl.data);
  //       } else {
  //         sets3Link(DEFAULT_CONTRACT_S3_URL);
  //       }

  //       //Get Campaign Users
  //       const response = await axiosInstance.get(
  //         `/campaign/users/${campaignId}`
  //       );
  //       const { brandUser, influencerUser } = response?.data || {};
  //       setCampaignUsers(() => ({
  //         brandUser,
  //         influencerUser,
  //       }));
  //     } catch (error) {
  //       console.error("Failed to fetch user data:", error);
  //     } finally {
  //       setContractDocumentLoading(false);
  //       setCampaignUserLoading(false);
  //     }
  //   };

  //   fetchDetails();

  //   console.log("aya");
  // }, [user, campaignId]);

  useEffect(() => {
    const fetchContractDocument = async () => {
      setContractDocumentLoading(true);
      try {
        if (user?.is_influencer) {
          const contractDocumentUrl = await axiosInstance.get(
            `/contract/contract-document/by-campaign/${campaignId}`
          );
          sets3Link((prevLink) =>
            prevLink !== contractDocumentUrl.data
              ? contractDocumentUrl.data
              : prevLink
          );
        } else {
          sets3Link((prevLink) =>
            prevLink !== DEFAULT_CONTRACT_S3_URL
              ? DEFAULT_CONTRACT_S3_URL
              : prevLink
          );
        }
      } catch (error) {
        console.error("Failed to fetch contract document:", error);
      } finally {
        setContractDocumentLoading(false);
      }
    };

    if (user && campaignId) {
      fetchContractDocument();
    }
  }, [user, campaignId]);

  useEffect(() => {
    const fetchCampaignUsers = async () => {
      setCampaignUserLoading(true);
      try {
        const response = await axiosInstance.get(
          `/campaign/users/${campaignId}`
        );
        const { brandUser, influencerUser } = response?.data || {};
        setCampaignUsers((prevUsers) => {
          if (
            prevUsers.brandUser === brandUser &&
            prevUsers.influencerUser === influencerUser
          ) {
            return prevUsers; // Prevent unnecessary re-renders
          }
          return { brandUser, influencerUser };
        });
      } catch (error) {
        console.error("Failed to fetch campaign users:", error);
      } finally {
        setCampaignUserLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaignUsers();
    }
  }, [campaignId]);

  const uploadSignature = async () => {
    if (signature) {
      const contractDocumentPayload = {
        campaignId: campaignId,
        ...(user?.is_brand
          ? { brandSignUrl: signature }
          : { influencerSignUrl: signature }),
      };

      try {
        setIsMainLoading(true);

        // Awaiting the axios POST request
        const response = await axiosInstance.post(
          "/contract/create-contract-document",
          contractDocumentPayload
        );

        if (response.status === 201) {
          message.success("Signature Added");
          sets3Link(response.data.documentUrl);
          setSignatureComplete(true);
        } else {
          console.error("S3 link not found in response.");
        }
      } catch (error) {
        message.error("Something went wrong. Please contact support.");
        console.error("Error creating document:", error);
      } finally {
        setIsMainLoading(false);
      }
    }
  };

  useEffect(() => {
    uploadSignature();
  }, [signature]);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    setCurrentPage(2);
  }, [s3Link]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSignatureInsert = (signatureUrl) => {
    setSignature(signatureUrl);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate(`/dashboard/campaigns/${campaignId}`);
  };

  const handleSendClick = async () => {
    const contractPayload = {
      campaignId: campaignId,
      ...(user?.is_brand
        ? { brandSignUrl: signature }
        : { influencerSignUrl: signature }),
      contractDocumentUrl: s3Link,
    };

    try {
      setSendContractLoading(true);
      const response = await axiosInstance.post(
        `contract/submit-contract`,
        contractPayload
      );
      setIsModalVisible(true);
      if (response) {
        updateCampaignStatusTrigger(campaignId)
        if (user?.is_brand) {
          pushNotification(
            0,
            campaignId,
            `${user.first_name + " " + user.last_name} signed this campaign`,
            "SIGN",
            user?.is_brand ? "brand" : "influencer",
            "influencer",
            "campaign",
            campaignId,
            ""
          );
        }
        if (user?.is_influencer) {
          pushNotification(
            0,
            campaignId,
            `${user.first_name + " " + user.last_name} signed this campaign`,
            "SIGN",
            user?.is_brand ? "brand" : "influencer",
            "brand",
            "campaign",
            campaignId,
            ""
          );
        }
      }
    } catch (error) {
      console.log(error);
      message.error(`Error! ${error?.response?.data?.message}`);
    } finally {
      setSendContractLoading(false);
      // navigate("/dashboard/campaigns");
    }
  };

  const isLoading = isDetailsLoading || isCampaignUsersLoading;

  return (
    <div className="review-contract-page">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          { title: <NavLink to={"/dashboard/campaigns"}>Campaigns</NavLink> },
          { title: "Review Contract" },
        ]}
      />
      <div className="details-container">
        <div className="ubu-title">UBU</div>
        <div className="details-box">
          <Flex vertical gap={"1.5rem"}>
            {isLoading ? (
              <Skeleton active />
            ) : (
              <>
                <Flex gap={".5rem"} vertical>
                  <Text className={"fs-16 fw-600 tw-text-black-300"}>
                    Brand Name
                  </Text>
                  <Text className={"fs-14 fw-500 tw-text-black-300"}>
                    {user?.is_brand
                      ? `${user?.first_name} ${user?.last_name}`
                      : `${campaignUsers?.brandUser?.first_name} ${campaignUsers?.brandUser?.last_name}`}
                  </Text>
                </Flex>
                <Flex gap={".5rem"} vertical>
                  <Text className={"fs-16 fw-600 tw-text-black-300"}>
                    Influencer
                  </Text>
                  <Text className={"fs-14 fw-500 tw-text-black-300"}>
                    {user?.is_influencer
                      ? `${user?.first_name} ${user?.last_name}`
                      : `${campaignUsers?.influencerUser?.first_name} ${campaignUsers?.influencerUser?.last_name}`}
                  </Text>
                </Flex>
              </>
            )}
            <SignatureComponent
              handleSignatureInsert={handleSignatureInsert}
              isLoading={isMainLoading}
            />
          </Flex>
        </div>
      </div>

      <div className="pdf-viewer-container">
        <Text className="fs-24 fw-700 tw-text-center">Contract</Text>
        <div className="pdf-wrapper">
          {!isContractDocumentLoading ? (
            <Worker workerUrl={GlobalWorkerOptions.workerSrc}>
              <Viewer
                fileUrl={s3Link}
                plugins={[defaultLayoutPluginInstance]}
                initialPage={currentPage}
              />
            </Worker>
          ) : (
            <div>
              <Skeleton.Input
                active
                style={{ height: "100vh", width: "100vw" }}
              />
            </div>
          )}
        </div>

        <div className="buttons-container">
          <CustomButton variant={"light"} onClick={handleBackClick}>
            Back
          </CustomButton>
          <CustomButton
            variant={"black"}
            onClick={handleSendClick}
            loading={isSendContractLoading}
            disabled={!signatureComplete}
          >
            {user?.is_influencer ? "Submit" : "Send"}
          </CustomButton>
        </div>
      </div>
      {isModalVisible && (
        <SuccessModal
          onClose={handleCloseModal}
          message={
            user?.is_influencer
              ? "Contract Signed Successfully!"
              : "Signed Contract Has Been Sent Successfully!"
          }
        />
      )}
    </div>
  );
};

export default ReviewContract;
