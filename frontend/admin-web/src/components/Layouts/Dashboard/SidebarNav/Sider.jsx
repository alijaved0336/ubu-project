import { useEffect, useState } from "react";
import { Layout, Menu, Flex, Grid } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
// import "./Dashboard.less";
import cn from "@src/cn";
import { UBUIcon } from "@src/assets/icons";
import { useDispatch, useSelector } from "react-redux";
import useMenu, { getSelectedKey, disabledLinks } from "@src/hooks/useMenu";
import { setIsSidebarCollapsed } from "@src/store/features/settingsSlice";
import { useGetUserQuery } from "@src/store/api/userApi";

import PropTypes from "prop-types";
const { Sider: AntdSider } = Layout;

const Sider = ({ unreadCount }) => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const { isSidebarCollapsed } = useSelector((state) => state.settings || {});

  const tabs = useMenu();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <AntdSider
      width={280}
      collapsible={!screens.xs}
      collapsed={screens.xs || isSidebarCollapsed}
      onCollapse={(isCollapsed) => dispatch(setIsSidebarCollapsed(isCollapsed))}
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
          className={cn(
            "tw-flex tw-items-center tw-w-full tw-px-8 tw-py-[10px]",
            {
              "tw-flex-col tw-px-0 tw-justify-center tw-items-center":
                isSidebarCollapsed || screens.xs, // Stack icon & text vertically when collapsed
            }
          )}
        >
          {/* Icon */}
          <UBUIcon
            width={isSidebarCollapsed || screens.xs ? "36" : "72"}
            height={isSidebarCollapsed || screens.xs ? "15.5" : "31"}
            handleRedirect={() => navigate("/")}
            className="tw-cursor-pointer"
          />

          {user?.type && (
            <span
              className={cn("tw-font-medium tw-leading-none", {
                "tw-ml-2": !isSidebarCollapsed && !screens.xs, // Text next to icon
                "tw-mt-1": isSidebarCollapsed || screens.xs, // Text below icon
              })}
              style={{
                fontSize: isSidebarCollapsed || screens.xs ? "0.6rem" : "1rem", // Smaller text when collapsed
                height: "3.5px",
              }}
            >
              {user.type === "brand" ? "BRAND" : "INFLUENCER"}
            </span>
          )}
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
    </AntdSider>
  );
};

Sider.propTypes = {
  unreadCount: PropTypes.number,
};

export default Sider;
