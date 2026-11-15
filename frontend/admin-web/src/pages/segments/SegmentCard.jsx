import PropTypes from "prop-types";
import axiosInstance from "../../application-wide/axios/axios-instance";
import Skeleton from "react-loading-skeleton";
import { isSuccess } from "@src/utils/responseHelpers";
import "./SegmentCard.less";

import "react-loading-skeleton/dist/skeleton.css";

import { useState, useEffect, useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Flex, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Text } from "@src/components";
import { showNotification } from "@src/utils/showNotification";
import { LoadingOutlined } from "@ant-design/icons";
import SegmentCardSkeleton from "./SegmentCardSkeleton";
import EditIconNew from "@src/assets/icons/EditIconNew";

const SegmentCard = ({
  segment,
  handleDelete,
  isSegmentDeleting,
  setSegments,
}) => {
  const [segmentData, setSegmentData] = useState(null);
  const [isSegmentLoading, setIsSegmentLoading] = useState(true);
  const [isSegmentNameInputActive, setIsSegmentNameInputActive] =
    useState(false);
  const [segmentName, setSegmentName] = useState(segment.name);
  const [isSegmentNameUpdating, setIsSegmentNameUpdating] = useState(false);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch specific data for this segment
    fetchSegmentData(segment.id);
  }, [segment.id]);

  const updateSegmentName = async () => {
    try {
      if (!segmentName) {
        showNotification({
          notificationType: "warning",
          message: "Segment Name Required",
          description: "Segment name can not be empty",
        });
        return;
      }
      setIsSegmentNameUpdating(true);
      const response = await axiosInstance.put(`segments/${segment.id}`, {
        name: segmentName,
      });
      if (isSuccess(response.status)) {
        setSegments((prevSegments) =>
          prevSegments.map((seg) =>
            seg.id === segment.id ? { ...seg, name: segmentName } : seg
          )
        );
        showNotification({
          notificationType: "success",
          message: "Segment Name Updated",
          description: "Segment name updated successfully",
        });
        setIsSegmentNameInputActive(false);
        setIsSegmentNameUpdating(false);
      } else {
        setIsSegmentNameUpdating(false);
        setSegmentName(segment.name);
        showNotification({
          notificationType: "error",
          message: "Something went wrong",
          description: "Segment name update failed",
        });
      }
    } catch (error) {
      setIsSegmentNameUpdating(false);
      setSegmentName(segment.name);
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
        description: "Segment name update failed",
      });
      console.error("Failed to update segment name:", error);
    }
  };

  const fetchSegmentData = async (segmentId) => {
    try {
      const response = await axiosInstance.get(
        `/segments/${segmentId}/segment_data`
      );
      setSegmentData(response.data);
    } catch (error) {
      console.error(`Failed to fetch data for segment ${segmentId}`, error);
    } finally {
      setIsSegmentLoading(false);
    }
  };

  const handleCardDelete = (event, id) => {
    event.stopPropagation();
    handleDelete(id);
  };

  const handleSegmentNameClick = async (event) => {
    event.stopPropagation();
    await setIsSegmentNameInputActive(true);
    focusSegmentNameField();
  };

  const focusSegmentNameField = () => {
    inputRef.current?.focus();
  };

  const handleCardClick = () => {
    navigate(`/dashboard/segments/${segment.id}/influencers`);
  };

  if (isSegmentLoading) return <SegmentCardSkeleton />;

  return (
    <div
      key={segment.id}
      className="segment-card tw-cursor-pointer"
      onClick={() => handleCardClick()}
    >
      <Flex vertical className="segment-content">
        <div className="segment-section-header">
          {isSegmentNameInputActive ? (
            isSegmentNameUpdating ? (
              <Spin
                indicator={<LoadingOutlined spin className="tw-text-black" />}
                size="large"
              />
            ) : (
              <input
                ref={inputRef}
                type="text"
                name="segment_name"
                value={segmentName}
                className="segment-name-input"
                onChange={(event) => setSegmentName(event.target.value)}
                onClick={(event) => event.stopPropagation()}
                onBlur={() => {
                  setIsSegmentNameInputActive(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    updateSegmentName();
                  } else if (event.key === "Escape") {
                    setIsSegmentNameInputActive(false);
                  }
                }}
              />
            )
          ) : (
            <>
              <Text className="tw-flex tw-gap-3 fs-20 fw-700 tw-mb-4 ">
                {segment.name}
                <EditIconNew onClick={handleSegmentNameClick} />
              </Text>
            </>
          )}
          <div className="segment-actions">
            {isSegmentDeleting.status &&
            isSegmentDeleting.segmentId === segment.id ? (
              <Spin className="segment-black-spinner" />
            ) : (
              <FaTrashAlt
                className="segment-icon tw-text-black-muted"
                onClick={(event) => handleCardDelete(event, segment.id)}
              />
            )}
          </div>
        </div>
        <Flex key={segment.name} className="segment-details">
          {Object.entries(segmentData).map(([key, value], index) => (
            <Flex vertical key={index} className="segment-detail">
              <Text className={"fs-14 fw-600"}>{key.replace(/_/g, " ")}:</Text>
              <Text className={"fs-14 detail-text"}>{value}</Text>
            </Flex>
          ))}
          {segment.additionalCount > 0 && (
            <div className="segment-more">
              <Text className={"fs-14"}>+{segment.id} more...</Text>
            </div>
          )}
        </Flex>
      </Flex>
    </div>
  );
};

SegmentCard.propTypes = {
  segment: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  setSegments: PropTypes.func.isRequired,
  isSegmentDeleting: PropTypes.shape({
    segmentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    status: PropTypes.bool.isRequired,
  }).isRequired,
};

export default SegmentCard;
