import PropTypes from "prop-types";
import CustomTag from "./CustomTag";
import NewEditIcon from "@src/assets/icons/NewEditIcon";
import Placeholder from "@src/assets/images/placeholder.jpg";
import BlackDeleteIcon from "@src/assets/icons/BlackDeleteIcon";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import "./BlogCard.less";

import { useState } from "react";
import { Text } from "@src/components";
import { useNavigate } from "react-router-dom";
import { Flex, Image, Spin, Tooltip } from "antd";
import { isSuccess } from "@src/utils/responseHelpers";
import { Paragraph } from "@src/components/Common/Typography";
import { showNotification } from "@src/utils/showNotification";
import { formatDateStampWithoutTime } from "@src/utils/formateData";

import {
  extractFirstImageSrc,
  extractTextFromPTags,
} from "@src/utils/formateFunctions";

const BlogCard = ({
  blog,
  sideEffect,
  handleTagClick,
  allowActions = true,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const onEditClick = (event, id) => {
    event.stopPropagation();
    navigate(`/dashboard/blogs/edit/${id}`);
  };

  const onDeleteClick = async (event, id) => {
    event.stopPropagation();
    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete(`/blog/${id}`);
      if (isSuccess(response.status)) {
        showNotification({
          notificationType: "success",
          message: "Blog Deleted Successfully",
          description: "Blog has been deleted",
        });
        sideEffect && sideEffect();
      } else {
        showNotification({
          notificationType: "error",
          message: "Something went wrong",
          description: "Blog could not be deleted",
        });
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
        description: "Blog could not be deleted",
      });
      console.error("Error deleting blog:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onCardClick = (event, id) => {
    event.stopPropagation();
    window.location.href.includes("dashboard")
      ? navigate(`/dashboard/blogs/${id}`)
      : navigate(`/blogs/${id}`);
  };

  return (
    <Flex
      onClick={(event) => onCardClick(event, blog.id)}
      className="blog-card-2 tw-relative"
      vertical
      gap={20}
    >
      {allowActions && (
        <>
          <Tooltip title="Edit">
            <div className="action-icon tw-w-8 tw-h-8 tw-absolute tw-top-3 tw-right-14">
              <NewEditIcon onClick={(e) => onEditClick(e, blog.id)} />
            </div>
          </Tooltip>

          {isDeleting ? (
            <Spin className="black-spinner tw-absolute tw-top-5 tw-right-6" />
          ) : (
            <Tooltip title="Delete">
              <div className="action-icon tw-w-8 tw-h-8 tw-absolute tw-top-3 tw-right-5 ">
                <BlackDeleteIcon onClick={(e) => onDeleteClick(e, blog.id)} />
              </div>
            </Tooltip>
          )}
        </>
      )}

      <div className="tw-flex tw-flex-col tw-gap-2">
        <Tooltip placement="topLeft" title={blog?.title}>
          <h1 className="tw-text-2xl tw-font-bold tw-w-[80%] tw-line-clamp-1">
            {blog?.title}
          </h1>
        </Tooltip>
        <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-2">
          <div className="md:tw-w-1/2 tw-w-full ">
            <Paragraph className="tw-text-base fw-500 blog-gray-text-color tw-leading-relaxed tw-line-clamp-[10] tw-tracking-wide">
              {extractTextFromPTags(blog?.description)}
            </Paragraph>
          </div>

          <div className="md:tw-w-1/2 tw-w-full tw-justify-center">
            <Image
              style={{ minHeight: "250px", width: "100%" }}
              className="card-image tw-rounded-xl tw-object-cover"
              preview={false}
              src={extractFirstImageSrc(blog?.description)}
              alt="media"
              fallback={Placeholder}
            />
          </div>
        </div>
      </div>

      <Flex className="tw-flex-col tw-justify-between tw-gap-4 tw-h-full">
        <Flex className="tw-flex-wrap tw-gap-2">
          {blog?.blogTags.map((blogTag, index) => (
            <CustomTag
              handleClick={handleTagClick}
              key={index}
              tag={blogTag.tag}
            />
          ))}
        </Flex>

        <Flex className="tw-mt-auto tw-justify-end">
          <Text className={"fs-14 fw-600 blog-gray-text-color"}>
            {formatDateStampWithoutTime(blog.updated_at)}
          </Text>{" "}
        </Flex>
      </Flex>
    </Flex>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.object,
  sideEffect: PropTypes.func,
  handleTagClick: PropTypes.func,
  allowActions: PropTypes.bool,
};

export default BlogCard;
