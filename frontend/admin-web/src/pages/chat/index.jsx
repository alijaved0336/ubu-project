import UsersList from "./UsersList";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import "./ChatContainer.less";
import { Flex } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { useGetUserQuery } from "@src/store/api/userApi";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import { Outlet, useNavigate } from "react-router-dom";
import useChatEvents from "@src/application-wide/api-gateway-hooks/use-chat-events";

const ChatContainer = () => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });
  const [searchUser, setSearchUser] = useState("");
  const {
    onlineUsers,
    specificChat,
    markMessageAsSeen,
  } = useChatEvents()
  const [userList, setUserList] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [users, setUsers] = useState(userList);
  const [isLoading, setisLoading] = useState(false);
  const [currentMessageSender, setCurrentMessageSender] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const findAllChatsByUserId = async () => {
      if (!user.id) return;
      try {
        setisLoading(true);
        const response = await axiosInstance.get(`/chats/${user.id}`);
        setUserList(response.data.chatUsers);
        setAllChats(response.data.userChats);
        setisLoading(false);
      } catch (error) {
        setisLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    findAllChatsByUserId();
  }, [user]);

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
    const updatedList = userList.map((u) => {
      let unreadMessagesCount = 0;

      allChats.forEach((chat) => {
        chat.communicators.forEach((communicator) => {
          if (communicator.user.id === u.id) {
            chat.messages.forEach((message) => {
              if (!message.isSeen && message.sender.id !== user.id) {
                unreadMessagesCount += 1;
              }
            });
          }
        });
      });

      return { ...u, unreadMessagesCount };
    });

    setUserList(updatedList);

    if (!allChats || !currentMessageSender) return;
  }, [allChats]);

  const handleUserClick = useCallback(
    async (selectedUser) => {
      if (selectedUser && user) {
        await setCurrentMessageSender(selectedUser);
        const existingChat = allChats.find(
          (chat) =>
            chat?.communicators?.some((u) => u?.user?.id === selectedUser.id) &&
            chat?.communicators?.some((u) => u?.user?.id === user.id)
        );
        const isSeen = Array.isArray(existingChat)
          ? false
          : existingChat?.messages.some(
              (msg) => msg.isSeen == false && msg.sender.id != user.id
            );
        if (selectedUser && isSeen) {
          markMessageAsSeen(selectedUser?.id, user.id, existingChat?.id);
        }
        navigate(`/dashboard/chats/${existingChat?.id}/chat-wrapper`);
      }
    },
    [allChats, user, markMessageAsSeen,navigate]
  );

  useDebounce(
    () => {
      if (searchUser !== "") {
        setUsers(
          userList.filter((user) =>
            user?.first_name?.toLowerCase().includes(searchUser?.toLowerCase())
          )
        );
      } else {
        setUsers(userList);
      }
    },
    300,
    [searchUser, userList]
  );

  const handleSearchUser = useCallback((e) => {
    setSearchUser(e.target.value);
  }, []);

  return (
    <Flex className="chat-parent">
      <UBUBreadCrumb items={[{ title: "Dashboard" }, { title: "Chats" }]} />
      <Flex className="chat-users-container" justify="start" align="start">
        <UsersList
          users={users}
          onlineUsers={onlineUsers}
          searchUser={searchUser}
          handleSearchUser={handleSearchUser}
          handleUserClick={handleUserClick}
          isLoading={isLoading}
        />
      </Flex>
      <Flex className="chat-box-container">
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default ChatContainer;
