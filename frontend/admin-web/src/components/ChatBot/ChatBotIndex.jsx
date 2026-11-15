import React from "react";
import ChatBotInterface from "./ChatBoxInterface";
import ChatBotProvider from "../Providers/ChatBotProvider/ChatBotProvider";
import ChatBotSocketProvider from "../Providers/ChatBotSocketProvider/ChatBotSocketProvider";

const ChatBotIndex = () => {
  return (
    <ChatBotSocketProvider>
      <ChatBotProvider>
        <ChatBotInterface />
      </ChatBotProvider>
    </ChatBotSocketProvider>
  );
};

export default ChatBotIndex;
