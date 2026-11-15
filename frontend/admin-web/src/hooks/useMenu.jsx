import React, { useCallback, useMemo } from "react";
import {
  UserIcon,
  ChatIcon,
  DashboardIcon,
  CampaignIcon,
  DollarIcon,
  ProductIcon,
  OrderIcon,
  ReportIcon,
  ProposalIcon,
  SegmentIcon,
  PostIcon,
} from "@src/assets/icons";
import cn from "@src/cn";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import DisputeIcon from "@src/assets/icons/DisputeIcon";
import WaitlistUserIcon from "@src/assets/icons/WaitlistUserIcon";
import { ADMIN_EMAILS } from "@src/utils/constant";

export const disabledLinks = ["customers", "orders", "contents", "businesses"];

export const getSelectedKey = () => {
  if (location.pathname.includes("/proposals")) return "proposals";
  if (location.pathname.includes("/posts")) return "posts";
  if (location.pathname.includes("/chats")) return "chats";
  if (location.pathname.includes("/products")) return "products";
  if (location.pathname.includes("/segments")) return "segments";
  if (location.pathname.includes("/campaigns")) return "campaigns";
  if (location.pathname.includes("/disputes")) return "disputes";

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

export const getItem = (label, key, Icon, children) => ({
  key,
  Icon,
  children,
  label,
  path: `/dashboard${key ? "/" + key : ""}`,
});

const useMenu = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth || {});

  const getClassName = useCallback(
    (path, defaultClassName, activeClassName) => {
      const isExact = path === "/dashboard";

      const isActive = isExact
        ? location.pathname === "/dashboard" ||
          location.pathnamecurrentPath === "/dashboard/"
        : location.pathname.includes(path);

      return cn(defaultClassName, {
        [activeClassName]: isActive,
      });
    },
    [location]
  );

  const menuStructure = useMemo(
    () => [
      // {
      //   label: "Dashboard",
      //   key: "",
      //   icon: <DashboardIcon />,
      //   path: "/dashboard",
      //   defaultClassName: "tw-stroke-gray-menu",
      //   activeClassName: "tw-stroke-white",
      //   role: "",
      // },
      {
        label: "Segments",
        key: "segments",
        icon: <SegmentIcon />,
        path: "/dashboard/segments",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "brand",
      },
      {
        label: "Posts",
        key: "posts",
        icon: <PostIcon />,
        path: "/dashboard/posts",
        defaultClassName: "tw-fill-gray-menu",
        activeClassName: "tw-fill-white",
        role: "influencer",
      },
      {
        label: "Campaign Management",
        key: "campaigns",
        icon: <CampaignIcon />,
        path: "/dashboard/campaigns",
        defaultClassName: "tw-fill-gray-menu",
        activeClassName: "tw-fill-white",
        role: "",
      },
      {
        label: "Dispute Management",
        key: "disputes",
        icon: <DisputeIcon />,
        path: "/dashboard/disputes",
        defaultClassName: "tw-fill-gray-menu ",
        activeClassName: "tw-fill-white ",
        role: "",
      },
      {
        label: "Proposal Management",
        key: "proposals",
        icon: <ProposalIcon />,
        path: "/dashboard/proposals",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "influencer",
      },
      {
        label: "Business Management",
        key: "businesses",
        icon: <ProposalIcon />,
        path: "/dashboard/businesses",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "influencer",
      },
      {
        label: "Product Management",
        key: "products",
        icon: <ProductIcon />,
        path: "/dashboard/products",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "brand",
      },

      {
        label: "Chats",
        key: "chats",
        icon: <ChatIcon />,
        path: "/dashboard/chats",
        defaultClassName: "tw-fill-gray-menu",
        activeClassName: "tw-fill-white",
        role: "",
      },
      {
        label: "Reports",
        key: "reports",
        icon: <ReportIcon />,
        path: "/dashboard/reports",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Blogs",
        key: "blogs",
        icon: <OrderIcon />,
        path: "/dashboard/blogs",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Influencer Payouts",
        key: "payouts",
        icon: <DollarIcon />,
        path: "/dashboard/payouts",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Whats New",
        key: "whats_new",
        icon: <CampaignIcon />,
        path: "/dashboard/whats_new",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Session Logs",
        key: "session_logs",
        icon: <UserIcon />,
        path: "/dashboard/session_logs",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Application Logs",
        key: "application_logs",
        icon: <CampaignIcon />,
        path: "/dashboard/application_logs",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Body Scan Count",
        key: "body_scan_count",
        icon: <ReportIcon />,
        path: "/dashboard/body_scan_count",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Body Gram Errors",
        key: "body_gram_errors",
        icon: <CampaignIcon />,
        path: "/dashboard/body_gram_errors",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Analytics",
        key: "analytics",
        icon: <ReportIcon />,
        path: "/dashboard/analytics",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Customer Management",
        key: "customers",
        icon: <UserIcon />,
        path: "/dashboard/customers",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "brand",
      },
      {
        label: "Order Management",
        key: "orders",
        icon: <OrderIcon />,
        path: "/dashboard/orders",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "brand",
      },

      // {
      //   label: "Campaign Management",
      //   key: "proposals?tab=3",
      //   icon: <CampaignIcon />,
      //   path: "/dashboard/proposals?tab=3",
      //   defaultClassName: "tw-fill-gray-menu",
      //   activeClassName: "tw-fill-white",
      //   role: "influencer",
      // },
      {
        label: "Content Management",
        key: "contents",
        icon: <ProductIcon />,
        path: "/dashboard/contents",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "influencer",
      },
      {
        label: "Subscriptions",
        key: "subscriptions",
        icon: <DollarIcon />,
        path: "/dashboard/subscriptions",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "brand",
      },
      {
        label: "Transactions",
        key: "transactions",
        icon: <DollarIcon />,
        path: "/dashboard/transactions",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Signup Users",
        key: "signup_users",
        icon: <UserIcon />,
        path: "/dashboard/signup-users",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      {
        label: "Wait list Users",
        key: "waitlist-users",
        icon: <WaitlistUserIcon />,
        path: "/dashboard/waitlist-users",
        defaultClassName: "tw-stroke-gray-menu",
        activeClassName: "tw-stroke-white",
        role: "",
      },
      // {
      //   label: "Reports",
      //   key: "reports",
      //   icon: <ReportIcon />,
      //   path: "/dashboard/reports",
      //   defaultClassName: "tw-stroke-gray-menu",
      //   activeClassName: "tw-stroke-white",
      //   role: "",
      // },
    ],
    []
  );

  const menuItems = useMemo(() => {
    const items = menuStructure.filter((item) => {
      if (ADMIN_EMAILS.includes(user?.email)) {
        return (
          item.key === "reports" ||
          item.key === "blogs" ||
          item.key === "whats_new" ||
          item.key === "session_logs" ||
          item.key === "disputes" ||
          item.key === "body_scan_count" ||
          item.key === "signup_users" ||
          item.key === "waitlist-users" ||
          item.key === "body_gram_errors" ||
          item.key === "payouts" ||
          item.key === "body_gram_errors" ||
          item.key === "application_logs"
        );
      }
      return (
        (item.key !== "reports" &&
          item.key !== "blogs" &&
          item.key !== "whats_new" &&
          item.key !== "session_logs" &&
          item.key !== "disputes" &&
          item.key !== "body_scan_count" &&
          item.key !== "signup_users" &&
          item.key !== "waitlist-users" &&
          item.key !== "body_gram_errors" &&
          item.key !== "payouts" &&
          item.key !== "application_logs" &&
          !item.role) ||
        item.role === user?.type
      );
    });

    // Todo: UnCOmment below code when the super admin user works
    // const items = menuStructure.filter(
    //   (item) => !item.role || item.role === user?.type // Include shared and role-specific items
    // );
    return items.map(
      ({ label, key, icon, path, defaultClassName, activeClassName }) =>
        getItem(
          label,
          key,
          React.cloneElement(icon, {
            className: getClassName(path, defaultClassName, activeClassName),
          }),
          null
        )
    );
  }, [menuStructure, getClassName, user]);

  return menuItems;
};

export default useMenu;
