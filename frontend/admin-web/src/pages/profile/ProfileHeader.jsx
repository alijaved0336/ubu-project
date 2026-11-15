import React from "react";
import styles from "./ProfilePage.module.css";
import CameraIcon from "@src/assets/icons/CameraIcon";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Skeleton, Tooltip, Typography } from "antd";
import { useProfile } from "@src/components/Providers/ProfileProvider/ProfileProvider";
import { useNavigate } from "react-router-dom";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { Title } = Typography;
  const {
    onEditCoverClick,
    loading,
    user,
    handleSubmit,
    onSubmit,
    isSubmitting,
  } = useProfile();

  return (
    <div
      className={`tw-bg-white tw-rounded-lg tw-p-5 tw-gap-4 tw-mb-5 tw-flex tw-justify-between tw-flex-wrap sm:tw-flex-row xs:tw-flex-col`}
    >
      <div className="tw-flex tw-flex-wrap sm:tw-flex-row xs:tw-flex-col tw-items-center">
        <div style={{ position: "relative" }}>
          <Avatar size={64} src={user?.avatar} icon={<UserOutlined />} />
          <Tooltip title="Update Profile Photo">
            <div
              className="action-icon tw-absolute tw-bottom-0.5 tw-left-1 tw-cursor-pointer"
              onClick={onEditCoverClick}
            >
              <CameraIcon width="30px" height="30px" />
            </div>
          </Tooltip>
        </div>
        <div className={styles.profileInfo}>
          {loading ? (
            <Skeleton.Button
              block
              style={{ width: 100, marginBottom: 2 }}
              active
              size="small"
            />
          ) : (
            <Title level={4} style={{ marginBottom: 0 }}>
              {user?.first_name + " " + user?.last_name}
            </Title>
          )}

          {loading ? (
            <Skeleton.Button block style={{ width: 100 }} active size="small" />
          ) : (
            <p>{user?.email}</p>
          )}
        </div>
      </div>
      <div className="tw-flex sm:tw-flex-row xs:tw-flex-col sm:tw-gap-4 xs:tw-gap-2">
        <Button
          onClick={() => navigate("/dashboard/profile/change_password")}
          type="primary"
          className={styles.saveButton}
        >
          Change Password
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          type="primary"
          className={styles.saveButton}
          loading={isSubmitting}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
