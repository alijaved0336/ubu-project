import React, { useState, useCallback } from "react";
import { UBUPagination, UBUSearch } from "@src/components";
import { SearchOutlined } from "@ant-design/icons";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import Container from "@src/components/Common/Container/Container";
import { Heading } from "@src/components/Common/Typography";

import InfluencerPaymentsTable from "./InfluencerPaymentsTable";
import { useGetAmazonInfluencersQuery } from "@src/store/api/userApi";

const InfluencerPayouts = () => {
  const [filters, setFilters] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: "",
  });

  const { amazonInfluencers, isLoading, totalCount } =
    useGetAmazonInfluencersQuery(filters, {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        amazonInfluencers: data?.data,
        totalCount: data?.total,
        isLoading: isLoading || isFetching,
      }),
      refetchOnMountOrArgChange: true,
    });

  const handleSearch = useCallback((value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1,
      searchTerm: value,
    }));
  }, []);

  const handlePageChange = useCallback((pageNumber, pageSize) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: pageNumber,
      itemsPerPage: pageSize,
    }));
  }, []);

  return (
    <Container className="tw-py-6">
      <div className="tw-space-y-6">
        <UBUBreadCrumb items={[{ title: "Dashboard" }, { title: "Payouts" }]} />

        <div className="tw-flex tw-justify-between tw-items-center tw-flex-wrap">
          <Heading level={3} className="tw-font-bold tw-text-gray-900">
            Influencer Payouts
          </Heading>
        </div>

        <div className="tw-flex tw-flex-col tw-my-6 tw-justify-items-start lg:tw-flex-row tw-justify-between tw-gap-4">
          <UBUSearch
            prefix={<SearchOutlined />}
            placeholder="Search..."
            onSearch={handleSearch}
            className="tw-w-full lg:tw-basis-1/2"
            enterButton
          />

          <UBUPagination
            currentPage={filters.currentPage}
            itemsPerPage={filters.itemsPerPage}
            totalItems={totalCount}
            className="tw-w-auto tw-ml-auto"
            handlePaginationChange={handlePageChange}
          />
        </div>

        <InfluencerPaymentsTable
          payments={amazonInfluencers}
          isLoading={isLoading}
        />
      </div>
    </Container>
  );
};

export default InfluencerPayouts;
