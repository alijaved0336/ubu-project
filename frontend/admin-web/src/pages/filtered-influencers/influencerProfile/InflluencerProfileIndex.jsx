import ReviewCard from "@src/pages/brand-profile/ReviewCard";
import ImagesGallery from "@src/pages/brand-profile/ImagesGallery";
import InformationCard from "@src/pages/brand-profile/InformationCard";
import axiosInstance from "../../../application-wide/axios/axios-instance";
import BackToPreviousPageSegment from "@src/pages/brand-profile/BackToPreviousPageSegment";
import "./ProfilePage.less";

import { CustomButton, Text } from "@src/components";
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import SendDocumentModal from "@src/pages/segments/SendDocumentModal";
import { useTranslation } from "react-i18next";
import { Button, Flex, notification } from "antd";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const InfluencerProfileIndex = () => {
  const { id: influencerId, segmentId } = useParams();
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [isProfileDataLoading, setIsProfileDataLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [isImagesLoading, setIsImagesLoading] = useState(true);
  const [reviewData, setReviewData] = useState(null);
  const [isReviewDataLoading, setIsReviewDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ubu");
  const { showMatchColumn, searchTerm, parentData } = location?.state || {};
  const [isMarked, setIsMarked] = useState(location?.state?.isMarked || false);
  const [isMarkLoading, setIsMarkLoading] = useState(false);
  const [isCampaignExisting, setIsCampaignExisting] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isDirty } = useSelector((state) => state.campaignForm || {});

  const tabs = [
    { id: "ubu", label: "UBU Images" },
    { id: "instagram", label: "Instagram Images" },
    { id: "facebook", label: "Facebook Images" },
  ];

  const fetchImages = async (tabId) => {
    if (tabId == "instagram") {
      notification.error({
        message: "Error",
        description:
          "Instagram connection for ubu is currently on hold, hence this feature is a work in progress",
      });
      return;
    }
    if (tabId != "facebook") {
      setIsImagesLoading(true);
      setImages([]);
      try {
        setActiveTab(tabId);
        const imagesResponse = await axiosInstance.get(
          `/influencer-media/${influencerId}?source=${tabId}`
        ); // Replace with actual API endpoint
        const imagesData = imagesResponse.data.data;
        setImages(imagesData);
      } catch (error) {
        console.error("Error fetching influencer:", error);
      } finally {
        setIsImagesLoading(false);
      }
    }
  };

  const fetchReviewsData = async () => {
    try {
      const response = await axiosInstance.get(
        `/reviews/get-influencer-reviews/${influencerId}`
      );
      const reviewsData = response.data;
      setReviewData(reviewsData);
    } catch (error) {
      console.error("Error fetching influencer:", error);
    } finally {
      setIsReviewDataLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get(`/influencer/${influencerId}`);
        const profileData = response.data;
        setProfileData(profileData);

        setIsCampaignExisting(
          profileData?.campaigns?.some(
            (campaign) =>
              campaign.segmentId === parseInt(segmentId) &&
              campaign.status !== "rejected" &&
              campaign.status !== "completed"
          )
        );
      } catch (error) {
        console.error("Error fetching influencer:", error);
      } finally {
        setIsProfileDataLoading(false);
      }
    };

    // Fetch images from the database
    const fetchInitialImages = async () => {
      await fetchImages(activeTab);
    };

    fetchProfileData();
    fetchInitialImages();
    fetchReviewsData();
  }, []);

  const handleMarkAsCandidate = async (mark) => {
    const formData = {
      influencerId: parseInt(influencerId),
      isMarked: mark,
    };
    setIsMarkLoading(true);
    try {
      const response = await axiosInstance.post(
        `/segments/${segmentId}/mark_candidate`,
        formData
      );
      setIsMarked(!mark);
    } catch (error) {
      console.error("Error fetching influencers:", error);
    } finally {
      setIsMarkLoading(false);
    }
  };

  const handleSendDocuments = () => {
    setIsModalVisible(true);
  };

  const handleBackClick = () => {
    navigate(`/dashboard/segments/${segmentId}/influencers`);
    // if (
    //   parentData &&
    //   parentData?.segmentId &&
    //   parentData?.name == "FilteredInfluencer"
    // ) {
    //   console.log("if");
    //   navigate(`/dashboard/segments/${segmentId}/influencers`, {
    //     state: { searchTerm: searchTerm },
    //   });
    // } else {
    //
    // navigate(-1);
    // }
  };

  useEffect(() => {
    if (isDirty) setIsModalVisible(true);
  }, [isDirty]);

  return (
    <div className="profile-page">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          { title: <NavLink to={"/dashboard/segments"}>Segments</NavLink> },
          { title: "Influencer Profile" },
        ]}
      />
      {/* <BackToPreviousPageSegment calledFrom="influencer" searchTerm={searchTerm} parentData={parentData} /> */}

      <div className="tw-flex tw-justify-between tw-flex-wrap tw-gap-4 tw-items-center">
        <Text className="fs-24 fw-700">Influencer Profile</Text>
        <div className="tw-flex tw-items-center tw-ml-auto tw-gap-2 tw-flex-wrap tw-max-w-full">
          {/* {parentData && parentData?.name == "FilteredInfluencer" && ( */}

          <Button
            onClick={() => handleMarkAsCandidate(isMarked)}
            className={`segment-back-button tw-gap-2 ${
              isMarked ? "black" : "light"
            }`}
            loading={isMarkLoading}
          >
            <PushpinOutlined />
            {isMarked ? "Un-Mark Candidate" : "Mark as Candidate"}
          </Button>
          <Button
            onClick={handleSendDocuments}
            className={`segment-back-button tw-gap-2 ${
              isCampaignExisting ? "black" : "light"
            }`}
            disabled={isCampaignExisting}
          >
            <FileTextOutlined />
            {isCampaignExisting ? "Document Sent" : "Send Document"}
          </Button>

          <Button
            onClick={handleBackClick}
            className="segment-back-button tw-gap-2"
          >
            <ArrowLeftOutlined />
            {t("brand-profile-page.back-segment.back")}
          </Button>
        </div>
      </div>
      <SendDocumentModal
        isModalVisible={isModalVisible}
        influencer={profileData}
        setIsModalVisible={setIsModalVisible}
        selectedInfId={parseInt(influencerId)}
        selectedSegmentId={segmentId}
      />
      <div className="inf-profile-header tw-grid tw-gap-8 tw-grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
        <InformationCard
          calledFrom="influencer"
          isInfoLoading={isProfileDataLoading}
          information={profileData}
        />
        <ReviewCard
          calledFrom="influencer"
          reviewsInformation={reviewData}
          isReviewsLoading={isReviewDataLoading}
        />
      </div>

      <div className="image-gallery">
        <div className="image-tabs tw-mb-4">
          {tabs.map((tab) => (
            <Text
              key={tab.id}
              className={`fs-14 fw-500 ${
                tab.id === activeTab ? `active ${tab.id}` : `${tab.id}`
              }`}
              onClick={() => fetchImages(tab.id)}
            >
              {tab.label}
            </Text>
          ))}
        </div>
        <ImagesGallery
          calledFrom="influencer"
          isImagesLoading={isImagesLoading}
          imagesGallery={images}
        />
      </div>
    </div>
  );
};

export default InfluencerProfileIndex;
