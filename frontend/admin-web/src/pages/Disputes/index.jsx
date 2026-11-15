import React, { useCallback, useState } from "react";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import DisputesTable from "./DisputesTable";
import { useGetAllDisputesQuery } from "@src/store/api/disputeApi";
import { Heading } from "@src/components/Common/Typography";
import DisputeResolveModal from "./DisputeResolveModal";
import Container from "@src/components/Common/Container/Container";
import { UBUPagination, UBUSearch, UBUSelect } from "@src/components";
import { SearchOutlined } from "@ant-design/icons";
import RangePicker from "@src/components/Common/Widgets/RangePicker/RangePicker";

const statuses = [
  { value: "resolved", label: "Resolved" },
  { value: "pending", label: "Pending" },
];

const resolutionActions = [
  { value: "refund_to_brand", label: "Refund to brand" },
  {
    value: "release_funds_to_influencer",
    label: "Release funds to influencer",
  },
  { value: "restart_campaign", label: "Restart campaign" },
];

const Disputes = () => {
  const [isOpenDisputeResolveModal, setIsOpenDisputeResolveModal] =
    useState(false);

  const [selectedDispute, setSelectedDispute] = useState(undefined);

  const [filters, setFilters] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    status: "",
    searchTerm: "",
    resolutionAction: "",
    startDate: "",
    endDate: "",
  });

  const { disputes, totalCount, isLoading } = useGetAllDisputesQuery(filters, {
    selectFromResult: ({
      isError,
      isFetching,
      isLoading,
      data,
      status,
      error,
    }) => {
      const { disputes, totalCount } = data?.data?.data || {};

      return {
        isLoading: isLoading || isFetching,
        isError,
        error,
        disputes: disputes,
        totalCount,
        status,
      };
    },
    refetchOnMountOrArgChange: true,
  });

  const handleCloseDisputeResolveModal = () => {
    setIsOpenDisputeResolveModal(false);
    setSelectedDispute(undefined);
  };

  const handleOpenDisputeResolveModal = (dispute) => {
    setSelectedDispute(dispute);
    setIsOpenDisputeResolveModal(true);
  };

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

  const handleChangeResolutionAction = (resolutionAction) => {
    const updatedResolutionAction = resolutionAction || "";

    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1,
      resolutionAction: updatedResolutionAction,
    }));
  };

  const handleChangeStatus = (status) => {
    const updatedStatus = status || "";

    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1,
      status: updatedStatus,
    }));
  };
  const handleDateChange = (_, [startDate, endDate]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1,
      startDate: startDate || "",
      endDate: endDate || "",
    }));
  };

  return (
    <Container className="tw-py-4">
      <div className="tw-space-y-6">
        <UBUBreadCrumb
          items={[{ title: "Dashboard" }, { title: "Disputes" }]}
        />
        {isOpenDisputeResolveModal && (
          <DisputeResolveModal
            isOpen={isOpenDisputeResolveModal}
            dispute={selectedDispute}
            onConfirm={handleCloseDisputeResolveModal}
            onCancel={handleCloseDisputeResolveModal}
          />
        )}
        <div className="tw-flex tw-justify-between tw-items-center tw-flex-wrap">
          <Heading level={3} className="tw-font-bold tw-basis-3/4">
            Disputes
          </Heading>
        </div>

        <div className="tw-flex tw-flex-col tw-my-6 tw-justify-items-start lg:tw-flex-row tw-justify-between tw-gap-4">
          <UBUSearch
            prefix={<SearchOutlined />}
            placeholder="Search Disputes..."
            onSearch={handleSearch}
            className="tw-w-full  md:tw-basis-1/2"
            enterButton
          />

          <UBUSelect
            allowClear
            className="tw-flex-grow"
            options={statuses}
            onChange={handleChangeStatus}
            placeholder="Status"
          />
          <UBUSelect
            allowClear
            className="tw-flex-grow"
            options={resolutionActions}
            onChange={handleChangeResolutionAction}
            placeholder="Resolution Action"
          />
          <RangePicker className="tw-flex-grow" onChange={handleDateChange} />
        </div>
        <div className="tw-flex tw-items-center tw-gap-2 tw-flex-grow tw-w-1/2"></div>
        <div className="tw-flex tw-justify-end tw-items-center">
          <UBUPagination
            currentPage={filters?.currentPage}
            itemsPerPage={filters?.itemsPerPage}
            totalItems={totalCount}
            className="tw-w-auto tw-ml-auto"
            handlePaginationChange={handlePageChange}
          />
        </div>

        <DisputesTable
          disputes={disputes}
          isLoading={isLoading}
          onOpenDisputeResolveModal={handleOpenDisputeResolveModal}
        />
      </div>
    </Container>
  );
};

export default Disputes;
