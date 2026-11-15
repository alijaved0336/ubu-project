import { useState, useEffect } from "react";
import { useSocket } from "@src/components/Providers/SocketProvider";

const useChatEvents = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [specificChat, setSpecificChat] = useState({});
  const [newChat, setNewChat] = useState(0)
  const [sendingMessage, setSendingMessage] = useState(false);
  const socket = useSocket()

  useEffect(() => {
    if (socket) {
      const handleOnlineUsers = (users) => {
        if (users?.length > 0)
          setOnlineUsers(users);
      };

      socket.on("recieveSpecificChat", handleReceiveSpecificChat);
      socket.on("onlineUsers", handleOnlineUsers);
      return () => {
        socket.off("onlineUsers", handleOnlineUsers);
        socket.off("recieveSpecificChat", handleReceiveSpecificChat);
      };
    } 
  }, [socket]);

  const handleReceiveSpecificChat = (specificChat) => {
    setSendingMessage(false);
    setSpecificChat(specificChat.specificChat);
    setNewChat(specificChat?.specificChat?.id);
  };
  const sendMessage = (
    sender,
    recipient,
    message,
    file_name = "",
    file_url = "",
    brandId,
    InfluencerId
  ) => {
    if (!socket) return;
    const messageData = {
      sender,
      recipient,
      message,
      file_name,
      file_url,
      brandId,
      InfluencerId,
    };
    setSendingMessage(true);
    socket.emit("sendMessage", messageData);
  };

  const markMessageAsSeen = (recipientId, senderId, chatId) => {
    if (socket && recipientId && chatId) {
      socket.emit("messageSeen", { recipientId, senderId, chatId });
    }
  };
  return {
    sendingMessage,
    setSendingMessage,
    onlineUsers,
    specificChat,
    allUsers,
    newChat,
    setAllUsers,
    sendMessage,
    markMessageAsSeen,
  };
};

export default useChatEvents;
