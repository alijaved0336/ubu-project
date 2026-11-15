import React from "react";
import SegmentHeader from "@src/components/SegmentHeader/SegmentHeader";

import { useGetSegmentSummaryQuery } from "@src/store/api/segmentsApi";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import InfluencerFilters from "./InfluencerFilters";

const InfleuncerHeader = ({ onShowFilters, brandLogo }) => {
  const { id } = useParams(); // Gets the segment ID from the URL

  const { segmentSummary, isLoadingSegmentSummary } = useGetSegmentSummaryQuery(
    id,
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        segmentSummary: data,
        isLoadingSegmentSummary: isLoading || isFetching,
      }),
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <>
      <SegmentHeader
        brandLogo={brandLogo}
        summaryData={segmentSummary ?? []}
        isSummaryDataLoading={isLoadingSegmentSummary}
      />

      <InfluencerFilters onShowFilters={onShowFilters} />
    </>
  );
};

InfleuncerHeader.propTypes = {
  onShowFilters: PropTypes.func,
  brandLogo: PropTypes.string,
};

export default InfleuncerHeader;
