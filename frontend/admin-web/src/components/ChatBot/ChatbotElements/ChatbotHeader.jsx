import React from "react";

import { useChatBot } from "@src/components/Providers/ChatBotProvider/ChatBotProvider";

import {
  CloseOutlined,
  ExpandOutlined,
  CompressOutlined,
} from "@ant-design/icons";

const ChatbotHeader = () => {
  const { setDisplayAvatar, isExpanded, toggleSize } = useChatBot();
  return (
    <div className="tw-bg-black tw-p-3 tw-flex tw-items-center tw-justify-between tw-rounded-tl-2xl tw-rounded-tr-2xl">
      <div className="tw-flex tw-items-center tw-gap-2">
        <span className="tw-text-white tw-font-bold">UBU AI Bot</span>
      </div>
      <div className="tw-flex tw-items-center tw-gap-2">
        <ExpandOutlined
          onClick={toggleSize}
          className="tw-text-white tw-text-base tw-cursor-pointer hover:tw-text-blue-300"
          style={{ display: isExpanded ? "none" : "inline" }}
        />
        <CompressOutlined
          onClick={toggleSize}
          className="tw-text-white tw-text-base tw-cursor-pointer hover:tw-text-blue-300"
          style={{ display: isExpanded ? "inline" : "none" }}
        />
        <CloseOutlined
          className="tw-text-white tw-text-base tw-cursor-pointer hover:tw-text-red-300"
          onClick={() => setDisplayAvatar(true)}
        />
      </div>
    </div>
  );
};

export default ChatbotHeader;
