import React from "react";
import chatbotIcon from "@src/assets/images/chatboticon.png";

import { useChatBot } from "../Providers/ChatBotProvider/ChatBotProvider";

const ChatBotAvatar = () => {
  const { setDisplayAvatar } = useChatBot();

  return (
    <div
      onClick={() => setDisplayAvatar(false)}
      className="tw-animate-slide-in-right tw-fixed tw-bottom-8 tw-right-8 tw-z-[9999] tw-cursor-pointer"
    >
      <div className="tw-bg-white tw-border tw-border-black tw-rounded-full tw-p-1 tw-flex tw-items-center tw-justify-center tw-w-16 tw-h-16">
        <div className="tw-animate-avatar-rotate tw-bg-gray-200 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-w-full tw-h-full">
          <img className="tw-w-10 tw-h-10 tw-object-contain" src={chatbotIcon}/>
        </div>
      </div>
    </div>
  );
};

export default ChatBotAvatar;
