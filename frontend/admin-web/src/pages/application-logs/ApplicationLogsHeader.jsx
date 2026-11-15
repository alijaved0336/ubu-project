import dayjs from "dayjs";
import { Switch } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Button } from "@src/components/Common/Widgets";
import { Heading } from "@src/components/Common/Typography";
import { Paragraph } from "@src/components/Common/Typography";
import { UBUDatePicker, UBUPagination, UBUSearch } from "@src/components";
import { useApplicationLogs } from "@src/components/Providers/ApplicationLogsProvider";

const ApplicationLogsHeader = () => {
  const {
    totalItems,
    filters: { currentPage, isUserApiLogs, itemsPerPage, dateToFind },
    handleSearch,
    handleFilterChange,
    fetchAllLogs,
    handlePageChange,
    handleDateChange,
  } = useApplicationLogs();

  return (
    <div>
      <div className="tw-flex tw-justify-between tw-items-center">
        <Heading level={2} className="tw-font-manrope tw-font-semibold">
          Application Logs
        </Heading>
        <Button type="primary" onClick={() => fetchAllLogs()}>
          Refetch Logs
        </Button>
      </div>
      <div className="tw-flex tw-gap-2 tw-mt-3">
        <UBUDatePicker
          format="YYYY-MM-DD"
          allowClear={false}
          value={dateToFind || dayjs()}
          onChange={(date) => {
            handleDateChange(date);
          }}
        />
      </div>
      <div className="tw-flex tw-gap-2 tw-mt-3">
        <Paragraph className="tw-text-gray-dark tw-text-sm tw-font-medium">
          Admin Api Logs
        </Paragraph>
        <Switch
          isChecked={isUserApiLogs}
          onChange={(value) => handleFilterChange(value)}
        />
        <Paragraph className="tw-text-gray-dark tw-text-sm tw-font-medium">
          User Api Logs
        </Paragraph>
      </div>
      <div className="tw-flex tw-flex-col tw-my-6 tw-justify-items-start xl:tw-flex-row tw-justify-between tw-gap-4">
        <UBUSearch
          prefix={<SearchOutlined />}
          placeholder="Search..."
          onSearch={handleSearch}
          className="tw-w-full xl:tw-basis-1/2 "
          enterButton
        />
        {totalItems > 0 && (
          <UBUPagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            className="tw-w-auto tw-ml-auto"
            handlePaginationChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ApplicationLogsHeader;
