import { memo, useCallback, useEffect, useMemo, useState } from "react";
import "./LandingPageLayout.less";
import { Button, Flex, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

import { Content, Header } from "antd/es/layout/layout";
import { Container } from "@src/components";

import { useNavigate } from "react-router-dom";
import { useDetectScreen } from "@src/hooks";
import { useDispatch, useSelector } from "react-redux";
import ProfileMenu from "@src/components/ProfileMenu";
import { logout } from "@src/store/features/authSlice";

const LandingPageLayout = ({ children, navTheme = "light" }) => {
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const isSmallScreen = useDetectScreen(930);
  const navigate = useNavigate();

  const isSignInPage = location.pathname.includes("login");
  const isSignUpPage =
    location.pathname.includes("registration") ||
    location.pathname.includes("qr-Page");

  const isNotScannedInfluencer = user?.isInfluencer && !user?.isScanned;

  const notDashboardAndIsAuthenticated =
    !location.pathname.includes("dashboard") && isAuthenticated && user?.type;

  const handleDashboardNavigation = useCallback(() => {
    if (user?.type === "brand") {
      navigate("/dashboard/segments");
    } else {
      navigate("/dashboard/posts");
    }
  }, [navigate, user]);

  const handleProfileNavigation = useCallback(() => {
    return navigate("/dashboard/profile");
  }, [navigate]);

  const handleConnectedAccountNavigation = useCallback(() => {
    return navigate("/dashboard/connected-account");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [navigate, dispatch]);

  const items = useMemo(() => {
    const items = [
      { key: "1", label: "Home", onClick: () => navigate("/") },
      { key: "2", label: "About Us", onClick: () => navigate("/about-us") },
      { key: "3", label: "Blogs", onClick: () => navigate("/blogs") },
      {
        key: "4 ",
        label: "Contact Us",
        onClick: () => navigate("/contact-us"),
      },
      {
        key: "5",
        type: "divider",
        style: { borderColor: "black" },
      },
      {
        key: "6",
        type: "divider",
      },
    ];

    if (isAuthenticated) {
      if (
        user?.type &&
        notDashboardAndIsAuthenticated &&
        !isNotScannedInfluencer
      ) {
        items.push({
          key: "7",
          label: "Dashboard",
          onClick: handleDashboardNavigation,
        });
        items.push({
          key: "8",
          label: "Profile",
          onClick: handleProfileNavigation,
        });
      }

      if (user?.isInfluencer && !isNotScannedInfluencer) {
        items.push({
          key: "9",
          label: "Connected Account",
          onClick: handleConnectedAccountNavigation,
        });
      }

      items.push({
        key: "10",
        label: "Logout",
        onClick: handleLogout,
      });
    } else {
      if (!isSignUpPage) {
        items.push({
          key: "11",
          label: "Signup",
          onClick: () => navigate("/registration"),
        });
      }

      if (!isSignInPage) {
        items.push({
          key: "12",
          label: "Login",
          onClick: () => navigate("/login"),
        });
      }
    }

    return items;
  }, [
    user,
    isSignInPage,
    isSignUpPage,
    isAuthenticated,
    isNotScannedInfluencer,
    notDashboardAndIsAuthenticated,
    navigate,
    handleLogout,
    handleDashboardNavigation,
    handleConnectedAccountNavigation,
    handleProfileNavigation,
  ]);

  const filteredItems = useMemo(() => {
    return isSmallScreen
      ? items
      : items.slice(
          0,
          items.findIndex((item) => item.type === "divider")
        );
  }, [items, isSmallScreen]);

  const [current, setCurrent] = useState("");
  const handleMenu = (e) => {
    setCurrent(e.key);
  };

  return (
    <Layout className={`landing-layout`}>
      <div className="bg-header">
        <Flex className={`header-wrapper ${navTheme}`} justify="center">
          <Container>
            <Header className="header">
              <Link to="/" className="logo">
                <Flex>UBU</Flex>
              </Link>
              <Flex className="menu-container">
                <Menu
                  mode="horizontal"
                  onClick={handleMenu}
                  selectedKeys={[current]}
                  items={filteredItems}
                />
              </Flex>
              <Flex className="buttons">
                {isAuthenticated ? (
                  <ProfileMenu />
                ) : (
                  <>
                    {!isSignInPage && !isSignUpPage && (
                      <>
                        <Button
                          className="login-button ff-manrope"
                          type="primary"
                          onClick={() => navigate("/login")}
                        >
                          Login
                        </Button>
                        <Button
                          className="signup-button ff-manrope"
                          onClick={() => navigate("/registration")}
                        >
                          Signup
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Flex>
            </Header>
          </Container>
        </Flex>
      </div>

      <Content className="main">{children}</Content>
    </Layout>
  );
};

LandingPageLayout.propTypes = {
  children: propTypes.node,
  handleScrollToCreators: propTypes.func,
  navTheme: propTypes.oneOf(["light", "dark"]),
};

export default memo(LandingPageLayout);
