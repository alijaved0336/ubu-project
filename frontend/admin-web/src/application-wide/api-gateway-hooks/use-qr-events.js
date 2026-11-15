import { useState, useEffect } from "react";
import { useSocket } from "@src/components/Providers/SocketProvider";

const useQrEvents = ({ onScan, onScanFailed }) => {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("handleQrScanSuccess", (isScanned) => {
        onScan && onScan(isScanned);
      });
      socket.on("handleQrScanFailed", (error) => {
        onScanFailed && onScanFailed(error);
      });

      return () => {
        socket.off("handleQrScanSuccess");
        socket.off("handleQrScanFailed");
      };
    }
  }, [socket, onScan, onScanFailed]);
};

export default useQrEvents;
