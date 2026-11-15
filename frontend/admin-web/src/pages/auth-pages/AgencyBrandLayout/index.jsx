import { Button, Flex, Layout, Typography } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Logo from "../../../assets/logo-white.png";
import { useTranslation } from "react-i18next";
import RegistrationWizard from "../AgencyRegistration/AgencyRegistrationWizard";
import "./AgencyBrandLayout.less";
import { useNavigate } from "react-router-dom";
import { Container } from "@src/components";

const AgencyBrandLayout = ({
  buttonText,
  buttonNavigationURL,
  headerText,
  headerText2,
  contentText,
  contentDescription,
  children,
}) => {
  const { Text } = Typography;
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Layout className="brand-layout">
        <Container>
          <Content className="brand-content">
            <Flex
              gap="large"
              className="brand-content-flex"
              vertical
              justify="center"
              align="center"
            >
              <Flex vertical align="center">
                <Text className="brand-content-flex-text1 ff-manrope">
                  {contentText}
                </Text>
                <Text className="brand-content-flex-description ff-manrope">
                  {contentDescription}
                </Text>
              </Flex>
              <Flex className="brand-content-flex-flex2">{children}</Flex>
            </Flex>
          </Content>
        </Container>
      </Layout>
    </>
  );
};

export default AgencyBrandLayout;
