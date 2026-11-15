import PropTypes from 'prop-types';
import SearchIcon from "../../assets/search-icon-gray.png";
import ChatUserSkeleton from '@src/components/Skeletons/ChatUserSkeleton';

import { Flex, Input, Typography } from "antd";

const { Text } = Typography;

const UsersList = ({ users, onlineUsers, searchUser, handleSearchUser, handleUserClick, isLoading }) => {
  return (
    <Flex className="users-container" justify="start" align="start" vertical gap={16}>
      <Input
        className="search-users-input"
        value={searchUser}
        onChange={handleSearchUser}
        placeholder="Search..."
        prefix={<img src={SearchIcon} alt="Search" />}
      />
      <Text className="search-users-text">DIRECT MESSAGES</Text>
      <Flex className="users-list" vertical gap={8}>
      {isLoading ? (
        <ChatUserSkeleton />
        ) : (
          // Show users list when not loading
          users?.map((value, index) => (
            <Flex
              key={index}
              className="user tw-animate-slide-in-bottom"
              justify="start"
              align="center"
              gap={8}
              onClick={() => handleUserClick(value)}
            >
              <Flex gap={8} justify="center" align="center">
                {value.avatar && value.avatar != "{}"? (
                  <img
                    src={value.avatar}
                    className={`user-img ${
                      onlineUsers.some((us) => us.id === value.id)
                        ? 'is-user-active'
                        : 'is-user-inactive'
                    }`}
                    alt={`${value.first_name} Avatar`}
                  />
                ) : (
                  <div
                    className={`user-img placeholder ${
                      onlineUsers.some((us) => us.id === value.id)
                        ? 'is-user-active'
                        : 'is-user-inactive'
                    }`}
                    alt={`${value.first_name} Avatar`}
                  >
                    {value?.first_name && value?.first_name[0].toUpperCase()}
                  </div>
                )}
              </Flex>
              <Flex gap={8} justify="space-between" align="center" style={{ width: '100%' }}>
                <Text className="user-text">{value.is_deleted? `${value.first_name} (in-active)` : value.first_name}</Text>
                {value?.unreadMessagesCount === 0 ? <></> : <Text className="user-unread-msg">{value?.unreadMessagesCount}</Text>}
              </Flex>
            </Flex>
          ))
        )}
      </Flex>
    </Flex>
  );
};

UsersList.propTypes = {
  users: PropTypes.array,
  onlineUsers: PropTypes.array,
  searchUser: PropTypes.string,
  handleSearchUser: PropTypes.func,
  handleUserClick: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default UsersList;
