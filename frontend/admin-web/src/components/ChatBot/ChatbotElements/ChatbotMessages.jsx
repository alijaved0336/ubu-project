import React from "react";
import chatbotIcon from "@src/assets/images/chatboticon.png";

import { Avatar } from "antd";
import { useChatBot } from "@src/components/Providers/ChatBotProvider/ChatBotProvider";


const ChatbotMessages = () => {
  const { messages, user } = useChatBot();

  return (
    <>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`tw-flex tw-items-start tw-gap-2 tw-my-1 ${
            msg.from === "bot" ? "tw-justify-start" : "tw-justify-end"
          }`}
        >
          {msg.from === "bot" && (
            <div className="tw-w-8 tw-h-8 tw-border tw-bg-gray-50 tw-rounded-full tw-flex tw-items-center tw-justify-center">
              <Avatar className="tw-w-6 tw-h-6" src={chatbotIcon} />
            </div>
          )}

          <div
            className={`tw-whitespace-pre-line tw-break-words tw-max-w-[80%] tw-px-3 tw-py-2 tw-text-sm ${
              msg.from === "bot"
                ? "tw-bg-gray-100 tw-self-start tw-animate-slide-in-right tw-rounded-bl-xl tw-rounded-br-xl tw-rounded-tr-xl"
                : "tw-bg-black tw-text-white tw-self-end tw-animate-slide-in-left tw-rounded-bl-xl tw-rounded-br-xl tw-rounded-tl-xl"
            }`}
          >
            {msg.message !== "Generating..." ? (
              msg.message
            ) : (
              <span className="tw-inline-flex tw-gap-1">
                <span className="tw-w-2 tw-h-2 tw-bg-gray-500 tw-rounded-full tw-animate-typing-dot tw-delay-0"></span>
                <span className="tw-w-2 tw-h-2 tw-bg-gray-500 tw-rounded-full tw-animate-typing-dot tw-delay-150"></span>
                <span className="tw-w-2 tw-h-2 tw-bg-gray-500 tw-rounded-full tw-animate-typing-dot tw-delay-300"></span>
              </span>
            )}
          </div>

          {msg.from !== "bot" && <Avatar src={user.avatar} />}
        </div>
      ))}
    </>
  );
};

export default ChatbotMessages;
