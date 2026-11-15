import PropTypes from "prop-types";

import { useState } from "react";
import { Text } from "@src/components";
import { Flex, Image, Rate } from "antd";
import { getInitials } from "@src/utils/formateFunctions";
import { getRandomColor } from "@src/utils/commonFunctions";
import { useTranslation } from "react-i18next";
import { useGetUserQuery } from "@src/store/api/userApi";

const Review = ({ allReviews, allowAnonymityCheck = true }) => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentReview = allReviews?.[currentIndex] || {};

  const isUserReviewer =
    currentReview?.reviewerInfluencer?.user?.id === user?.id ||
    currentReview?.reviewerBrand?.user?.id === user?.id;

  const isAnonymous =
    allowAnonymityCheck && currentReview?.is_anonymous && !isUserReviewer;

  const avatar =
    currentReview?.reviewerInfluencer?.user?.avatar ||
    currentReview?.reviewerBrand?.user?.avatar;
  const firstName =
    currentReview?.reviewerInfluencer?.user?.first_name ||
    currentReview?.reviewerBrand?.user?.first_name;
  const lastName =
    currentReview?.reviewerInfluencer?.user?.last_name ||
    currentReview?.reviewerBrand?.user?.last_name;

  const reviewerName = isAnonymous
    ? "Anonymous"
    : `${firstName || ""} ${lastName || ""}`.trim();

  const handleNext = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allReviews.length);

  const handlePrevious = () =>
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + allReviews.length) % allReviews.length
    );

  const renderAvatar = () => {
    if (isAnonymous) {
      return (
        <div
          className="tw-w-11 tw-h-11 tw-rounded-full tw-border-black/10 tw-flex tw-items-center tw-justify-center tw-font-bold"
          style={{ borderWidth: "6px", backgroundColor: getRandomColor() }}
        >
          A
        </div>
      );
    }
    if (avatar) {
      return (
        <Image
          src={avatar}
          className="tw-rounded-full tw-object-contain"
          style={{ height: "45px", width: "45px", borderWidth: "1px" }}
          alt="Profile"
          preview={false}
        />
      );
    }
    return (
      <div
        className="tw-w-11 tw-h-11 tw-rounded-full tw-border-6 tw-border-black/10 tw-flex tw-items-center tw-justify-center tw-font-bold"
        style={{ borderWidth: "6px", backgroundColor: getRandomColor() }}
      >
        {getInitials(`${firstName || ""} ${lastName || ""}`)}
      </div>
    );
  };

  return (
    <Flex gap={12} vertical>
      <Flex
        align="center"
        justify="space-between"
        wrap
        className="tw-w-full"
        gap={8}
      >
        <Flex gap={12}>
          <Flex>{renderAvatar()}</Flex>

          <Flex gap={4} className="tw-flex-col tw-justify-between tw-py-1">
            <Text className="fs-14 fw-700">{reviewerName}</Text>
            <Rate
              className="custom-rate tw-text-sm"
              disabled
              value={currentReview?.rating}
              allowHalf
            />
          </Flex>
        </Flex>

        {allReviews.length > 1 && (
          <Flex align="center" gap={4}>
            <Text className="fs-24 tw-cursor-pointer" onClick={handlePrevious}>
              &lt;
            </Text>
            <Text className="fs-12 tw-text-black fw-6 tw-tracking-wider">
              {t("brand-profile-page.review-card.review.top-comments")}
            </Text>
            <Text className="fs-24 tw-cursor-pointer" onClick={handleNext}>
              &gt;
            </Text>
          </Flex>
        )}
      </Flex>

      <Flex>
        <Text className="tw-leading-6 fs-14 tw-text-gray-slategray">
          {currentReview?.comment}
        </Text>
      </Flex>
    </Flex>
  );
};

Review.propTypes = {
  allReviews: PropTypes.array.isRequired,
  allowAnonymityCheck: PropTypes.bool,
};

export default Review;
