import { Button, Flex, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import UBULogo from "../../../assets/ubu-logo.png"
import './Layout.less'
const InfluencerLayout = ({children}) => {
    return (
        <>
            <Layout className="inf-layout">
                {/* <Header className="inf-header">
                    <Flex justify="space-between" align="center" className="inf-header-pdiv">
                        <img src={UBULogo} />
                        <Button className="inf-header-btn">Creator Login</Button>
                    </Flex>
                </Header> */}
                <Content className="inf-content">
                    <Flex justify="center" align="center" className="inf-content-pdiv">
                        {children}
                    </Flex>
                </Content>
            </Layout>
        </>
)
}
export default InfluencerLayout;