import { useState, useEffect } from "react";
import { useSocket } from "@src/components/Providers/SocketProvider";

const useCampaignEvents = (user) => {
  const [updatedCampaign, setUpdatedCampaign] = useState({});
  const socket = useSocket()

  useEffect(() => {
    if (socket) {
    socket.on("updatedCampaignStatus", handleUpdateCampaign);

      return () => {
        socket.off("updatedCampaignStatus", handleUpdateCampaign);
      };
    }
  }, [socket, user]);

  const handleUpdateCampaign = (updatedCampaign) => {
    setUpdatedCampaign(updatedCampaign);
  };

  const updateCampaignStatusTrigger = (campaign_id) => {
    socket.emit("updateCampaignStatusTrigger", { campaign_id: campaign_id });
  };

  return {
    updatedCampaign,
    updateCampaignStatusTrigger,
  };
};

export default useCampaignEvents;
