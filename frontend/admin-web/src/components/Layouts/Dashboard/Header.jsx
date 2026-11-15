import { useEffect, useMemo, useRef, useState } from "react";
import {
  Layout,
  Avatar,
  Dropdown,
  Flex,
  List,
  Button,
  Typography,
  Grid,
} from "antd";
import { useNavigate } from "react-router-dom";
import "./Dashboard.less";
import { Text } from "@src/components";

import {
  NotificationFileRead,
  NotificationSuccess,
  CloseIcon,
} from "@src/assets/icons";
import PropTypes from "prop-types";
import { formatDateStampWithoutTime } from "@src/utils/formateData";
import NotificationIcon from "../../SVGs/NotificationIcon";
import ProfileMenu from "../../ProfileMenu";
import NotificationChat from "@src/assets/icons/NotificationChat";
import NotificationCampaignSign from "@src/assets/icons/NotificationCampaignSign";
import NotificationCampaignFailure from "@src/assets/icons/NotificationCampaignFailure";
import NotificationCampaignSuccess from "@src/assets/icons/NotificationCampaignSuccess";
import NotificationInformation from "@src/assets/icons/NotificationInformation";
import NotificationReview from "@src/assets/icons/NotificationReview";
import useNotificationEvents from "@src/application-wide/api-gateway-hooks/use-notification-events";
import useGetWhatsNew from "@src/application-wide/api-gateway-hooks/use-get-whats-new";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import WhatsNewPopOverContent from "@src/pages/whats-new/WhatsNewPopOverContent";
import { useGetUserQuery } from "@src/store/api/userApi";
import { ADMIN_EMAILS } from "@src/utils/constant";
import { MenuOutlined } from "@ant-design/icons";

const { Header: AntdHeader } = Layout;
const Header = ({ heading, onMenuClick }) => {
  const dropdownRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [refactoredNotifications, setRefactoredNotification] = useState([]);
  const navigate = useNavigate();
  const { notifications, markNotificationAsSeen } = useNotificationEvents();
  const [isWhatsNewVisible, setIsWhatsNewVisible] = useState(false);
  const { value: whatsNewData, onGetWhatsNew } = useGetWhatsNew(true);

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const isWhatsNewColorGreen = useMemo(() => {
    return (
      whatsNewData?.data?.whatsNew
        .filter((item) => item.seenBy.length === 0)
        .map((item) => item.id).length > 0
    );
  }, [whatsNewData]);

  const updateWhatsNewSeen = async () => {
    const whatsNewIds = whatsNewData?.data?.whatsNew
      .filter((item) => item.seenBy.length === 0)
      .map((item) => item.id);
    if (whatsNewIds.length > 0) {
      await axiosInstance.post("/whats_new_seen_by", { whatsNewIds });
      await onGetWhatsNew();
    }
  };

  useEffect(() => {
    const refactoredData = notifications
      .filter((item) => !item.isSeen)
      .slice(0, 5);
    setRefactoredNotification(refactoredData);
  }, [notifications]);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [notifications]);
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

  return (
    <div>
      <AntdHeader className="dashboard-header">
        {isMobile && (
          <Button type="text" icon={<MenuOutlined />} onClick={onMenuClick} />
        )}

        <Text className={"fs-20 fw-500"}>{heading}</Text>
        <div className="header-icons tw-flex tw-gap-2 tw-items-center">
          {!ADMIN_EMAILS.includes(user?.email) &&
            whatsNewData?.data?.whatsNew.length > 0 && (
              <Dropdown
                overlay={
                  <WhatsNewPopOverContent
                    whatsNew={whatsNewData?.data?.whatsNew || []}
                    onClose={() => setIsWhatsNewVisible(false)}
                  />
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
                      backgroundColor: isWhatsNewColorGreen
                        ? "lightgreen"
                        : "gray",
                      borderRadius: "50%",
                    }}
                  ></div>{" "}
                  <span className="header-span">Whats New?</span>
                </Flex>
              </Dropdown>
            )}
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
                <NotificationIcon width="33" height="33" />
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
        </div>
      </AntdHeader>
    </div>
  );
};

Header.propTypes = {
  heading: PropTypes.string,
  onClose: PropTypes.func,
  onMenuClick: PropTypes.func,
};
export default Header;
