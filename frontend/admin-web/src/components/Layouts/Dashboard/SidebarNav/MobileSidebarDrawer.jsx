import React, { useState } from "react";
import useMenu, { getSelectedKey, disabledLinks } from "@src/hooks/useMenu";
import { Drawer, Menu } from "antd";
import PropTypes from "prop-types";
import styled from "styled-components";
import cn from "@src/cn";
import { useNavigate } from "react-router-dom";
import { UBUIcon } from "@src/assets/icons";

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-content {
    background-color: #000000;
  }

  .ant-drawer-body {
    background: #000000;
    padding: 0;

    .sidebar-menu {
      background: #000000 !important;
      width: 100%;
      padding-bottom: 4rem;

      .sidebar-menu-item {
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 10px 32px;
        gap: 14px;
        min-height: 4.5rem;
        position: relative;

        &.item-collapsed {
          justify-content: center;
          padding-left: 0;
          padding-right: 0;

          .ant-menu-title-content {
            display: none;
          }
        }

        .ant-menu-title-content {
          text-align: left;
          margin-inline-start: unset !important;
          font-weight: 500;
          font-size: 0.875rem;
          color: #8f8f8f;
        }
      }

      .sidebar-menu-item.ant-menu-item-selected {
        &::before {
          content: "";
          position: absolute;
          left: 0;
          width: 4px;
          height: 100%;
          background-color: #ffffff;
          border-radius: 0px 40px 40px 0px;
        }

        background-color: #000000;

        .ant-menu-title-content {
          font-weight: 500;
          font-size: 0.875rem;
          color: #ffffff;
          text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        }
      }
    }
  }

  .ant-drawer-header {
    background-color: #000000;
    border-bottom: none;
  }

  .ant-drawer-close {
    color: #ffffff;
  }
`;

const MobileSidebarDrawer = ({ onClose, isOpen, unreadCount, user }) => {
  const tabs = useMenu();
  const navigate = useNavigate();

  return (
    <StyledDrawer
      title={
        <div
          className={cn(
            "tw-flex tw-items-center tw-w-full tw-px-8 tw-py-[10px]"
          )}
        >
          {/* Icon */}
          <UBUIcon
            width={"72"}
            height={"31"}
            handleRedirect={() => navigate("/")}
            className="tw-cursor-pointer"
          />

          {user?.type && (
            <span
              className={cn(
                "tw-font-medium tw-leading-none tw-text-white tw-ml-2"
              )}
              style={{
                fontSize: "1rem", // Smaller text when collapsed
                height: "3.5px",
              }}
            >
              {user.type === "brand" ? "BRAND" : "INFLUENCER"}
            </span>
          )}
        </div>
      }
      placement="left"
      //   closable={false}
      onClose={onClose}
      open={isOpen}
      key="left"
    >
      <Menu
        className="sidebar-menu tw-space-y-[5px] tw-font-manrope"
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
      >
        {tabs.map(({ Icon, key, label, path }) => (
          <Menu.Item
            className={cn("sidebar-menu-item tw-font-manrope")}
            key={key}
            icon={Icon}
            onClick={() => {
              onClose();
              navigate(path);
            }}
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
    </StyledDrawer>
  );
};

MobileSidebarDrawer.propTypes = {
  onClose: PropTypes.array,
  isOpen: PropTypes.bool,
  unreadCount: PropTypes.number,
  user: PropTypes.object,
};

export default MobileSidebarDrawer;
