import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

import { useGetUserQuery } from "@src/store/api/userApi";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
const url = import.meta.env.VITE_BACKEND_API_SOCKET_URL;

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const { user} = useSelector((state) => state.auth || {});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      if (socket?.connected) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    if (!socket) {
      const socketInstance = io(`${url}chat`, {transports:["websocket"], upgrade:false,secure:true, reconnection:true});
      socketInstance.on("connect", () => {
        console.log("Connected to WebSocket server");
        socketInstance.emit("userNotificationConnected", user);
        socketInstance.emit("userChatConnected", user);
        socketInstance.emit("userCampaignConnected", user);
        setSocket(socketInstance);
      });

      socketInstance.on("disconnect", () => {
        setSocket(null);
      });
    }

    return () => {
      if (socket) {
        setSocket(null);
        socket.disconnect();
      }
    };
  }, [user, socket]);

  const value = useMemo(() => socket, [socket]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node,
};

export const useSocket = () => {
  return useContext(SocketContext) ?? null;
};

export default SocketProvider;
