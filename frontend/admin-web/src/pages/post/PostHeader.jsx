import { SearchOutlined } from "@ant-design/icons";
import { Select } from "antd"; // Added Select from Ant Design
import { UBUPagination, UBUSearch, UBUSelect } from "@src/components";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import { usePosts } from "@src/components/Providers/PostsProvider";

const statuses = [
  { value: "Published", label: "Published" },
  { value: "Draft", label: "Draft" },
  { value: "All", label: "All" },
];

const PostHeader = () => {
  const {
    totalItems,
    filters: { currentPage, itemsPerPage, status }, // Added status filter
    onSearch,
    onPageChange,
    onCreate,
    onStatusChange, // Added status change handler
  } = usePosts();

  return (
    <div>
      <div className="tw-flex tw-justify-between tw-items-center">
        <Heading level={2} className="tw-font-manrope tw-font-semibold">
          Posts
        </Heading>

        <Button type="primary" onClick={() => onCreate()}>
          Create Post
        </Button>
      </div>
      <div className="tw-flex tw-flex-col tw-my-6 tw-justify-items-start md:tw-flex-row tw-justify-between tw-gap-4">
        <UBUSearch
          prefix={<SearchOutlined />}
          placeholder="Search posts..."
          onSearch={onSearch}
          className="tw-w-full xl:tw-flex-grow "
          enterButton
        />
        <UBUSelect
          allowClear
          className="md:tw-basis-1/4"
          options={statuses}
          onChange={onStatusChange}
          placeholder="Status"
        />
      </div>
      <div className="tw-flex tw-flex-col tw-my-6 tw-justify-items-start xl:tw-flex-row tw-justify-between tw-gap-4">
        <UBUPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          className="tw-w-auto tw-ml-auto"
          handlePaginationChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default PostHeader;
