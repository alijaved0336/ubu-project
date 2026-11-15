import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const wsUrl = "wss://ubuai.ubu.live:444/ws";

const SocketContext = createContext();

const ChatBotSocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth || {});
  const [receivedContent, setReceivedContent] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    if (!user || Object.keys(user).length === 0) {
      setSocket(null);
      return;
    }

    ws.onopen = () => {
      setSocket(ws);
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      // console.log("📨 Received message:", event.data);
      const parsed = JSON.parse(event.data);
      setReceivedContent(parsed);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setSocket(null);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }, [user]);

  const value = useMemo(
    () => ({ socket, receivedContent }),
    [socket, receivedContent]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

ChatBotSocketProvider.propTypes = {
  children: PropTypes.node,
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export default ChatBotSocketProvider;
