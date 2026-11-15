import React from "react";
import { Paragraph } from "@src/components/Common/Typography";
import { Button, Switch } from "@src/components/Common/Widgets";
import { UBUPagination, UBUSearch } from "@src/components";
import { SearchOutlined } from "@ant-design/icons";
import { useFilteredInfluencers } from "./Providers/FilteredInfluencersProvider";
import PropTypes from "prop-types";

const InfluencerFilters = ({ onShowFilters }) => {
  const {
    isAiMode,
    onToggleAiMode,
    filters,
    totalItems,
    onPageChange,
    onSearch,
    isLoading,
  } = useFilteredInfluencers();
  return (
    <>
      <div className="segment-buttons tw-flex-wrap tw-gap-3">
        <div className="tw-flex tw-gap-2 tw-mt-3">
          <Paragraph className="tw-text-gray-dark tw-text-sm tw-font-medium">
            Filtered Matches
          </Paragraph>
          <Switch
            isChecked={isAiMode}
            onChange={onToggleAiMode}
            disabled={isLoading}
          />
          <Paragraph className="tw-text-gray-dark tw-text-sm tw-font-medium">
            AI Matches
          </Paragraph>
        </div>
        <Button
          onClick={onShowFilters}
          disabled={isLoading}
          className="tw-ml-auto"
        >
          <i className="fas fa-filter"></i> Filters
        </Button>
      </div>
      <div className="tw-flex tw-flex-col tw-my-6 tw-justify-items-start xl:tw-flex-row tw-justify-between tw-gap-4">
        {!isAiMode && (
          <UBUSearch
            prefix={<SearchOutlined />}
            placeholder="Search..."
            onSearch={onSearch}
            className="tw-w-full xl:tw-basis-1/2 "
            searchTerm={filters?.searchTerm}
            enterButton
          />
        )}
        <UBUPagination
          currentPage={filters?.currentPage}
          itemsPerPage={filters?.itemsPerPage}
          totalItems={totalItems}
          className="tw-w-auto tw-ml-auto"
          handlePaginationChange={onPageChange}
        />
      </div>
    </>
  );
};

InfluencerFilters.propTypes = {
  onShowFilters: PropTypes.func,
};

export default InfluencerFilters;
