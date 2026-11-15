import React from "react";
import SendButtonIcon from "@src/assets/icons/SendButtonIcon";

import { useChatBot } from "@src/components/Providers/ChatBotProvider/ChatBotProvider";

const ChatbotSearchSection = () => {
  const { handleMessageSend, query, setQuery, isStreaming } = useChatBot();
  return (
    <div className="tw-px-2 tw-mb-4">
      <div
        style={{ boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.2)" }}
        className="tw-flex tw-items-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-full tw-pr-1 tw-pl-2 tw-py-2 tw-w-full tw-h-10"
      >
        <input
          type="text"
          disabled={isStreaming}
          placeholder="Type your text here ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleMessageSend();
            }
          }}
          className="tw-flex-1 tw-bg-transparent tw-border-none tw-outline-none tw-text-gray-700 placeholder:tw-text-gray-400 tw-pr-2"
        />
        <button
          onClick={() => !isStreaming && handleMessageSend()}
          className="tw-w-8 tw-h-8 tw-bg-black tw-rounded-full tw-flex tw-items-center tw-justify-center hover:tw-bg-gray-500"
          disabled={isStreaming}
        >
          <SendButtonIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatbotSearchSection;
