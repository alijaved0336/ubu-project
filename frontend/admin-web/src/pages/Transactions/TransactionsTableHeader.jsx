import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { UBUPagination, UBUSearch, UBUSelect } from "@src/components";
import { Heading } from "@src/components/Common/Typography";
import { useCampaignTransactions } from "@src/components/Providers/CampaignTransactionsProvider";
import RangePicker from "@src/components/Common/Widgets/RangePicker/RangePicker";

const statuses = [
  { value: "succeeded", label: "Succeeded" },
  { value: "refund_requested", label: "Refund Requested" },
  { value: "refunded", label: "Refunded" },
  { value: "transferred", label: "Transferred" },
  { value: "in-complete", label: "InComplete" },
];

const TransactionsTableHeader = () => {
  const {
    totalCount,
    filters: { currentPage, itemsPerPage },
    onPageChange,
    onSearch,
    onChangeStatus,
    onDateChange,
  } = useCampaignTransactions();
  return (
    <div className="">
      <Heading level={4} className="tw-font-bold">
        Transaction History
      </Heading>
      <div className="tw-flex tw-flex-col tw-my-6 tw-justify-items-start md:tw-flex-row tw-justify-between tw-gap-4">
        <UBUSearch
          prefix={<SearchOutlined />}
          placeholder="Search Transactions..."
          onSearch={onSearch}
          className="tw-w-full xl:tw-flex-grow "
          enterButton
        />
        <UBUSelect
          allowClear
          className="md:tw-basis-1/4"
          options={statuses}
          onChange={onChangeStatus}
          placeholder="Status"
        />
        <RangePicker className="md:tw-basis-1/4" onChange={onDateChange} />
      </div>
      <div className="tw-flex tw-justify-end tw-items-center">
        <UBUPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalCount}
          className="tw-w-auto tw-ml-auto"
          handlePaginationChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default TransactionsTableHeader;
