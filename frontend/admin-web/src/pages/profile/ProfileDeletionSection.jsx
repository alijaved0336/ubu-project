import React from "react";
import styles from "./ProfilePage.module.css";

import { Button, Typography } from "antd";
import { useProfile } from "@src/components/Providers/ProfileProvider/ProfileProvider";

const ProfileDeletionSection = () => {
  const { setConfirmationModalOpen } = useProfile();
  const { Title } = Typography;

  return (
    <div className='tw-bg-white tw-rounded-lg tw-p-5 sm:tw-gap-4 xs:tw-gap-2 tw-mt-5 tw-flex tw-justify-between tw-flex-wrap sm:tw-flex-row xs:tw-flex-col'>
      <div className={styles.profileInfo}>
        <Title level={4} style={{ marginBottom: 0 }}>
          Delete account
        </Title>
        This will delete your account with it's data. We have database backups
        going back 30 days, your data will be part of those backups during that
        period.
      </div>
      <Button
        type="primary"
        className={styles.deleteAccountButton}
        onClick={() => {
          setConfirmationModalOpen(true);
        }}
      >
        Delete my account
      </Button>
    </div>
  );
};

export default ProfileDeletionSection;
