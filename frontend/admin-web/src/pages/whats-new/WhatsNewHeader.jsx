import { SearchOutlined } from "@ant-design/icons";
import { Button } from "@src/components/Common/Widgets";
import { UBUPagination, UBUSearch } from "@src/components";
import { Heading } from "@src/components/Common/Typography";
import { useWhatsNew } from "@src/components/Providers/WhatsNewProvider";

const WhatsNewHeader = () => {
  const {
    totalItems,
    filters: { currentPage, itemsPerPage },
    handleSearch,
    navigate,
    handlePageChange
  } = useWhatsNew();

  return (
    <div>
      <div className="tw-flex tw-justify-between tw-items-center">
        <Heading level={2} className="tw-font-manrope tw-font-semibold">
          Whats New
        </Heading>
        <Button
          type="primary"
          onClick={() => navigate("/dashboard/whats_new/create")}
        >
          Create Whats New
        </Button>
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

export default WhatsNewHeader;
