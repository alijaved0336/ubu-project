import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import "./ReviewDocumentPage.less";
import axiosInstance from "../../application-wide/axios/axios-instance";
import { Flex, message } from "antd";
import SmallLoader from "../../components/SmallLoader";
import { useGetInfluencer } from "../../application-wide/api-gateway-hooks";
import { CampaignStatus } from "@src/utils/constant";
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
import { CustomButton, Text } from "@src/components";
import { useGetUserQuery } from "@src/store/api/userApi";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import useNotificationEvents from "@src/application-wide/api-gateway-hooks/use-notification-events";
import { Button } from "@src/components/Common/Widgets";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import { resetCampaignForm } from "@src/store/features/campaignFormSlice";

const ReviewDocumentPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { s3Link, payload, influencer, campaignId, advertisemntUrl, status } =
    location.state;

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { segment_id, inf_id } = useParams();
  const [influencerData, setInfluencerData] = useState(null);
  const [detailsLoading, setdetailsLoading] = useState(true);
  const [isSendLoading, setSendLoading] = useState(false);
  const shortDescription =
    payload.description.split(" ").slice(0, 5).join(" ") +
    `${payload.description.length >= 20 ? "..." : ""}`;

  const { value, loading, error, onGetInlfuencer } = useGetInfluencer(
    true,
    inf_id
  );
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      isDetailsLoading: isLoading || isFetching,
    }),
  });

  useEffect(() => {
    getinfluencerData();
  }, [inf_id]);

  const navigate = useNavigate();
  const { pushNotification } = useNotificationEvents();

  useEffect(() => {
    // Check if location.state exists, otherwise navigate to 404
    if (!location.state) {
      navigate("/404");
    }
  }, [location.state, navigate]);

  if (location.state === null) {
    // navigate("/404");
    return null;
  }

  const getinfluencerData = async () => {
    try {
      const response = await axiosInstance.get(`influencer/${inf_id}`);
      setInfluencerData(response.data);
      setdetailsLoading(false);
    } catch (error) {
      console.error("Error fetching influencer data:", error);
      setdetailsLoading(false);
    }
  };

  const handleBackClick = () => {
    sessionStorage.setItem("backwardPayload", JSON.stringify(payload));

    const to = location?.state?.from;

    navigate(to || -1, {
      state: {
        backwardPayload: payload,
        isOpenSendDocumentModal: true,
      },
      replace: true,
    });
  };
  const campaignPayload = {
    campaign: {
      segmentId: Number(segment_id),
      influencerId: payload.influencerId,
      status: CampaignStatus.PENDING,
      campaignName: payload.campaignName
    },
    document: {
      description: payload.description,
      hashtags: payload.hashtags || [],
      numberOfDeliverables: payload.numberOfDeliverables,
      campaignAcceptanceDeadline: payload.campaignAcceptanceDeadline,
      publicationDates: payload.publicationDates,
      totalCompensation: payload.totalCompensation,
      brandGuidelines: payload.brandGuidelines || null,
      revisions: payload.revisions || null,
      specialConditions: payload.specialConditions || null,
      additionalRequirements: payload.additionalRequirements || null,
      documentUrl: s3Link,
      advertisemntUrl: advertisemntUrl,
      productId: payload.productId || null,
    },
  };

  const handleSendClick = async () => {
    setSendLoading(true);
    try {
      let response;
      if (campaignId) {
        response = await axiosInstance.put(
          `/campaign/${campaignId}`,
          campaignPayload,
          {}
        );
      } else {
        response = await axiosInstance.post(
          "/campaign/create-campaign",
          campaignPayload,
          {}
        );
      }

      if (response.status === 200 || response.status === 201) {
        sessionStorage.removeItem("backwardPayload");
        try {
          if (response.status === 201) {
            const campaign_id =
              response.data.createdCampaign.exhibitDocument.campaignId;
            pushNotification(
              user.id,
              influencer.user.id,
              `${
                user.first_name + " " + user.last_name
              } sent you a campaign invite`,
              "INVITATION",
              user?.is_brand ? "brand" : "influencer",
              "influencer",
              "brand",
              campaign_id,
              ""
            );
          }
          if (response.status === 200) {
            pushNotification(
              "",
              campaignId,
              `${
                user.first_name + " " + user.last_name
              } updated the campaign document`,
              "INVITATION",
              user?.is_brand ? "brand" : "influencer",
              "influencer",
              "campaign",
              campaignId,
              ""
            );
          }
          dispatch(resetCampaignForm());
        } catch (error) {
          console.error("Error Creating Campaign", error);
        }

        notification.success({
          message: "Success",
          description:
            "Document has been sent successfully to recipient's email address.",
        });

        navigate("/dashboard/campaigns");
      } else {
        alert("Failed to send campaign");
      }
    } catch (error) {
      console.error("Error sending campaign:", error);
      notification.error(
        error?.response?.data?.message ||
          "Something Went Wrong. Please try again."
      );
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <div className="review-document-page">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          { title: <NavLink to={"/dashboard/segments"}>Segments</NavLink> },
          {
            title: (
              <NavLink to={`/dashboard/segments/${segment_id}/influencers`}>
                Influencers
              </NavLink>
            ),
          },
          {
            title: "Review Document",
          },
        ]}
      />
      <div className="pdf-viewer-container">
        <Text className="fs-18 fw-600">Review Document</Text>

        {s3Link ? (
          <Worker workerUrl={GlobalWorkerOptions.workerSrc}>
            <Viewer fileUrl={s3Link} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        ) : (
          <Text className={"fs-16 fw-500 text-gray-400"}>
            No document to display
          </Text>
        )}
      </div>

      <div className="details-container">
        {detailsLoading ? (
          <SmallLoader />
        ) : (
          <Flex vertical gap={16} className="details-box">
            <Flex gap={10} vertical>
              <Text className={"fs-16 fw-700"}>Price</Text>
              <Text className={"fs-16 fw-500"}>
                ${payload.totalCompensation}
              </Text>
            </Flex>
            <Flex gap={10} vertical>
              <Text className={"fs-16 fw-700"}>Description</Text>
              <Text className={"fs-16 fw-400"}>{shortDescription}</Text>
            </Flex>

            <Flex gap={10} vertical>
              <Text className={"fs-16 fw-700"}>Recipients</Text>
              <Text className={"fs-16 fw-400"}>
                {" "}
                {influencerData.user.first_name} {influencerData.user.last_name}
              </Text>
            </Flex>
          </Flex>
        )}

        <div className="buttons-container">
          <Button variant="outlined" onClick={handleBackClick}>
            Back
          </Button>
          <Button
            onClick={handleSendClick}
            loading={isSendLoading}
            disabled={status && status !== CampaignStatus.PENDING}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDocumentPage;
