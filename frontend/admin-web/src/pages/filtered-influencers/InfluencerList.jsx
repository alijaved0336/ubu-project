import React, { memo, useLayoutEffect, useMemo, useState } from "react";

import InfluencerCardSkeleton from "@src/components/Skeletons/InfluencerCardSkeleton";
import InfluencerCard from "./InfluencerCard";
import { useFilteredInfluencers } from "./Providers/FilteredInfluencersProvider";
import { useParams } from "react-router-dom";
import NoData from "@src/components/NoData";
import { Virtuoso } from "react-virtuoso";
import useScrollableElement from "@src/hooks/useScrollableElement";

const InfluencerList = () => {
  const {
    influencersList,
    markedCandidates,
    isLoading,
    isAiMode,
    aiData,
    filters,
    totalItems,
  } = useFilteredInfluencers();
  const { id } = useParams(); // Gets the segment ID from the URL
  const parentData = { name: "FilteredInfluencer", segmentId: id };

  const { scrollContainer } = useScrollableElement();

  const List = useMemo(() => {
    const List = React.forwardRef((props, ref) => (
      <div ref={ref} {...props} className="tw-space-y-5" />
    ));

    List.displayName = "ist";

    return List;
  }, []);

  const EmptyPlaceholder = useMemo(() => {
    const EmptyPlaceholder = () =>
      filters?.searchTerm ? (
        <NoData
          isMessage
          message={`No influencer found against this search "${filters?.searchTerm}"`}
        />
      ) : (
        <NoData isMessage message={`No influencers found for this segment.`} />
      );

    return EmptyPlaceholder;
  }, [filters?.searchTerm]);

  return (
    <div
      className="filtered-influencer-content-boundary tw-h-full"
      style={{
        height: "100%",
        boxSizing: "border-box",
        resize: "both",
        padding: "1em",
      }}
    >
      {isLoading ? (
        <div className="influencers-list">
          <InfluencerCardSkeleton isAiInluencersLoading={isAiMode} />
          <InfluencerCardSkeleton isAiInluencersLoading={isAiMode} />
        </div>
      ) : (
        <div>
          <Virtuoso
            overscan={200}
            style={{ height: "100%" }}
            customScrollParent={scrollContainer}
            data={influencersList ?? []}
            totalCount={totalItems}
            components={{
              // eslint-disable-next-line react/display-name
              List,
              EmptyPlaceholder,
            }}
            itemContent={(_, influencer) => (
              <InfluencerCard
                key={influencer.id}
                influencer={influencer}
                showMatchColumn={isAiMode}
                aiData={aiData}
                markedCandidatesProps={markedCandidates}
                searchTerm={filters?.searchTerm}
                parentData={parentData}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};

export default memo(InfluencerList);
