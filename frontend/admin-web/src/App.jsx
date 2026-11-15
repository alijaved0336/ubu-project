import { ConfigProvider, Flex } from "antd";
import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./application-wide/MainRoutes";
import AxiosInterceptor from "./application-wide/axios/axios-interceptor";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { notification } from "antd";
import PropTypes from "prop-types";
import { px2remTransformer, StyleProvider } from "@ant-design/cssinjs";

const px2rem = px2remTransformer({ rootValue: 16 }); // 32px = 1rem

function App({ children }) {
  notification.config({
    placement: "topRight",
    top: 50,
    duration: 3,
    rtl: false,
  });

  return (
    <GoogleOAuthProvider clientId="471806960618-bf51i271s5k2bp2foisr20tb3fsg77ba.apps.googleusercontent.com">
      <BrowserRouter>
        <AxiosInterceptor>
          <ConfigProvider
            theme={{
              components: {
                Switch: {
                  colorPrimary: "#000",
                  algorithm: true,
                },
                Button: {
                  colorPrimary: "#000000",
                  colorPrimaryHover: "rgba(0,0,0,0.7)",
                  colorPrimaryTextHover: "#000000",
                  colorPrimaryActive: "#000000",
                  colorPrimaryTextActive: "#000000",
                  defaultBorderColor: "#000000",
                  colorPrimaryBorder: "#000000",
                  wireframe: true,
                },
                Collapse: {
                  headerBg: "#fff",
                  colorBgSolidActive: "#FFFFFF",
                  colorText: "#000000", // Black text for Collapse
                  colorBgContainer: "#FFFFFF", // White background for Collapse
                  // colorBorder: "#000000", // Black border for Collapse panels
                  colorPrimary: "#FFFFFF", // Black for primary actions
                },
                Steps: {
                  colorPrimary: "#000000", // Primary black color
                  colorText: "#000000", // Black text
                  colorTextDisabled: "#A0A0A0", // Disabled text color
                },
                Spin: {
                  colorPrimary: "#000000",
                },
                DatePicker: {
                  colorPrimary: "#000000", // Primary black color
                  colorText: "#000000", // Black text

                  cellActiveWithRangeBg: "rgba(0,0,0,0.1)",
                },
              },
            }}
          >
            <StyleProvider transformers={[px2rem]}>
              <MainRoutes />
            </StyleProvider>
          </ConfigProvider>
        </AxiosInterceptor>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

App.propTypes = {
  children: PropTypes.node,
};
export default App;
