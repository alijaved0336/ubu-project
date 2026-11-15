import Review from "./Review";
import PropTypes from "prop-types";
import BrandReviewCardSkeleton from "@src/components/Skeletons/BrandReviewCardSkeleton";

import { Text } from "@src/components";
import { Flex } from "antd";

const ReviewCard = ({ reviewsInformation, isReviewsLoading, calledFrom }) => {
  let filteredReviews = reviewsInformation?.reviewsReceived
    ?.filter((review) => review.rating > 3)
    ?.slice(0, 10);

  filteredReviews =
    filteredReviews?.length < 10
      ? reviewsInformation?.reviewsReceived
      : filteredReviews;

  return (
    <Flex vertical gap={30} className="reviews-card card">
      {isReviewsLoading ? (
        <BrandReviewCardSkeleton />
      ) : (
        <>
          <Flex vertical>
            <Text className="fs-32 fw-700">
              {calledFrom === "brand" ? "Influencer" : "Brand"} Reviews
            </Text>

            <Flex vertical gap={8}>
              {reviewsInformation?.totalReviews ? (
                <>
                  <Flex align="center" gap={5}>
                    <Text className="tw-text-[5rem] fw-700">
                      {reviewsInformation?.averageRating}
                    </Text>
                    <Text className="tw-text-[2.25rem] fw-600 tw-text-black-60 fw-600">
                      /5
                    </Text>
                  </Flex>
                  <Text className="fs-28 tw-text-black-60">
                    Based on {reviewsInformation?.totalReviews} Review
                    {reviewsInformation?.totalReviews > 1 ? "s" : ""}
                  </Text>
                </>
              ) : (
                <Text className="fs-28 tw-text-black-60 tw-mt-4">
                  No reviews yet
                </Text>
              )}
            </Flex>
          </Flex>
          {filteredReviews?.length ? (
            <Review allReviews={filteredReviews} />
          ) : (
            <></>
          )}
        </>
      )}
    </Flex>
  );
};

ReviewCard.propTypes = {
  reviewsInformation: PropTypes.object,
  isReviewsLoading: PropTypes.bool,
  calledFrom: PropTypes.string,
};

export default ReviewCard;
