import ReviewCard from "./ReviewCard";
import ImagesGallery from "./ImagesGallery";
import InformationCard from "./InformationCard";
import BackToPreviousPageSegment from "./BackToPreviousPageSegment";
import useGetBrandProfileInformation from "@src/application-wide/api-gateway-hooks/use-get-profile-information";
import useGetBrandReviews from "@src/application-wide/api-gateway-hooks/use-get-brand-reviews";
import "./BrandProfileIndex.less";

import { NavLink, useParams } from "react-router-dom";
import { useCallback } from "react";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";

const BrandProfileIndex = () => {
  const { id: brandId } = useParams();
  const { loading, value } = useGetBrandProfileInformation(true, brandId);
  const { loading: isBrandReviewsLoading, value: brandReviews } =
    useGetBrandReviews(true, brandId);

  const getFilteredProductImages = useCallback((products) => {
    return products.flatMap((product) => product.media);
  }, []);

  return (
    <div className="profile-page">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          {
            title: <NavLink to="/dashboard/proposals?tab=1">Proposals</NavLink>,
          },
          { title: "Brand Profile" },
        ]}
      />
      <BackToPreviousPageSegment calledFrom="brand" />
      <div className="profile-header">
        <InformationCard
          calledFrom="brand"
          isInfoLoading={loading || value === undefined}
          information={value?.data}
        />
        <ReviewCard
          calledFrom="brand"
          reviewsInformation={brandReviews?.data}
          isReviewsLoading={isBrandReviewsLoading || brandReviews === undefined}
        />
      </div>
      <ImagesGallery
        calledFrom="brand"
        isImagesLoading={loading}
        imagesGallery={getFilteredProductImages(value?.data?.product || [])}
      />
    </div>
  );
};

export default BrandProfileIndex;
