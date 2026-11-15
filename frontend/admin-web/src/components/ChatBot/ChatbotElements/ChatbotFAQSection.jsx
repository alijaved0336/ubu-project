import React from "react";
import FAQIcon from "@src/assets/icons/FAQIcon";

import { useChatBot } from "@src/components/Providers/ChatBotProvider/ChatBotProvider";

const ChatbotFAQSection = () => {
    const {
      handleFAQClick,
    } = useChatBot();

  const faqs = [
    "How can a creator accept a campaign?",
    "Can brands message creators via chat?",
    "What is the purpose of campaign in UBU?",
    "How can password be changed?",
  ];

  return (
    <div className="tw-px-4 tw-animate-slide-in-right">
      <h2 className="tw-text-sm tw-font-semibold tw-text-gray-700 tw-mb-2 tw-flex tw-items-center">
        <span className="tw-mr-2">
          <FAQIcon />
        </span>{" "}
        FAQs
      </h2>
      <div className="tw-flex tw-flex-wrap tw-gap-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-xl tw-px-3 tw-py-2 tw-text-sm tw-text-gray-800 tw-shadow-sm tw-max-w-xs tw-truncate tw-cursor-pointer"
            title={faq}
            onClick={() => handleFAQClick(faq)}
          >
            {faq}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatbotFAQSection;
