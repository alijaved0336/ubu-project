import ThreeDotIcon from "../../assets/three-dot-icon.png";
import PlusIcon from "../../assets/plus-icon.png";
import useS3Upload from "../../application-wide/api-gateway-hooks/use-s3-bucket";
import ChatBox from "./ChatBox";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import "./ChatWrapper.less";
import { Button, Divider, Flex, Input, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetUserQuery } from "@src/store/api/userApi";
import { getUserType } from "@src/utils/commonFunctions";
import { useParams } from "react-router-dom";
import useNotificationEvents from "@src/application-wide/api-gateway-hooks/use-notification-events";
import useChatEvents from "@src/application-wide/api-gateway-hooks/use-chat-events";
const ChatWrapper = () => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [inputMessage, setInputMessage] = useState("");
  const {
    specificChat,
    sendMessage,
    markMessageAsSeen,
    sendingMessage,
    setSendingMessage,
  } = useChatEvents()
  const { pushNotification } = useNotificationEvents()
  const [isLoading, setisLoading] = useState(false);
  const [currentMessages, setCurrentMessages] = useState({});
  const [currentMessageSender, setCurrentMessageSender] = useState(null);
  const { chat_id } = useParams();

  useEffect(() => {
    const fetchChat = async () => {
      if (chat_id) {
        try {
          setCurrentMessageSender();
          setisLoading(true);
          const response = await axiosInstance.get(`/chats/chat/${chat_id}`);
          setCurrentMessages(response?.data);
          const communicators = response?.data?.communicators;
          const sender =
            communicators[0].user.id === user.id
              ? communicators[1].user
              : communicators[0].user;
          setCurrentMessageSender(sender);
          setisLoading(false);
        } catch (error) {
          console.error("Unable to fetch chat", error);
        }
      }
    };

    fetchChat();
  }, [chat_id,user.id]);

  useEffect(() => {
    if (!specificChat || Object.keys(specificChat).length === 0) return;
    const communicators = specificChat?.communicators;
    const sender =
      communicators[0].user.id == user.id
        ? communicators[1].user
        : communicators[0].user;
    if (sender?.id == currentMessageSender?.id) {
      setCurrentMessages(specificChat);
      setCurrentMessageSender(sender);
    }
  }, [specificChat, user.id,currentMessageSender]);

  const { uploadFile } = useS3Upload();

  const handleFileChange = async (event) => {
    await Promise.all(
      Array.from(event.target.files).map(async (file) => {
        setSendingMessage(true);
        const result = await uploadFile(file);
        if (result) {
          sendMessage(user, currentMessageSender, "", result.key, result.url);
        }
      })
    );
  };

  useEffect(() => {
    if (!Array.isArray(currentMessages?.messages)) {
      return;
    }

    const isSeen = Array.isArray(currentMessages)
      ? false
      : currentMessages?.messages.some(
          (msg) => msg.isSeen == false && msg.sender.id != user.id
        );
    if (currentMessageSender && isSeen) {
      markMessageAsSeen(currentMessageSender?.id, user.id, currentMessages?.id);
    }
  }, [currentMessages,currentMessageSender,markMessageAsSeen,user.id]);

  const handleSend = useCallback(() => {
    if (inputMessage && currentMessageSender && inputMessage.trim() !== "" ) {
      sendMessage(user, currentMessageSender, inputMessage);
      pushNotification(
        user.id,
        currentMessageSender.id,
        `${user.first_name + " " + user.last_name + " "}Messaged You`,
        "REQUEST",
        getUserType(user),
        getUserType(currentMessageSender),
        "",
        "",
        "",
        currentMessages.id
      );
      setInputMessage("");
    }
  }, [
    inputMessage,
  ]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentMessages]);

  return (
    <Flex className="chat-box-container">
      <Flex className="chat-container" vertical gap={8}>
        <Flex
          className="user-chat-header"
          justify="space-between"
          align="center"
          gap={16}
        >
          <Flex gap={8} justify="center" align="center">
            {currentMessageSender && (
              <>
                {currentMessageSender?.avatar && currentMessageSender?.avatar != "{}" ? (
                  <img
                    src={currentMessageSender?.avatar}
                    className="user-chat-header-img"
                    alt={`${currentMessageSender?.first_name} Avatar`}
                  />
                ) : (
                  <div
                    className="user-chat-header-img placeholder"
                    alt={`${currentMessageSender?.first_name} Avatar`}
                  >
                    {currentMessageSender?.first_name[0]?.toUpperCase()}
                  </div>
                )}
                <Typography className="user-chat-header-text">
                  {currentMessageSender?.first_name}{" "}
                  {currentMessageSender?.last_name}
                </Typography>
              </>
            )}
          </Flex>
          <Flex
            gap={8}
            className={`${currentMessageSender ? "" : "remove-child"}`}
            justify="center"
            align="center"
          >
            {/* {currentRecipient && (
                <Button
                  className="user-chat-header-btn1"
                  onClick={handleCreateContract}
                >
                  Create Contract
                </Button>
              )} */}
            <Button
              className="user-chat-header-btn2"
              icon={<img src={ThreeDotIcon} alt="Options" />}
            />
          </Flex>
        </Flex>
        <Divider className="user-chat-divider" />
        <Flex className="user-chat-content" ref={chatContainerRef}>
          <Flex
            className="chat-container"
            vertical
            gap={16}
            justify="start"
            align="start"
          >
            <ChatBox
              messages={currentMessages}
              user={user}
              currentRecipient={currentMessageSender}
              isLoading={isLoading}
            />
          </Flex>
        </Flex>
        <Divider className="user-chat-divider" />
        <Flex
          vertical
          className="user-chat-footer"
          gap={16}
          justify="center"
          align="start"
        >
          {currentMessageSender && (
            <Flex
              className="chat-input-container tw-animate-slide-in-bottom"
              justify="center"
              align="center"
              gap={8}
            >
              <Flex
                className="add-btn"
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: "pointer" }}
              >
                <img src={PlusIcon} alt="Upload" />
                <input
                  type="file"
                  className="file-uploader"
                  multiple
                  style={{ display: "none" }}
                  onChange={(event) => handleFileChange(event)}
                  ref={fileInputRef}
                />
              </Flex>
              <Input
                className="chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Type message..."
              />
              <Button
                loading={sendingMessage}
                className="send-btn"
                onClick={handleSend}
              >
                Send
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChatWrapper;
