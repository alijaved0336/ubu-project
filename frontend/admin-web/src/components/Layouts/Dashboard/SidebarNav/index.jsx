import React, { useEffect, useState } from "react";
import useChatEvents from "@src/application-wide/api-gateway-hooks/use-chat-events";
import { useGetUserQuery } from "@src/store/api/userApi";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import Sider from "./Sider";
import MobileSidebarDrawer from "./MobileSidebarDrawer";
import PropTypes from "prop-types";
import { Grid } from "antd";

const SidebarNav = ({ isOpenMobileDrawer, onCloseMobileDrawer }) => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const { specificChat } = useChatEvents();
  const [unreadCount, setUnreadCount] = useState(0);
  const [allChats, setAllChats] = useState([]);

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    if (!specificChat) return;
    setAllChats((prevChats) => {
      const chatExists = prevChats.some((chat) => chat.id === specificChat.id);

      if (chatExists) {
        return prevChats.map((chat) =>
          chat.id === specificChat.id ? specificChat : chat
        );
      } else {
        return [...prevChats, specificChat];
      }
    });
  }, [specificChat]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user.id) return;
      try {
        const response = await axiosInstance.get(`/chats/${user.id}`);
        setAllChats(response.data.userChats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchChats();
  }, [user]);

  useEffect(() => {
    if (!allChats || !user?.id) return;
    let unreadCountTemp = 0;

    allChats.forEach((chat) => {
      if (!chat.communicators) return;
      chat.communicators.forEach((communicator) => {
        if (communicator?.user?.id === user.id) {
          chat.messages.forEach((message) => {
            if (!message.isSeen && message.sender?.id !== user.id) {
              unreadCountTemp++;
            }
          });
        }
      });
    });
    setUnreadCount(unreadCountTemp);
  }, [allChats, user]);

  return (
    <>
      {isMobile ? (
        <MobileSidebarDrawer
          isOpen={isOpenMobileDrawer}
          onClose={onCloseMobileDrawer}
          unreadCount={unreadCount}
          user={user}
        />
      ) : (
        <Sider unreadCount={unreadCount} user={user} />
      )}
    </>
  );
};

SidebarNav.propTypes = {
  isOpenMobileDrawer: PropTypes.bool,
  onCloseMobileDrawer: PropTypes.func,
};

export default SidebarNav;
