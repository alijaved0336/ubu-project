import { useEffect, useState } from "react";
import {
  Tabs,
  Avatar,
  Typography,
  List,
  Space,
  message,
  Flex,
  Badge,
} from "antd";
import { Button } from "@src/components/Common/Widgets";
import { CloseIcon } from "@src/assets/icons";
import { UBUSearch, UBUPagination } from "@src/components";
import "./Notifications.less";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from "@src/store/api/userApi";
import useUpdateCampaignStatus from "@src/application-wide/api-gateway-hooks/use-update-campaign-status";
import { SearchOutlined } from "@ant-design/icons";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import useNotificationEvents from "@src/application-wide/api-gateway-hooks/use-notification-events";
import useCampaignEvents from "@src/application-wide/api-gateway-hooks/use-campaign-events";
import useChatEvents from "@src/application-wide/api-gateway-hooks/use-chat-events";
import { useConnectedAccount } from "@src/components/Providers/ConnectedAccountProvider";
import { connectedAccountStatuses } from "@src/utils/constant";
import AccountCreationModal from "@src/components/Campaign/CampaignPayment/AccountCreationModal";
import AccountCompletionModal from "@src/components/Campaign/CampaignPayment/AccountCompletionModal";

const { TabPane } = Tabs;
const { Text } = Typography;
const NotificationsPage = () => {
  const { updateCampaignStatusTrigger } = useCampaignEvents();
  const { pushNotification } = useNotificationEvents();
  const [currentPage, setCurrentPage] = useState(1);

  const [isOpenAccountCreationModal, setIsOpenAccountCreationModal] =
    useState(false);

  const [isOpenAccountCompletionModal, setIsOpenAccountCompletionModal] =
    useState(false);

  const [isMainLoading, setIsMainLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const { sendMessage, newChat } = useChatEvents();
  const [loadingStates, setLoadingStates] = useState({});
  const {
    isComplete: isAccountCreated,
    status: currentAccountStatus,
    isLoadingConnectedAccountDetails,
    accountStatusMessage,
  } = useConnectedAccount();

  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });
  const { loading: isSubmitCampaignLoading, onUpdateCampaignStatus } =
    useUpdateCampaignStatus();

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage, searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCreateAccount = (notification) => {
    if (isAccountCreated) {
      handleAccept(notification);
    } else if (currentAccountStatus === connectedAccountStatuses.IN_ACTIVE) {
      setIsOpenAccountCreationModal(true);
    } else {
      setIsOpenAccountCompletionModal(true);
    }
  };
  const handlePaginationChange = async (pageNumber, pageSize) => {
    await setSearchTerm("");
    setCurrentPage(pageNumber);
    setItemsPerPage(pageSize);
  };

  const handleBack = () => {
    user["type"] === "brand"
      ? navigate("/dashboard/segments")
      : navigate("/dashboard/posts");
  };

  const fetchData = async () => {
    setIsMainLoading(true);
    const apiUrl = `/notifications?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`;
    try {
      const response = await axiosInstance.get(apiUrl);
      setNotifications(response.data.notifications);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error in fetching segments. Please try again.");
    } finally {
      setIsMainLoading(false);
    }
  };

  const handleAccept = async (notification) => {
    const notificationId = notification.id;
    setLoadingStates((prev) => ({
      ...prev,
      [`accept-${notificationId}`]: true,
    }));
    try {
      const res = await onUpdateCampaignStatus(
        notification.campaign.id,
        "accepted"
      );
      if (res.status === 200) {
        message.success("Campaign Accepted Successfully!");
        fetchData();
        updateCampaignStatusTrigger(notification.campaign.id);
        sendMessage(
          res.data.influencer.user,
          res.data.brand.user,
          "Hi! I am interested."
        );
        pushNotification(
          0,
          notification.campaign.id,
          `${user.first_name + " " + user.last_name} accepted the campaign`,
          "ACCEPTED",
          "influencer",
          "brand",
          "campaign",
          notification.campaign.id,
          notification.id
        );
      } else {
        message.error(
          `Campaign Acceptance Failed:, ${res?.response?.data?.message}`
        );
        setLoadingStates((prev) => ({
          ...prev,
          [`accept-${notificationId}`]: false,
        }));
      }
    } catch (error) {
      console.log("error", error.message);
      message.error(`Completion Failed: ${error.message}`);
      setLoadingStates((prev) => ({
        ...prev,
        [`accept-${notificationId}`]: false,
      }));
    } 
  };
  const handleReject = async (notification) => {
    const notificationId = notification.id;
    setLoadingStates((prev) => ({
      ...prev,
      [`reject-${notificationId}`]: true,
    }));
    try {
     const res =  await onUpdateCampaignStatus(notification.campaign.id, "rejected");
      message.success("Campaign Rejected Successfully!");
      if (res.status === 200) {
        updateCampaignStatusTrigger(notification.campaign.id);
        fetchData();
        pushNotification(
          0,
          notification.campaign.id,
          `${user.first_name + " " + user.last_name} rejected the campaign`,
          "REJECTED",
          "influencer",
          "brand",
          "campaign",
          notification.campaign.id,
          notification.id
        );
      } else {
        message.error(
          `Campaign Rejection Failed:, ${res?.response?.data?.message}`
        );
        setLoadingStates((prev) => ({
          ...prev,
          [`reject-${notificationId}`]: false,
        }));
      }
    } catch (error) {
      message.error(`Completion Failed: ${error.message}`);
      setLoadingStates((prev) => ({
        ...prev,
        [`reject-${notificationId}`]: false,
      }));
    } 
    
  };

  useEffect(() => {
    if (newChat != 0) {
      navigate(`/dashboard/chats/${newChat}/chat-wrapper`);
    }
  }, [newChat, navigate]);
  const dataLoading = isLoadingConnectedAccountDetails || isMainLoading;
  return (
    <Flex
      vertical
      justify="center"
      align="center"
      className="not-parent"
      gap={32}
    >
      {isOpenAccountCreationModal && (
        <AccountCreationModal
          isOpen={isOpenAccountCreationModal}
          onCancel={() => setIsOpenAccountCreationModal(false)}
          onConfirm={() => setIsOpenAccountCreationModal(false)}
        />
      )}

      {isOpenAccountCompletionModal && (
        <AccountCompletionModal
          isOpen={isOpenAccountCompletionModal}
          message={accountStatusMessage}
          onCancel={() => setIsOpenAccountCompletionModal(false)}
          onConfirm={() => setIsOpenAccountCompletionModal(false)}
        />
      )}
      <Flex justify="space-between" className="not-header" align="center">
        <Text className="not-header-text">Notifications</Text>
        <Button onClick={handleBack} className="not-header-btn">
          <CloseIcon width="14" height="14" color="white" />
        </Button>
      </Flex>
      <div className="notification-controls">
        <div className="search-bar-container">
          <UBUSearch
            placeholder="Search notification..."
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            enterButton
          />
        </div>
        <UBUPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          handlePaginationChange={handlePaginationChange}
        />
      </div>
      <Flex className="not-content">
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span className="not-tab-header">
                All{" "}
                <Badge
                  count="1"
                  overflowCount={99}
                  style={{ backgroundColor: "#f0f0f0", color: "#000" }}
                />
              </span>
            }
            key="1"
          >
            <List
              dataSource={notifications}
              className="not-content-list"
              loading={dataLoading}
              renderItem={(notification) => (
                <List.Item className="not-content-list-item">
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={notification.sender.avatar}
                        icon={!notification.avatar && "user"}
                      />
                    }
                    title={
                      <Space
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <Text strong>
                          {notification.type === "MESSAGED"
                            ? "Chat Message"
                            : "Campaign"}
                        </Text>
                        <Text>{notification.content}</Text>
                      </Space>
                    }
                    description={
                      user["type"] === "influencer" &&
                      notification?.campaign?.status === "pending" && (
                        <Flex gap={"8px"}>
                          <Space className="not-content-list-item-btns">
                            <Button
                              variant="outlined"
                              type="primary"
                              loading={
                                loadingStates[`accept-${notification.id}`] ||
                                false
                              }
                              onClick={() => handleCreateAccount(notification)}
                            >
                              Accept
                            </Button>
                          </Space>
                          <Space className="not-content-list-item-btns">
                            <Button
                              onClick={() => handleReject(notification)}
                              variant="outlined"
                              color="danger"
                              loading={
                                loadingStates[`reject-${notification.id}`] ||
                                false
                              }
                            >
                              Reject
                            </Button>
                          </Space>
                        </Flex>
                      )
                    }
                  />
                  <div>
                    <Text type="secondary">{notification.time}</Text>
                    {!notification.isSeen && (
                      <span
                        style={{ fontSize: 16, color: "black", marginLeft: 8 }}
                      >
                        •
                      </span>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane
            tab={<span className="not-tab-header">Mentions</span>}
            key="2"
          >
            <p>No mentions yet</p>
          </TabPane>
        </Tabs>
      </Flex>
    </Flex>
  );
};

export default NotificationsPage;
