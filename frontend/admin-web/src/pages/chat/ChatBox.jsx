import PropTypes from 'prop-types';
import Tick from "../../assets/tick.png";
import DoubleTick from "../../assets/double-tick.png";
import NoMessageSvg from "@src/components/SVGs/NoMessageSvg";
import FileViewer from '@src/components/FileViewer';

import { formatDateStamp } from '@src/utils/formateData';
import { useEffect } from 'react';
import ChatBoxSkeleton from '@src/components/Skeletons/ChatBoxSkeleton';

import { Flex, Typography } from 'antd';
const { Text } = Typography;

const ChatBox = ({ messages, user, currentRecipient , isLoading}) => {
  if (isLoading) {
    return <ChatBoxSkeleton />;
  }

  return messages.messages?.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())?.map((msg, msgIndex) => (
    <Flex
      className={`${
        msg.sender?.id === user.id ? 'is-receiver-layout tw-animate-slide-in-right' : 'is-sender-layout tw-animate-slide-in-left'
      }`}
      key={msgIndex}
      justify="center"
      align="start"
      gap={8}
    >
    {/* {msg?.sender?.avatar && msg?.sender?.avatar != "{}"? (
      <img
        src={msg?.sender?.avatar}
        className="chat-content-img"
        alt="User Avatar"
      />) : (
      <div
        className="user-chat-header-img placeholder chat-content-img"
        aria-label={`${currentRecipient?.first_name} Avatar`}
      >
      {currentRecipient?.first_name[0].toUpperCase()}
      </div>
    )} */}
      
      <Flex vertical justify="center" align="start" gap={2} style={{
        alignItems: msg.sender?.id === user.id ? "end" : "start",
      }}>
        <Text
          className={`chat-text ${
            msg.sender?.id === user.id ? 'is-sender' : 'is-receiver'
          }`}
        >
          {msg.fileName ? (
              <FileViewer fileUrl={msg.fileUrl} />
          ) : (
            msg.message
          )}
        </Text>
        <Flex justify="space-between" align="center" className="chat-timestamp-tick" gap={2}>
          <Text className="chat-timestamp">
            {formatDateStamp(msg.timestamp)}
          </Text>
          {msg.isSeen ? (
            <img
              src={DoubleTick}
              className={` ${msg.sender?.id !== user.id && 'display-none'}`}
              alt="Seen Tick"
            />
          ) : (
            <img
              src={Tick}
              alt="Seen Tick"
              className={` ${msg.sender?.id !== user.id && 'display-none'}`}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  ));
};

ChatBox.propTypes = {
    messages: PropTypes.object,
    user: PropTypes.object,
    currentRecipient: PropTypes.object,
  };

export default ChatBox;
