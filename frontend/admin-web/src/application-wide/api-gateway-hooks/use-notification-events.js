import { useState, useEffect } from "react";
import { useSocket } from "@src/components/Providers/SocketProvider";

const useNotificationEvents= () => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    if (socket) {
      socket.on("availableNotifications", handleNotifications);

      return () => {
        socket.off("availableNotifications");
      };
    }
  }, [socket]);

  const handleNotifications = (allNotifications) => {
    allNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
    setNotifications(allNotifications);
  };

  const pushNotification = (
    sender,
    recipient,
    content,
    type,
    senderType,
    receiverType,
    receiverCheck,
    campaignId,
    currentNotification,
    chatId
  ) => {
    if (!socket) return;
    const notificationData = {
      sender,
      recipient,
      content,
      type,
      senderType,
      receiverType,
      receiverCheck,
      campaignId,
      currentNotification,
      chatId,
    };
    socket.emit("pushNotification", notificationData);
  };

  const markNotificationAsSeen = (notificationList) => {
    if (socket) {
      socket.emit("notificationSeen", { notificationList });
    }
  };
  return {
    markNotificationAsSeen,
    notifications,
    setNotifications,
    pushNotification,
  };
};

export default useNotificationEvents;
