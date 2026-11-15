import BlogCard from "./BlogCard";
import CustomTag from "./CustomTag";
import TagsDropDown from "./TagsDropDown";
import NoData from "@src/components/NoData";
import NoBlogIcon from "@src/assets/icons/NoBlogsIcon";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import BlogCardSkeleton from "@src/components/Skeletons/BlogCardSkeleton";
import "./index.less";

import { Button, Flex, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Heading } from "@src/components/Common/Typography";
import { showNotification } from "@src/utils/showNotification";
import { CustomButton, UBUPagination, UBUSearch } from "@src/components";
import { CloseOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

const BlogsList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [blogList, setBlogList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTags, setSearchTags] = useState([]);
  const navigate = useNavigate();

  const onTagCloseClick = () => {
    setCurrentPage(1);
    setSearchTags([]);
  };

  const handlePaginationChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);
    setItemsPerPage(pageSize);
  };

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchTagsQueryParams = searchTags
        .map((tag) => `tags=${tag.id}`)
        .join("&");
      const apiUrl = `/blog?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&${searchTagsQueryParams}`;
      const res = await axiosInstance.get(apiUrl);
      if (res.data.success) {
        setBlogList(res.data.data);
        setTotalItems(res.data.total);
      }
    } catch (error) {
      console.error(error);
      showNotification({
        notificationType: "error",
        message: `Something went wrong`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, searchTags]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = (value) => {
    setCurrentPage(1);
    setTotalItems(0);
    setSearchTerm(value);
  };

  const handleBlogTagClick = (selectedOption, event) => {
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
    <>
      <div>
        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            {
              title: "Blogs",
            },
          ]}
        />
        <Heading level={2} className="tw-font-manrope tw-font-semibold">
          Blogs
        </Heading>
        <Flex className="tw-flex-col lg:tw-flex-row tw-justify-items-start tw-my-4 tw-justify-between tw-gap-4">
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
        <Flex className="tw-flex-col xl:tw-flex-row tw-gap-2 xl:tw-gap-10 tw-justify-end">
          {searchTags.length > 0 ? (
            <Flex className="tw-flex-wrap tw-flex-grow tw-gap-2">
              {searchTags.map((tag, index) => (
                <CustomTag
                  icon={
                    <CloseOutlined onClick={() => handleBlogTagClick(tag)} />
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
            <CustomButton
              icon={<PlusOutlined />}
              onClick={() => navigate("/dashboard/blogs/create")}
              className="gray-color fs-14 fw-600"
            >
              Create Blog
            </CustomButton>

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
                  handleProductChange={handleBlogTagClick}
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
      </div>
      {isLoading ? (
        <Flex className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-8 tw-my-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </Flex>
      ) : blogList.length > 0 ? (
        <Flex className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-8 tw-my-4">
          {blogList.map((blog, index) => (
            <BlogCard
              key={index}
              blog={blog}
              handleTagClick={handleBlogTagClick}
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
              componentName="blog"
              onClick={() => navigate("/dashboard/blogs/create")}
              isMessage={false}
            />
          )}
        </>
      )}
    </>
  );
};

export default BlogsList;
