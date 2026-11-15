import ChatbotHeader from "./ChatbotElements/ChatbotHeader";
import ChatbotMessages from "./ChatbotElements/ChatbotMessages";
import SearchSection from "./ChatbotElements/ChatBotSearchSection";
import ChatbotFAQSection from "./ChatbotElements/ChatbotFAQSection";
import ChatbotWelcomeSection from "./ChatbotElements/ChatbotWelcomeSection";

import { Card } from "antd";
import React, { useRef, useEffect } from "react";
import { useChatBot } from "../Providers/ChatBotProvider/ChatBotProvider";

const ChatBot = () => {
  const bottomRef = useRef(null);
  const { messages, isExpanded } = useChatBot();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
    className={`tw-fixed tw-transition-all tw-duration-300 tw-ease-in-out tw-animate-slide-in-right sm:tw-right-8 sm:tw-bottom-8 tw-bottom-2 tw-right-2 tw-z-[9999] tw-rounded-2xl tw-shadow-lg
      ${isExpanded
        ? "tw-w-[90%] tw-h-[90%] sm:tw-w-[80%] sm:tw-h-[80%] md:tw-w-[70%] md:tw-h-[80%] lg:tw-w-[50%] lg:tw-h-[80%]"
        : "tw-w-[90%] tw-h-[60%] sm:tw-w-[60%] sm:tw-h-[55%] md:tw-w-[45%] md:tw-h-[60%] lg:tw-w-[20%] lg:tw-h-[60%]"
      }`}
  >
      <Card
        className="tw-w-full tw-h-full tw-rounded-2xl tw-shadow-lg tw-p-0"
        bodyStyle={{
          padding: "0px",
          height: "100%",
        }}
      >
        <div className="tw-flex tw-flex-col tw-rounded-2xl tw-h-full tw-bg-gray-50">
          <ChatbotHeader />
          <div className="tw-flex-1 tw-flex tw-flex-col tw-gap-2 tw-overflow-y-auto scrollbar-hidden tw-mt-2 tw-p-2">
            {messages.length === 0 ? (
              <>
                <ChatbotWelcomeSection />
                <ChatbotFAQSection />
              </>
            ) : (
              <>
                <ChatbotWelcomeSection />
                <ChatbotMessages />
              </>
            )}
            <div ref={bottomRef} />
          </div>
          <SearchSection />
        </div>
      </Card>
    </div>
  );
};

export default ChatBot;
