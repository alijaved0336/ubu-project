import { Dropdown, Flex, Space, Typography } from "antd";
import "./FooterLayout.less";
import Usa from "@src/assets/usa.png";
import Spain from "@src/assets/spain.png";
import France from "@src/assets/france.png";
import German from "@src/assets/germany.png";

import MyFooter from "../LandingPage/sections/MyFooter/MyFooter";
import { Container } from "@src/components";

const FooterLayout = ({ children }) => {
  const { Text, Link } = Typography;
  const HEIGHT = 20
  const WIDTH = 20


  const DropDownItems = [
    {
      label: "English",
      key: "en",
      icon: <img height={HEIGHT} width={WIDTH} src={Usa} alt="English" />,
    },
    {
      label: "French",
      key: "fr",
      icon: <img height={HEIGHT} width={WIDTH} src={France} alt="English" />,
    },
    {
      label: "Spanish",
      key: "es",
      icon: <img height={HEIGHT} width={WIDTH} src={Spain} alt="English" />,
    },
    {
      label: "German",
      key: "de",
      icon: <img height={HEIGHT} width={WIDTH} src={German} alt="English" />,
    },
  ];

  return (
    <>
      {children}
      <Flex vertical gap="middle" className="eigth-level">
        <Container>
          <Flex className="my-footer">
            <MyFooter />
          </Flex>
        </Container>

        <Flex align="center" justify="center" className="footer-f">
          <Container>
            <Flex className="footer-f-4" align="center" justify="space-between">
              <Flex className="footer-f-4-1">
                <Flex className="footer-f-4-1-1">
                  <Text className="footer-f-4-1-1-text">
                    All Rights Reserved. UBU 2024
                  </Text>
                </Flex>
              </Flex>
              <Flex
                gap="middle"
                align="center"
                justify="center"
                className="footer-f-"
              >
                <Flex>
                  <Link
                    className="footer-f-4-1-1-text link"
                    href="/terms-and-service"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>
                </Flex>
                <Flex>
                  <Link
                    className="footer-f-4-1-1-text link"
                    href="/privacypolicy"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </Flex>
                <Flex>
                  <Space wrap>
                    <Dropdown.Button
                      icon={<img src={Usa} />}
                      menu={{ items: DropDownItems }}
                      onClick={() => {}}
                    >
                      English
                    </Dropdown.Button>
                  </Space>
                </Flex>
              </Flex>
            </Flex>
          </Container>
        </Flex>
      </Flex>
    </>
  );
};

export default FooterLayout;
