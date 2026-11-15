import { useEffect, useMemo, useRef, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Flex,
  Grid,
  List,
  Button,
  message,
  Typography,
  Alert,
  Spin,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";

import { LogoutOutlined } from "@ant-design/icons";

import "./Dashboard.less";
import { useWebSocketContext } from "../application-wide/contexts/web-socket-context";
import { Text } from "@src/components";

import cn from "@src/cn";
import { UBUIcon } from "@src/assets/icons";
import NotificationIcon from "./SVGs/NotificationIcon";
import "./Dashboard.less";
import {
  NotificationExcalamation,
  NotificationFileRead,
  NotificationSuccess,
  CloseIcon,
} from "@src/assets/icons";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "@src/store/features/authSlice";
import useMenu from "@src/hooks/useMenu";
import { formatDateStampWithoutTime } from "@src/utils/formateData";
import NotificationCampaignFailure from "@src/assets/icons/NotificationCampaignFailure";
import NotificationCampaignSign from "@src/assets/icons/NotificationCampaignSign";
import NotificationInformation from "@src/assets/icons/NotificationInformation";
import NotificationReview from "@src/assets/icons/NotificationReview";
import NotificationCampaignSuccess from "@src/assets/icons/NotificationCampaignSuccess";
import { setIsSidebarCollapsed } from "@src/store/features/settingsSlice";
import ProfileMenu from "./ProfileMenu";
import { useGetUserQuery } from "@src/store/api/userApi";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import NotificationChat from "@src/assets/icons/NotificationChat";
import WhatsNewPopOverContent from "@src/pages/whats-new/WhatsNewPopOverContent";
import useGetWhatsNew from "@src/application-wide/api-gateway-hooks/use-get-whats-new";
import { ADMIN_EMAILS } from "@src/utils/constant";

const { Header, Content, Sider } = Layout;

const Dashboard = ({ heading, children }) => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const { isSidebarCollapsed } = useSelector((state) => state.settings || {});

  const disabledLinks = ["customers", "orders", "contents", "businesses"];

  const tabs = useMenu();
  const { value: whatsNewData, onGetWhatsNew } =
  useGetWhatsNew(true);

  const { notifications, markNotificationAsSeen, specificChat } =
    useWebSocketContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isWhatsNewVisible, setIsWhatsNewVisible] = useState(false);
  // const [collapsed, setCollapsed] = useState(false);
  const [refactoredNotifications, setRefactoredNotification] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allChats, setAllChats] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const proposalTab = query.get("tab") || "2";

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const refactoredData = notifications
      .filter((item) => !item.isSeen)
      .slice(0, 5);
    setRefactoredNotification(refactoredData);
  }, [notifications]);
  const getSelectedKey = () => {
    if (location.pathname.includes("/proposals")) return "proposals";
    if (location.pathname.includes("/posts")) return "posts";
    if (location.pathname.includes("/chats")) return "chats";
    if (location.pathname.includes("/products")) return "products";
    if (location.pathname.includes("/segments")) return "segments";
    if (location.pathname.includes("/campaigns")) return "campaigns";
    if (location.pathname.includes("/businesses")) return "businesses";

    if (location.pathname.includes("/subscriptions")) return "subscriptions";
    if (location.pathname.includes("/orders")) return "orders";
    if (location.pathname.includes("/transactions")) return "transactions";
    if (location.pathname.includes("/contents")) return "contents";
    if (location.pathname.includes("/reports")) return "reports";
    if (location.pathname.includes("/customers")) return "customers";
    if (location.pathname.includes("/analytics")) return "analytics";

    return "";
  };

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

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
  }, [allChats]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleOpenChange = (e) => {
    setIsVisible(e);
    if (!e) {
      markNotificationAsSeen(refactoredNotifications);
    }
  };

  const handleCloseDropdown = () => {
    setIsVisible(false);
    markNotificationAsSeen(refactoredNotifications);
  };
  const handleViewAllNotifications = () => {
    setIsVisible(false);
    markNotificationAsSeen(notifications);
    navigate("/dashboard/notifications");
  };

  const notificationClicked = (item) => {
    const campaignId = item?.campaign?.id;
    const chatId = item?.chatId?.id;
    markNotificationAsSeen(refactoredNotifications);
    setIsVisible(false);
    if (campaignId) {
      navigate(`/dashboard/campaigns/${campaignId}`);
    }
    if (chatId) {
      navigate(`/dashboard/chats/${chatId}/chat-wrapper`);
    }
  };
  const profileMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => navigate("/dashboard/profile")}
      >
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const notificationTypeIcon = {
    REQUEST: <NotificationChat />,
    INVITATION: <NotificationFileRead />,
    CHECKEDINVITE: <NotificationFileRead />,
    ACCEPTED: <NotificationCampaignSign />,
    REJECTED: <NotificationCampaignFailure />,
    SIGN: <NotificationCampaignSign />,
    PAYMENT: <NotificationSuccess />,
    PUBLISHED: <NotificationCampaignSuccess />,
    FAILURE: <NotificationCampaignFailure />,
    INFORMATION: <NotificationInformation />,
    MESSAGED: <NotificationFileRead />,
    REVIEW: <NotificationReview />,
  };

  const NotificationMenu = ({ onClose }) => {
    return (
      <Flex vertical className="notification-dropdown" ref={dropdownRef}>
        <Flex className="notification-dropdown-header" justify="space-between">
          <Text className="notification-dropdown-header-text">
            Notifications
          </Text>
          <Button type="text" icon={<CloseIcon />} onClick={onClose} />
        </Flex>
        <List
          itemLayout="horizontal"
          dataSource={refactoredNotifications}
          renderItem={(item) => (
            <List.Item
              className="notification-item"
              onClick={() => notificationClicked(item)}
            >
              <List.Item.Meta
                avatar={<Avatar icon={notificationTypeIcon[item.type]} />}
                title={
                  <Typography.Text className="notification-item-text">
                    {item.content}
                  </Typography.Text>
                }
              />
              <Typography.Text type="secondary">
                {formatDateStampWithoutTime(item.date)}
              </Typography.Text>
            </List.Item>
          )}
        />
        <div className="view-all">
          <Button
            type="link"
            onClick={() => {
              handleViewAllNotifications();
            }}
          >
            See all notifications
          </Button>
        </div>
      </Flex>
    );
  };

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);

      const response = await axiosInstance.get("/resend/email");
      message.success(response.data);
    } catch (error) {
      console.error("Error adding segment:", error);
      message.error("Something went wrong. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  const updateWhatsNewSeen = async () => {
    const whatsNewIds = whatsNewData?.data?.whatsNew
    .filter(item => item.seenBy.length === 0)
    .map(item => item.id);
    if (whatsNewIds.length > 0) {
      await axiosInstance.post("/whats_new_seen_by", { whatsNewIds });
      await onGetWhatsNew();
    }
  };

  const isWhatsNewColorGreen = useMemo(() => {
    return whatsNewData?.data?.whatsNew
      .filter(item => item.seenBy.length === 0)
      .map(item => item.id).length > 0;
  }, [whatsNewData]);
  
  const isProfilePage = location.pathname.includes("dashboard/profile");
  return (
    <Layout className="dashboard-layout">
      <Sider
        width={280}
        collapsible={!screens.xs}
        collapsed={screens.xs || isSidebarCollapsed}
        onCollapse={(isCollapsed) =>
          dispatch(setIsSidebarCollapsed(isCollapsed))
        }
        className="layout-sider"
      >
        <Flex
          vertical
          className="sidebar"
          justify="center"
          align="start"
          gap="large"
        >
          <div
            className={cn("tw-px-8 tw-py-[10px] tw-w-full ", {
              "tw-px-0 tw-flex tw-justify-center tw-items-start":
                isSidebarCollapsed || screens.xs,
            })}
          >
            <UBUIcon
              width={isSidebarCollapsed || screens.xs ? "36" : "72"}
              height={isSidebarCollapsed || screens.xs ? "15.5" : "31"}
              handleRedirect={() => navigate("/")}
              className="tw-cursor-pointer"
            />
          </div>

          <Menu
            className="sidebar-menu tw-space-y-[5px] tw-font-manrope"
            theme="dark"
            mode="inline"
            selectedKeys={[getSelectedKey()]}
          >
            {tabs.map(({ Icon, key, label, path }) => (
              <Menu.Item
                className={cn("sidebar-menu-item tw-font-manrope", {
                  "item-collapsed": isSidebarCollapsed || screens.xs,
                })}
                key={key}
                icon={Icon}
                onClick={() => navigate(path)}
                disabled={disabledLinks.includes(key)}
              >
                <div className="tw-flex tw-items-center">
                  <span>{label}</span>
                  {label === "Chats" && unreadCount > 0 && (
                    <span className="tw-ml-2 tw-bg-red-500 tw-text-white tw-rounded-full tw-text-xs tw-flex tw-items-center tw-justify-center tw-w-4 tw-h-4">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Menu.Item>
            ))}
          </Menu>
        </Flex>
      </Sider>

      <Layout>
        {(user?.id && !user?.email_verified) && (
          <div className="verify-email-message">
            <Alert
              message={
                <>
                  Your email is not verified yet. Please verify your email to
                  unlock all features and access your account fully.{" "}
                  {resendLoading ? (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{ margin: "6px", color: "#ff7800" }}
                          spin
                        />
                      }
                    />
                  ) : (
                    <Button
                      type="link"
                      className="resend-verification-email"
                      onClick={handleResendVerification}
                    >
                      Resend Verification Email
                    </Button>
                  )}
                </>
              }
              type="warning"
              className="email-verification-banner"
            />
          </div>
        )}
        <Header className="dashboard-header">
          <div id="bread-crumb"></div>

          {/* <Text className={"fs-20 fw-500"}>{heading}</Text> */}
          {/* <div className="select-wrapper">
                <Select
                  defaultValue={"Nik Shop"}
                  varient={"warning"}
                  shape={"round"}
                  options={[
                    { value: "Nik Shop", label: "Nik Shop" },
                    { value: "Nik Shop 1", label: "Nik Shop 2" },
                    { value: "Nik Shop 2", label: "Nik Shop 3" },
                  ]}
                />
              </div>
              <Flex className="notification-wrapper">
                <Bell />
                <span className="notification-count">4</span>
              </Flex> */}
          <div className="header-icons tw-flex tw-gap-2 tw-items-center">
          {
            (!ADMIN_EMAILS.includes(user?.email) && whatsNewData?.data?.whatsNew.length > 0) &&
              <Dropdown
                overlay={
                  <WhatsNewPopOverContent whatsNew={whatsNewData?.data?.whatsNew || []} onClose={() => setIsWhatsNewVisible(false)} />
                }
                open={isWhatsNewVisible}
                trigger={["click"]}
                overlayStyle={{ width: "30%" }}
                placement="bottomRight"
                onOpenChange={(e) => {
                  updateWhatsNewSeen();
                  setIsWhatsNewVisible(!isWhatsNewVisible);
                }}
                >
                <Flex align="center" gap={10}>
                  <div
                    className="tw-animate-slide-in-right"
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: isWhatsNewColorGreen ? "lightgreen" : "gray",
                      borderRadius: "50%",
                    }}
                  ></div>{" "}
                  <span className="header-span">Whats New?</span>
                </Flex>
              </Dropdown>
              }
            <div className="notification-parent tw-flex" ref={dropdownRef}>
              <Dropdown
                overlay={<NotificationMenu onClose={handleCloseDropdown} />}
                open={isVisible}
                trigger={["click"]}
                overlayStyle={{ width: "30%" }}
                placement="bottomRight"
                onOpenChange={(e) => {
                  handleOpenChange(e);
                }}
              >
                <span
                  className={`header-span ${
                    shouldAnimate && "tw-animate-bell-rattle"
                  }`}
                >
                  <NotificationIcon width="30" height="30" />
                </span>
              </Dropdown>
              {refactoredNotifications.length > 0 ? (
                <div className="notification-number">
                  {notifications.filter((item) => !item.isSeen).length}
                </div>
              ) : (
                <div></div>
              )}
            </div>

            <ProfileMenu />
            {/* <Dropdown overlay={profileMenu} placement="bottomCenter">
              <Avatar
                className="user-avatar"
                src={user?.avatar}
                icon={<UserOutlined />}
              />
            </Dropdown> */}
          </div>
        </Header>

        <Content
          className={cn({
            "dashboard-not-verified": user && !user.email_verified,
            "main-dashboard-wrapper": !isProfilePage,
          })}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

Dashboard.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
};

export default Dashboard;
