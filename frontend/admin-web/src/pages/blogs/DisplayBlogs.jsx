import BlogCard from "./BlogCard";
import CustomTag from "./CustomTag";
import TagsDropDown from "./TagsDropDown";
import NoData from "@src/components/NoData";
import FooterLayout from "../layouts/FooterLayout";
import GenericLayout from "../layouts/GenericLayout";
import NoBlogIcon from "@src/assets/icons/NoBlogsIcon";
import LandingPageLayout from "../layouts/LandingPageLayout";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import BlogCardSkeleton from "@src/components/Skeletons/BlogCardSkeleton";

import { Button, Flex, Popover } from "antd";
import { isSuccess } from "@src/utils/responseHelpers";
import { useCallback, useEffect, useState } from "react";
import { UBUPagination, UBUSearch } from "@src/components";
import { showNotification } from "@src/utils/showNotification";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { ADMIN_EMAILS } from "@src/utils/constant";

const DisplayBlogs = () => {
  const [blogList, setBlogList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTags, setSearchTags] = useState([]);
  const { user } = useSelector((state) => state.auth || {});

  const onTagCloseClick = () => {
    setSearchTags([]);
  };

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const searchTagsQueryParams = searchTags
        .map((tag) => `tags=${tag.id}`)
        .join("&");
      const apiUrl = `/blog/public?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&${searchTagsQueryParams}`;
      const res = await axiosInstance.get(apiUrl);
      if (isSuccess(res.status)) {
        setTotalItems(res.data.total);
        setBlogList(res.data.data);
      }
    } catch (error) {
      console.error(error);
      showNotification({
        notificationType: "error",
        message: ` Something went wrong`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, searchTags]);

  const handlePaginationChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);
    setItemsPerPage(pageSize);
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = (value) => {
    setCurrentPage(1);
    setTotalItems(0);
    setSearchTerm(value);
  };

  const handleProductChange = (selectedOption, event) => {
    if (event) event.stopPropagation();
    setCurrentPage(1);
    setSearchTags((prevTags) => {
      const exists = prevTags.some((tag) => tag.id === selectedOption.id);
      return exists
        ? prevTags.filter((tag) => tag.id !== selectedOption.id)
        : [...prevTags, selectedOption];
    });
  };

  return (
    <LandingPageLayout>
      <FooterLayout>
        <GenericLayout heading="Blogs">
          <Flex vertical className="tw-min-h-screen tw-p-4">
            <Flex className="tw-flex-col tw-justify-items-start lg:tw-flex-row tw-my-4 tw-justify-between tw-gap-4">
              <UBUSearch
                prefix={<SearchOutlined />}
                placeholder="Search blogs..."
                onSearch={handleSearch}
                className="sm:tw-w-full lg:tw-w-[70%]"
                enterButton
              />
              {totalItems > 6 && (
                <UBUPagination
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  handlePaginationChange={handlePaginationChange}
                />
              )}
            </Flex>
            <Flex className="tw-flex-col xl:tw-flex-row tw-gap-2 xl:tw-gap-10 tw-justify-end tw-mb-2">
              {searchTags.length > 0 ? (
                <Flex className="tw-flex-wrap tw-flex-grow tw-gap-2">
                  {searchTags.map((tag, index) => (
                    <CustomTag
                      icon={
                        <CloseOutlined
                          onClick={() => handleProductChange(tag)}
                        />
                      }
                      key={index}
                      tag={tag}
                    />
                  ))}
                </Flex>
              ) : (
                <></>
              )}
              <Flex className="tw-flex-col sm:tw-flex-row tw-justify-end tw-mb-4 tw-gap-4">
                {searchTags.length > 0 ? (
                  <Button
                    onClick={() => onTagCloseClick()}
                    icon={<CloseOutlined />}
                    color="default"
                    variant="solid"
                  >
                    Clear Tags
                  </Button>
                ) : (
                  <></>
                )}
                <Popover
                  content={
                    <TagsDropDown
                      tagList={searchTags}
                      handleProductChange={handleProductChange}
                      callTagsByUserId={false}
                    />
                  }
                  placement="bottomRight"
                  arrow={false}
                >
                  <Button
                    icon={<i className="fas fa-solid fa-filter" />}
                    color="default"
                    variant="solid"
                  >
                    Tags
                  </Button>
                </Popover>
              </Flex>
            </Flex>
            {isLoading ? (
              <Flex className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-8 tw-mb-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))}
              </Flex>
            ) : blogList.length > 0 ? (
              <Flex className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-8 tw-mb-4">
                {blogList.map((blog, index) => (
                  <BlogCard
                    allowActions={ADMIN_EMAILS.includes(user?.email) ?? false}
                    key={index}
                    blog={blog}
                    handleTagClick={handleProductChange}
                    sideEffect={() => fetchBlogs()}
                  />
                ))}
              </Flex>
            ) : (
              <>
                {searchTags.length > 0 && searchTerm ? (
                  <NoData
                    isMessage
                    message={`No blog found against the search "${searchTerm}" and the selected tag(s)`}
                    noDataImageComponent={<NoBlogIcon />}
                  />
                ) : searchTags.length > 0 ? (
                  <NoData
                    isMessage
                    message={`No blog found against selected tag(s)`}
                    noDataImageComponent={<NoBlogIcon />}
                  />
                ) : searchTerm ? (
                  <NoData
                    isMessage
                    message={`No blog found against this search "${searchTerm}"`}
                    noDataImageComponent={<NoBlogIcon />}
                  />
                ) : (
                  <NoData
                    isMessage
                    message={`No blogs found`}
                    noDataImageComponent={<NoBlogIcon />}
                  />
                )}
              </>
            )}
          </Flex>
        </GenericLayout>
      </FooterLayout>
    </LandingPageLayout>
  );
};

export default DisplayBlogs;
