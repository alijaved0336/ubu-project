import PropTypes from "prop-types";

import { useGetUserQuery } from "@src/store/api/userApi";
import { showNotification } from "@src/utils/showNotification";
import { useSocket } from "../ChatBotSocketProvider/ChatBotSocketProvider";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ChatBotContext = createContext();

const ChatBotProvider = ({ children }) => {
  const [displayAvatar, setDisplayAvatar] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const { socket, receivedContent } = useSocket();

  const toggleSize = useCallback(() => setIsExpanded((prev) => !prev), []);

  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  useEffect(() => {
    if (!receivedContent) return;
    if (receivedContent.type === "stream") {
      setMessages((prev) => {
        if (prev.length === 0) return prev;

        const updated = [...prev];
        const last = updated[updated.length - 1];

        const newContent = receivedContent.content;

        updated[updated.length - 1] = {
          ...last,
          message:
            last.message === "Generating..."
              ? newContent
              : (last.message || "") + newContent,
        };

        return updated;
      });
    }
    if (receivedContent.type === "stream_complete") {
      setIsStreaming(false);
    }
  }, [receivedContent]);

  const sendMessage = useCallback(
    (payload) => {
      if (socket) {
        socket.send(JSON.stringify(payload));
      } else {
        console.warn("WebSocket is not connected. Cannot send message.");
      }
    },
    [socket]
  );

  const sendChatMessage = useCallback(
    (message) => {
      if (!socket) {
        showNotification({
          placement: "topRight",
          notificationType: "error",
          message: "Service Unavailable",
          description: "Please try again later",
        });
        return;
      }

      setMessages((prev) => [
        ...prev,
        { from: "user", message },
        { from: "bot", message: "Generating..." },
      ]);

      setQuery("");
      setIsStreaming(true);

      // console.log({
      //   message,
      //   stream: true,
      //   user_role: user.type,
      //   user_id: user.id,
      // })
      sendMessage({
        message,
        stream: true,
        user_role: user.type,
        user_id: user.id,
      });
    },
    [sendMessage, socket, user]
  );

  const handleFAQClick = useCallback(
    (faq) => {
      sendChatMessage(faq);
    },
    [sendChatMessage]
  );

  const handleMessageSend = useCallback(() => {
    if (query.trim() === "") return;
    sendChatMessage(query);
  }, [query, sendChatMessage]);

  const value = useMemo(
    () => ({
      displayAvatar,
      setDisplayAvatar,
      messages,
      isExpanded,
      toggleSize,
      sendMessage,
      isStreaming,
      query,
      setQuery,
      handleMessageSend,
      user,
      handleFAQClick,
    }),
    [
      displayAvatar,
      setDisplayAvatar,
      messages,
      isExpanded,
      toggleSize,
      sendMessage,
      query,
      isStreaming,
      setQuery,
      handleMessageSend,
      user,
      handleFAQClick,
    ]
  );

  return (
    <ChatBotContext.Provider value={value}>{children}</ChatBotContext.Provider>
  );
};

ChatBotProvider.propTypes = {
  children: PropTypes.node,
};

export const useChatBot = () => {
  return useContext(ChatBotContext) ?? {};
};

export default ChatBotProvider;
