import React from "react";
import "./InstagramPost.less";
import { Card, Typography, Avatar, Flex, Skeleton } from "antd";
import {
  InstagramOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import InstaUnlikeIcon from "@src/assets/icons/InstaUnlikeIcon";
import InstaCommentIcon from "@src/assets/icons/InstaCommentIcon";
import InstaShareIcon from "@src/assets/icons/InstaShareIcon";
import InstaSaveIcon from "@src/assets/icons/InstaSaveIcon";
const { Title, Paragraph } = Typography;

const InstagramPost = ({ ProfilePicture, title, image, description }) => {
  return (
    <div className="insta-preview-post tw-w-96 tw-rounded-lg tw-shadow-xl  tw-overflow-hidden tw-font-sans tw-shadow-black-muted">
      <div className="tw-flex tw-items-center tw-gap-2 tw-p-2 tw-shadow-black-muted ">
        <Avatar
          className="tw-w-10 tw-h-10"
          src={ProfilePicture}
          icon={<UserOutlined />}
        />
        <Title
          level={5}
          className="tw-m-0 tw-font-medium tw-text-base tw-font-sans"
        >
          {title || "Angelina Jolie"}
        </Title>
      </div>

      <div className="insta-preview-image tw-rounded-sm tw-overflow-hidden tw-bg-gray-200">
        {image ? (
          <img
            alt="Post"
            src={image}
            className=" tw-w-full tw-h-full tw-object-cover tw-rounded-sm"
          />
        ) : (
          <Skeleton.Image className=" insta-preview-dummy-image tw-w-full tw-h-full" />
        )}
      </div>

      <div className="tw-space-y-2 tw-p-2 ">
        <div className="tw-flex tw-justify-between">
          <div className="tw-flex tw-gap-2">
            <InstaUnlikeIcon />
            <InstaCommentIcon />
            <InstaShareIcon />{" "}
          </div>
          <div>
            <Flex className="tw-justify-end">
              <InstaSaveIcon />
            </Flex>
          </div>
        </div>

        <Paragraph
          ellipsis={{
            rows: 2,
            expandable: true,
            symbol: "more",
          }}
          className="tw-text-sm tw-leading-relaxed tw-text-gray-700"
        >
          {description}
        </Paragraph>
      </div>
    </div>
  );
};

export default InstagramPost;
