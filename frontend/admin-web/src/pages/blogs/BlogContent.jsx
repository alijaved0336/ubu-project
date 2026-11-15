import PropTypes from "prop-types";
import CustomTag from "./CustomTag";
import SmallLoader from "@src/components/SmallLoader";
import "./ViewBlog.less";

import { Flex } from "antd";

const BlogContent = ({ blog, postLoading }) => {
  return (
    <div className="view-blog-page tw-my-8">
      <div className="view-blog-section tw-min-h-screen">
        {postLoading ? (
          <Flex className="tw-items-center tw-justify-center">
            <SmallLoader />
          </Flex>
        ) : (
          <>
            <h1 className="tw-font-manrope tw-font-extrabold tw-text-center tw-mb-4 tw-text-[2.625rem]">
              {blog?.title}
            </h1>
            <div
              className="tw-w-full view-blog-div"
              dangerouslySetInnerHTML={{ __html: blog?.description }}
            />
            <Flex className="tw-flex-wrap tw-gap-2 tw-mt-4">
              {blog?.blogTags?.map((blogTag, index) => (
                <CustomTag key={index} tag={blogTag.tag} />
              ))}
            </Flex>
          </>
        )}
      </div>
    </div>
  );
};

BlogContent.propTypes = {
  blog: PropTypes.object,
  postLoading: PropTypes.bool,
};

export default BlogContent;
