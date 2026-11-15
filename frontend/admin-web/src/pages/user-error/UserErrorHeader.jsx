import { SearchOutlined } from "@ant-design/icons";
import { UBUPagination, UBUSearch } from "@src/components";
import { Heading } from "@src/components/Common/Typography";
import { useUserError } from "@src/components/Providers/UserErrorProvider";

const UserErrorHeader = () => {
  const {
    totalItems,
    filters: { currentPage, itemsPerPage },
    handleSearch,
    handlePageChange
  } = useUserError();

  return (
    <div>
      <div className="tw-flex tw-justify-between tw-items-center">
        <Heading level={2} className="tw-font-manrope tw-font-semibold">
          Body Gram Errors
        </Heading>
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

export default UserErrorHeader;
