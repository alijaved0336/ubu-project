import { Menu, Avatar, Dropdown, Skeleton } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardOutlined, UserOutlined } from "@ant-design/icons";

import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@src/store/features/authSlice";
import { useGetUserQuery } from "@src/store/api/userApi";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    isAuthenticated,
    user: { type, isInfluencer, isScanned },
  } = useSelector((state) => state.auth || {});

  const { user, loading } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
    skip: !isAuthenticated,
  });

  const isNotScannedInfluencer = isInfluencer && !isScanned;

  const notDashboardAndIsAuthenticated =
    !location.pathname.includes("dashboard") && isAuthenticated && type;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleDashboardNavigation = () => {
    if (user?.is_brand) {
      navigate("/dashboard/segments");
    } else {
      navigate("/dashboard/posts");
    }
  };

  return (
    <>
      {loading ? (
        <Skeleton.Avatar shape="circle" className="!tw-flex" active />
      ) : (
        <Dropdown
          trigger={["click"]}
          overlay={
            <Menu>
              {isAuthenticated &&
                type &&
                notDashboardAndIsAuthenticated &&
                !isNotScannedInfluencer && (
                  <Menu.Item
                    key="dashboard"
                    icon={<DashboardOutlined />}
                    onClick={handleDashboardNavigation}
                  >
                    Dashboard
                  </Menu.Item>
                )}
              {isAuthenticated && type && !isNotScannedInfluencer && (
                <Menu.Item
                  key="profile"
                  icon={<UserOutlined />}
                  onClick={() => navigate("/dashboard/profile")}
                >
                  Profile
                </Menu.Item>
              )}
              {isInfluencer && !isNotScannedInfluencer && (
                <Menu.Item
                  key="connected-account"
                  icon={<UserOutlined />}
                  onClick={() => navigate("/dashboard/connected-account")}
                >
                  Connected Account
                </Menu.Item>
              )}
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu>
          }
          placement="bottomLeft"
        >
          <Avatar
            className="user-avatar tw-shadow-avatar !tw-border-0 tw-cursor-pointer"
            src={user?.avatar}
            icon={<UserOutlined />}
          />
        </Dropdown>
      )}
    </>
  );
};

export default ProfileMenu;
