import ProfileModals from "./ProfileModals";
import ProfileHeader from "./ProfileHeader";
import styles from "./ProfilePage.module.css";
import ProfileDeletionSection from "./ProfileDeletionSection";
import ProfileInformationSection from "./ProfileInformationSection";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import ProfileProvider from "@src/components/Providers/ProfileProvider/ProfileProvider";

import { Layout } from "antd";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const Profile = () => {
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <UBUBreadCrumb items={[{ title: "Dashboard" }, { title: "Profile" }]} />
      <ProfileProvider>
        <Content className={styles.content}>
          <ProfileHeader />
          <ProfileInformationSection />
          <ProfileDeletionSection />
          <div className={styles.deleteAccountSection}>
            <div className={styles.profileInfo}>
              <Heading level={4} style={{ marginBottom: 0 }}>
                Modify Submitted Questionnaire
              </Heading>
              Noticed something you’d like to change? Update your questionnaire
              anytime.
            </div>
            <Button
              onClick={() => navigate("/registration/creator?edit=true")}
              type="primary"
              className={styles.saveButton}
            >
              Modify Survey
            </Button>
          </div>
        </Content>
        <ProfileModals />
      </ProfileProvider>
    </Layout>
  );
};

export default Profile;
