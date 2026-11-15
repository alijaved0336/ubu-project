import React from "react";
import ChatBot from "./ChatBot";
import ChatBotAvatar from "./ChatBotAvatar";

import { useChatBot } from "../Providers/ChatBotProvider/ChatBotProvider";

const ChatBoxInterface = () => {
  const { displayAvatar } = useChatBot();
  return (
    <>
      {displayAvatar && <ChatBotAvatar />}
      {!displayAvatar && <ChatBot />}
    </>
  );
};

export default ChatBoxInterface;
