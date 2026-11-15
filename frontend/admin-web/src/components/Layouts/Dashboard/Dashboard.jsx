import { lazy, Suspense, useState } from "react";
import { Grid, Layout } from "antd";
import PropTypes from "prop-types";
import { useGetUserQuery } from "@src/store/api/userApi";
import EmailVerificationBanner from "./EmailVerficationBanner";
import ChatBotIndex from "@src/components/ChatBot/ChatBotIndex";
import Header from "./Header";
import Content from "./Content";

import { useSelector } from "react-redux";
import SidebarNav from "./SidebarNav";
import "./Dashboard.less";

const ConnectedAccountProvider = lazy(() =>
  import("@src/components/Providers/ConnectedAccountProvider")
);

const StripeAccountVerification = lazy(() =>
  import("./StripeAccountVerification")
);

const Dashboard = ({ heading, children }) => {
  const {
    user: { type },
  } = useSelector((state) => state.auth || {});

  const { user, loading } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const [open, setOpen] = useState(false);

  const handleShowDrawer = () => {
    setOpen(true);
  };

  const handleHideDrawer = () => {
    setOpen(false);
  };

  return (
    <Layout className="dashboard-layout tw-overflow-hidden">
      <ChatBotIndex />
      <SidebarNav
        isOpenMobileDrawer={open}
        onCloseMobileDrawer={handleHideDrawer}
      />

      <Layout>
        {!user?.email_verified && (
          <EmailVerificationBanner emailVerified={user?.email_verified} />
        )}
        {type === "influencer" && (
          <Suspense fallback={null}>
            <ConnectedAccountProvider>
              <StripeAccountVerification />
            </ConnectedAccountProvider>
          </Suspense>
        )}
        <Header heading={heading} onMenuClick={handleShowDrawer} />
        <div
          id="bread-crumb"
          className="tw-px-6 tw-py-3 tw-bg-white tw-shadow-sm"
        ></div>
        <Content isVerified={user?.email_verified}>{children}</Content>
      </Layout>
    </Layout>
  );
};

Dashboard.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
};

export default Dashboard;
