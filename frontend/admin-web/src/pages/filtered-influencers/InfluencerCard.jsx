import React, { useEffect, useState } from "react";
import "./InfluencerCard.less";

import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SendDocumentModal from "../segments/SendDocumentModal";
import { Flex, Image, Tooltip } from "antd";
import { Text } from "@src/components";
import TopRated from "@src/assets/icons/TopRated.svg";
import MaleAvatar from "@src/assets/icons/male-avatar-svgrepo-com 1.svg";
import FemaleAvatar from "@src/assets/icons/female-avatar-svgrepo-com 1.svg";
// import InfluencerCardStatsSkeleton from "@src/components/Skeletons/InfluencerCardStatsSkeleton";
import NeutralAvatar from "@src/assets/icons/neutralavatar.svg";

import { useMarkCandidateMutation } from "@src/store/api/segmentsApi";
import { Button } from "@src/components/Common/Widgets";

const InfluencerCard = ({
  influencer,
  showMatchColumn,
  aiData,
  markedCandidatesProps,
  searchTerm,
  parentData = {},
}) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [doMarkCandidate, { isLoading: isMarkingCandidate }] =
    useMarkCandidateMutation();

  const [influencerData, setInfluencerData] = useState({
    response_time: "Awaiting Response",
    following: "0",
    engagementRate: "0%",
    conversionRate: "0%",
    collabs: "0",
    reviews: "",
    images: [
      "https://img.freepik.com/premium-photo/indian-beauty-influencer-demonstrates-daily-makeup-routine-skillfully-transforms-face-isolated-wh_878783-18807.jpg", // Image 1
      "https://pics.craiyon.com/2023-09-27/3bb27b396ae743e1a650ebeabedbfe24.webp", // Image 2
    ],
    markedCandidates: markedCandidatesProps,
    cumulativeScore:
      Math.floor(aiData[influencer?.id]?.cumulative_score * 100) || 0,
    demographics: Math.floor(aiData[influencer?.id]?.["1"] * 100) || 0,
    valuesAndBeliefs: Math.floor(aiData[influencer?.id]?.["2"] * 100) || 0,
    location: Math.floor(aiData[influencer?.id]?.["3"] * 100) || 0,
    language: Math.floor(aiData[influencer?.id]?.["4"] * 100) || 0,
    reach: Math.floor(aiData[influencer?.id]?.["5"] * 100) || 0,
    engagementMetrics: Math.floor(aiData[influencer?.id]?.["6"] * 100) || 0,
    style: Math.floor(aiData[influencer?.id]?.["7"] * 100) || 0,
  });

  const { id: segmentIdFromUrl } = useParams();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInfId, setSelectedInfId] = useState(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState(null);
  const [isMarked, setIsMarked] = useState(
    influencerData.markedCandidates &&
      influencerData.markedCandidates.includes(influencer.id)
      ? true
      : false
  );

  const isCampaignExisting = influencer?.campaigns?.some(
    (campaign) =>
      campaign.segmentId === parseInt(segmentIdFromUrl) &&
      campaign.status !== "rejected" &&
      campaign.status !== "completed"
  );

  // Define column widths based on the visibility state
  const columnWidth = {
    column1: showMatchColumn ? "16%" : "18%",
    column2: showMatchColumn ? "34%" : "0%",
    column3: showMatchColumn ? "25%" : "55%",
    column4: showMatchColumn ? "8%" : "10%",
    column5: "15%",
  };

  const column4Padding = {
    responseMargin: showMatchColumn ? "10px" : "6px",
    statPadding: showMatchColumn ? "10px 0" : "8px 0",
  };

  const column3Padding = showMatchColumn ? "8px" : "6px 10px";

  const column5Padding = showMatchColumn ? "9px" : "10px";

  const { instagramStats } = influencer || {};

  const handleViewProfile = (influencerId) => {
    navigate(`/dashboard/segments/${id}/influencer-profile/${influencerId}`, {
      state: {
        showMatchColumn: showMatchColumn,
        searchTerm: searchTerm,
        parentData: parentData,
        isMarked: isMarked,
      },
    });
  };

  const handleMarkAsCandidate = async (influencerId, mark) => {
    const formData = {
      influencerId: influencerId,
      isMarked: mark,
    };

    try {
      const response = await doMarkCandidate({ ...formData, id }).unwrap();
      // const response = await axiosInstance.post(
      //   `/segments/${id}/mark_candidate`,
      //   formData
      // );
      influencerData.markedCandidates = response?.data?.markedCandidates;
      setInfluencerData(influencerData);
      setIsMarked(!mark);
      // fetchSummaryData();
    } catch (error) {
      console.error("Error fetching influencers:", error);
    }
  };

  const handleSendDocuments = () => {
    setIsModalVisible(true);
    setSelectedInfId(influencer.id);
    setSelectedSegmentId(id);
  };

  const handleProposalOptions = () => {
    console.log("Proposal Options clicked");
  };

  const renderProgressCircle = (percentage) => {
    return (
      <div className="circle-span" style={{ "--percentage": percentage }}>
        <span>
          {percentage}
          <span className="percentage-sign">%</span>
        </span>
      </div>
    );
  };

  useEffect(() => {
    const { backwardPayload, isOpenSendDocumentModal } = location.state || {};
    if (
      backwardPayload?.influencerId === influencer?.id &&
      isOpenSendDocumentModal
    ) {
      setIsModalVisible(true);
    }
  }, [location, influencer]);

  useEffect(() => {
    // If there's location state, clear it on page reload
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  return (
    <div className="influencer-card" id={influencer?.id} key={influencer?.id}>
      <div className="col col-1 tw-flex tw-flex-col tw-items-center tw-gap-2">
        <div className="avatar-wrapper">
          <Image
            preview={false}
            src={influencer?.user?.avatar}
            alt="Keke Roberts"
            className="influencer-avatar"
            fallback={
              influencer?.user?.user_answer[0]?.selected_options[0] === "Female"
                ? FemaleAvatar
                : influencer?.user?.user_answer[0]?.selected_options[0] ===
                  "Male"
                ? MaleAvatar
                : NeutralAvatar
            }
          />
          {influencer?.reviews?.averageRating >= 4 && (
            <Tooltip title="Top Rated">
              <img
                className="top-rated-badge tw-animate-bulge-rotate-Y"
                src={TopRated}
              />
            </Tooltip>
          )}
        </div>

        <h3 className="influencer-name ff-manrope">
          {influencer?.user?.first_name + " " + influencer?.user?.last_name}
        </h3>
        <div className="social-handles">
          <a
            href="https://instagram.com/Kekerggg"
            className="social-link ff-manrope"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png"
              alt="Instagram"
            />
            @Kekerggg
          </a>
          {/* <a href="https://tiktok.com/@jesspalm" className="social-link">
            <img
              src="https://i0.wp.com/static-00.iconduck.com/assets.00/tiktok-icon-1890x2048-ihin0vop.png?ssl=1"
              alt="TikTok"
            />
            @jesspalm
          </a> */}
        </div>
      </div>

      {showMatchColumn && (
        <div className="col col-2 ">
          <div className="tw-flex tw-gap-3 xs:tw-flex-col sm:tw-flex-row">
            <div className="tw-flex-grow tw-space-y-2">
              <div className="match-percentage">
                <div
                  className="circular-progress"
                  style={{
                    background: `conic-gradient(#cbc6c6 ${
                      360 - influencerData?.cumulativeScore * 3.6
                    }deg, #cbc6c6 ${
                      360 - influencerData?.cumulativeScore * 3.6
                    }deg, #F79E1B 0deg, #F79E1B ${
                      influencerData?.cumulativeScore * 3.6
                    }deg)`,
                  }}
                >
                  <div className="inner-circle">
                    <Text className="fs-24 fw-600 text-orange">
                      {influencerData?.cumulativeScore}
                      <Text className="fs-14 fw-600 text-orange">%</Text>
                    </Text>
                    <Text className="fs-12 text-orange">Match</Text>
                  </div>
                </div>
              </div>

              <div className="tw-basis-1/2 tw-space-y-2">
                <div className="tw-flex tw-gap-2 tw-items-center">
                  <div
                    className="circle"
                    style={{ "--percentage": influencerData?.location }}
                  >
                    <span>
                      {influencerData?.location}
                      <p className="percentage-sign">%</p>
                    </span>
                  </div>
                  <span className="label">Location</span>
                </div>

                <div className="tw-flex tw-gap-2 tw-items-center">
                  <div
                    className="circle"
                    style={{ "--percentage": influencerData?.reach }}
                  >
                    <span>
                      {influencerData?.reach}
                      <p className="percentage-sign">%</p>
                    </span>
                  </div>
                  <span className="label">Influence</span>
                </div>
                <div className="tw-flex tw-gap-2 tw-items-center">
                  <div
                    className="circle"
                    style={{
                      "--percentage": influencerData?.valuesAndBeliefs,
                    }}
                  >
                    <span>
                      {influencerData?.style}
                      <p className="percentage-sign">%</p>
                    </span>
                  </div>
                  <span className="label">Values and Beliefs</span>
                </div>
              </div>
            </div>

            <div className="tw-flex-grow tw-space-y-2 xs:tw-self-start sm:tw-self-end ">
              <div className="tw-flex tw-gap-2 tw-items-center">
                <div
                  className="circle"
                  style={{ "--percentage": influencerData?.demographics }}
                >
                  <span>
                    {influencerData?.demographics}
                    <p className="percentage-sign">%</p>
                  </span>
                </div>
                <span className="label">Demographics</span>
              </div>

              <div className="tw-flex tw-gap-2 tw-items-center">
                <div
                  className="circle"
                  style={{ "--percentage": influencerData?.style }}
                >
                  <span>
                    {influencerData?.valuesAndBeliefs}
                    <p className="percentage-sign">%</p>
                  </span>
                </div>
                <span className="label">Style</span>
              </div>
              <div className="tw-flex tw-gap-2 tw-items-center">
                <div
                  className="circle"
                  style={{ "--percentage": influencerData?.language }}
                >
                  <span>
                    {influencerData?.language}
                    <p className="percentage-sign">%</p>
                  </span>
                </div>
                <span className="label">Language</span>
              </div>

              <div className="tw-flex tw-gap-2 tw-items-center">
                <div
                  className="circle"
                  style={{
                    "--percentage": influencerData?.engagementMetrics,
                  }}
                >
                  <span>
                    {influencerData?.engagementMetrics}
                    <p className="percentage-sign">%</p>
                  </span>
                </div>
                <span className="label">Engagement</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="col col-3">
        <Flex className="response-time" vertical align="center">
          <Text className={"fs-16 fw-600"}>
            {instagramStats?.response_time || influencerData?.response_time}
          </Text>
          <Text className={"fs-14 fw-400"}>Avg. response time</Text>
        </Flex>
        <Flex className="stats-row">
          <Flex vertical className="stat-box">
            <Text className="fs-16 fw-600">
              {instagramStats?.followers_count}
            </Text>
            <Text className="fs-14 fw-400">Following</Text>
          </Flex>
          <Flex vertical className="stat-box">
            <Text className="fs-16 fw-600">
              {instagramStats?.engagement_rate}
            </Text>
            <Text className="fs-14 fw-400">Engagement Rate</Text>
          </Flex>
        </Flex>
        <Flex className="stats-row">
          <Flex vertical className="stat-box">
            <Text className="fs-16 fw-600">
              {instagramStats?.conversion_rate}
            </Text>
            <Text className="fs-14 fw-400">Conversion Rate</Text>
          </Flex>
          <Flex vertical className="stat-box">
            {/* <img
              className="star-icon"
              src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
              alt="Star"
            /> */}
            <Text className="fs-16 fw-600">{instagramStats?.collabs}</Text>
            <Text className="fs-14 fw-400">Collabs</Text>
          </Flex>
        </Flex>
      </div>

      <div className="col col-5 ">
        <Button
          className="tw-py-7"
          onClick={() => handleViewProfile(influencer?.id)}
          variant={"outlined"}
        >
          View Full Profile
        </Button>
        <Button
          className="tw-py-7"
          variant={isMarked ? "solid" : "outlined"}
          onClick={() => handleMarkAsCandidate(influencer?.id, isMarked)}
          loading={isMarkingCandidate}
        >
          {isMarked ? "Un-Mark Candidate" : "Mark as Candidate"}
        </Button>
        <Button
          className="tw-py-7"
          disabled={isCampaignExisting}
          variant={isCampaignExisting ? "solid" : "outlined"}
          onClick={handleSendDocuments}
        >
          {isCampaignExisting ? "Document Sent" : "Send Documents"}
        </Button>
        {/* <button onClick={handleProposalOptions} className="influencer-button proposal-options">
          Proposal Options <span>&#9662;</span>
        </button> */}
      </div>
      <SendDocumentModal
        isModalVisible={isModalVisible}
        influencer={influencer}
        setIsModalVisible={setIsModalVisible}
        selectedInfId={influencer?.id}
        selectedSegmentId={id}
      />
    </div>
  );
};

export default React.memo(InfluencerCard);
