import PropTypes from "prop-types";
import SmallLoader from "../SmallLoader";
import axiosInstance from "@src/application-wide/axios/axios-instance";

import { UBUModal } from "..";
import { Flex, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInitials } from "@src/utils/formateFunctions";
import { useDetectScreen } from "@src/hooks";

const { Text } = Typography;

const HeaderCardModal = ({ isModalOpen, setIsModalOpen, modalDataInput }) => {
  const { id } = useParams();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const endpoint = id
          ? `/segments/segment_summary/${id}?specificStatusRequired=${modalDataInput.title}`
          : `/segments/summary?specificStatusRequired=${modalDataInput.title}`;

        setIsApiLoading(true);
        const response = await axiosInstance.get(endpoint);
        setModalData(response.data[modalDataInput.title]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsApiLoading(false);
      }
    };
    if (isModalOpen) {
      if (modalDataInput?.count <= 3) {
        setModalData(modalDataInput);
      } else {
        fetchSummaryData();
      }
    }
    return () => {
      setModalData(null);
    };
  }, [isModalOpen, id, modalDataInput]);

  const handleRecordClick = (influencerId) => {
    navigate(`/dashboard/segments/${id}/influencer-profile/${influencerId}`);
  };

  const isSmallScreen = useDetectScreen(900);
  return (
    <UBUModal
      title={
        <Flex className="tw-items-center tw-gap-2">
          <Text className="tw-text-xl tw-font-semibold">
            {modalDataInput?.title}
          </Text>
          {modalData?.count ? (
            <Text className="tw-text-xl tw-font-semibold tw-animate-pop-up">
              ({modalData.count})
            </Text>
          ) : (
            <></>
          )}
        </Flex>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      width={isSmallScreen ? `50%` : "35%"}
      height="60%"
      footer={[]}
    >
      {isApiLoading ? (
        <Flex
          className="tw-items-center tw-justify-center"
          style={{ height: "100%" }}
        >
          <SmallLoader />
        </Flex>
      ) : modalData?.influencers?.length ? (
        <Flex className="tw-flex-col tw-gap-4 tw-mt-4">
          {modalData?.influencers?.map((influencer, i) => (
            <Flex
              key={i}
              className="tw-items-center tw-gap-4 tw-animate-slide-in-left"
              onClick={() => handleRecordClick(influencer.id)}
              style={{ cursor: "pointer" }}
            >
              {influencer.profilePicture ? (
                <img
                  src={influencer.profilePicture}
                  alt={influencer.name}
                  className="tw-w-[50px] tw-h-[50px] tw-rounded-full tw-border-2 tw-border-white tw-shadow-sm tw-object-cover"
                />
              ) : (
                <div className="tw-flex tw-items-center tw-justify-center tw-w-[50px] tw-h-[50px] tw-rounded-full tw-bg-[#e7e5e5] tw-text-black tw-text-[0.75rem] tw-font-semibold">
                  {getInitials(influencer.name)}
                </div>
              )}
              <Flex vertical>
                <Text className={"fs-14 fw-800 tw-font-manrope"}>
                  {influencer.name}
                </Text>
                <Text className={"fs-12 fw-600 info-card"}>
                  {influencer.segmentName}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      ) : (
        <Flex className="tw-items-center tw-justify-center tw-h-full">
          <Text className={"fs-14 fw-800"}>No Influencers</Text>
        </Flex>
      )}
    </UBUModal>
  );
};

HeaderCardModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  modalDataInput: PropTypes.object,
};

export default HeaderCardModal;
