import React from "react";
import chatbotIcon from "@src/assets/images/chatboticon.png";

import { Divider } from "antd";

const ChatbotWelcomeSection = () => {
  return (
    <div className="tw-animate-slide-in-right tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-4">
      <img
        src={chatbotIcon}
        alt="Centered"
        className="tw-w-24 tw-h-24 tw-object-contain"
      />
      <p className="tw-font-bold tw-mt-2">Welcome to UBU Chatbot</p>
      <Divider />
    </div>
  );
};

export default ChatbotWelcomeSection;
