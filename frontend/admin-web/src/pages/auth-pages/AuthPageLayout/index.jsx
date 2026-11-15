import { Divider, Flex, Layout, Typography } from "antd";

import { Content } from "antd/es/layout/layout";
import "./AuthPageLayout.less";
import LoginDotted from "../../../assets/login-dotted.png";
import Login1 from "../../../assets/login1.png";
import Login2 from "../../../assets/login2.png";
import Login3 from "../../../assets/login3.png";
import LoginDotted1 from "../../../assets/login-dotted1.png";
import Login4 from "../../../assets/login4.png";
import Login5 from "../../../assets/login5.png";
import Login6 from "../../../assets/login6.png";
import { Container } from "@src/components";

function AuthPageLayout({ children }) {
  const { Text } = Typography;
  return (
    <>
      <Flex align="center" justify="space-between" className="login-p">
        <Flex justify="start" align="end" className="login-p-flex1">
          <Flex className="login-p-flex1-f1">
            <img
              src={LoginDotted1}
              className="login-p-flex1-f1-img"
              alt="dotted"
            />
          </Flex>
          <Flex className="login-p-flex1-f2">
            <Flex className="login-p-flex1-f2-f1">
              <img
                className="login-p-flex1-f2-f1-img"
                src={Login4}
                alt="img1"
              />
            </Flex>
            <Flex className="login-p-flex1-f2-f2">
              <img className="login-p-flex1-f2-img" src={Login5} alt="img2" />
            </Flex>
            <Flex className="login-p-flex1-f2-f3">
              <img
                className="login-p-flex1-f2-f3-img"
                src={Login6}
                alt="img3"
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Layout className="main-layout">
            <Layout className="layout-background">
              <Content className="content">
                <Container overflow="hidden">{children}</Container>
              </Content>
            </Layout>
          </Layout>
        </Flex>
        <Flex vertical className="login-p-f1">
          <Flex className="login-p-f1-f1">
            <img src={LoginDotted} className="login-p-f1-f1-img" alt="dotted" />
          </Flex>
          <Flex className="login-p-f1-f2">
            <Flex className="login-p-f1-f2-f1">
              <img className="login-p-f1-f2-f1-img" src={Login1} alt="img1" />
            </Flex>
            <Flex className="login-p-f1-f2-f2">
              <img className="login-p-f1-f2-img" src={Login2} alt="img2" />
            </Flex>
            <Flex className="login-p-f1-f2-f3">
              <img className="login-p-f1-f2-f3-img" src={Login3} alt="img3" />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default AuthPageLayout;
