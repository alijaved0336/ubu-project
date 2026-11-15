import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Flex, notification } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Google from "../../../assets/google.png";
import Fb from "../../../assets/fb-logo.png";
import EmailLogo from "../../../assets/emaillogo.png";
import PassLogo from "../../../assets/passlogo.png";
import AuthForm from "../../../components/AuthForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  isMobile,
  isTablet,
  isDesktop,
  browserName,
  browserVersion,
  osName,
  osVersion,
} from "react-device-detect";
import getSignInSchema from "../../../schemas/signInSchema";
import WhiteStoreButton from "../../../components/WhiteSocialButtons";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import useLogin from "../../../application-wide/api-gateway-hooks/use-login";

import { useVerifyGoogle } from "../../../application-wide/api-gateway-hooks";
import Notification from "../../../components/Notification";
import { useLocation } from "react-router-dom";
import LandingPageLayout from "../../layouts/LandingPageLayout";
import Loader from "../../../components/Loader";
import { showNotification } from "../../../utils/showNotification";
import { AuthLayoutV2 } from "@src/layouts";
import { Text } from "@src/components";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@src/store/features/authSlice";
import { isSuccess } from "@src/utils/responseHelpers";
import "./SigninPage.less";
import axios from "axios";
import AppleSignIn from "react-apple-signin-auth";
import useVerifyApple from "@src/application-wide/api-gateway-hooks/use-verify-apple";
import AppleLogo from "../../../assets/apple-color.png";
import { FullStory } from "@fullstory/browser";
import LogRocket from "logrocket";
import { ADMIN_EMAILS, FALLBACK_ERROR_MESSAGE } from "@src/utils/constant";

const SignInPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [googleSignInLoading, setGoogleSignInLoading] = useState(false);
  const [appleVerifyLoading, setAppleVerifyLoading] = useState(false);

  const schema = useMemo(() => getSignInSchema(t), [t]);
  const { value, loading: signInloading, onLogin } = useLogin();
  const dispatch = useDispatch();

  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const getDeviceType = () => {
    if (isDesktop) return "desktop";
    if (isMobile) return "mobile";
    if (isTablet) return "tablet";
    return "unknown";
  };
  const {
    value: googleVerifyValue,
    loading: googleVerifyLoading,
    onVerifyLogin,
  } = useVerifyGoogle();
  const location = useLocation();
  const [error, setError] = useState(
    location.state ? location.state.error : null
  );

  const {
    value: appleVerifyValue,
    // loading: appleVerifyLoading,
    onAppleVerifyLogin,
  } = useVerifyApple();

  const getSessionLog = async () => {
    let ipAddress;
    try {
      const ipResponse = await axios.get("https://api.ipify.org?format=json");
      ipAddress = ipResponse.data.ip;
    } catch (error) {
      console.error("Error fetching ip address:", error);
    }
    const sessionLog = {
      ip_address: ipAddress,
      operating_system: osName + " " + osVersion,
      browsing_info: browserName + " " + browserVersion,
      device_type: getDeviceType(),
    };

    return sessionLog;
  };
  const handleUserNavigation = async (response) => {

    //Uncomment this later

    // if (response.data) {
    //   dispatch(setCredentials(response.data));
    // }
    // const user = response.data;
    // LogRocket.identify(user.id, { name: user.first_name, email: user.email });
    if (
      isSuccess(response.status) &&
      response?.data.msg?.includes("dashboard")
    ) {


      if (response.data.type === "brand") {
        //Remove this later
        if (response.data) {
          dispatch(setCredentials(response.data));
        }
        const user = response.data;
        LogRocket.identify(user.id, { name: user.first_name, email: user.email });

        if (ADMIN_EMAILS.includes(response.data.email)) {
          navigate("/dashboard/reports");
        } else {
          navigate("/dashboard/segments");
        }
      } else {
        if (response.data.isScanned === false) {
          //UNComment This Later

          // navigate("/qr-Page");
          // setIsProcessing(false);


          showNotification({
            notificationType: "error",
            description: "Your signup is not yet complete. Please open the iOS app and finish the remaining steps to log in.",
          });

         setIsProcessing(false);


          return;
        }

        //Remove this later
        if (response.data) {
          dispatch(setCredentials(response.data));
        }
        const user = response.data;
        LogRocket.identify(user.id, { name: user.first_name, email: user.email });
        navigate("/dashboard/posts");
      }

    } else {
      if (response.data?.msg?.includes("sign")) {

        //UNComment this later

        // navigate("/registration/role", {
        //   state: { email: response.data?.email },
        // });


        showNotification({
          notificationType: "error",
          description: "Your signup is not yet complete. Please open the iOS app and finish the remaining steps to log in.",
        });

        setIsProcessing(false);


      } else if (
        response?.response?.data?.message == "Role Doesnt match with your email"
      ) {
        //UnComment this later

        // navigate("/registration/role", {
        //   state: { email: response?.response?.data?.error },
        // });


        showNotification({
          notificationType: "error",
          description: "Your signup is not yet complete. Please open the iOS app and finish the remaining steps to log in.",
        });

        setIsProcessing(false);



      } else {
        showNotification({
          notificationType: "error",
          message: response?.response?.data?.error,
          description: response?.response?.data?.message,
        });
      }
    }
  };

  const onSubmit = async (values) => {
    setIsProcessing(true);

    let response = null;

    const sessionLog = await getSessionLog();

    try {
      response = await onLogin(values.email, values.password, sessionLog);

      if (![200, 201].includes(response?.status)) {
        setIsProcessing(false);
        notification.error({
          message: "Error",
          description:
            response?.response?.data?.message || FALLBACK_ERROR_MESSAGE,
        });
      }
    } catch (error) {
      setIsProcessing(false);
      console.log("error", error);
      response = null;
    }

    if (response?.data && [200, 201].includes(response?.status)) {
      await handleUserNavigation(response);
    }
  };

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const handleGoogleSuccess = async (response) => {
    try {
      const { access_token } = response;
      setGoogleSignInLoading(true);
      const sessionLog = await getSessionLog();
      const resp = await onVerifyLogin(access_token, sessionLog);
      if (!isSuccess(resp.status)) {
        notification.error({
          message: "Error",
          description: resp?.response?.data?.message || FALLBACK_ERROR_MESSAGE,
        });
        return;
      }
      await handleUserNavigation(resp);
    } catch (error) {
      console.error("Error handling Google success:", error);
    } finally {
      setGoogleSignInLoading(false);
    }
  };

  const handleGoogleError = (error) => {};

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  const handleAppleSuccess = async (response) => {
    const sessionLog = await getSessionLog();
    setAppleVerifyLoading(true);
    try {
      if (response.error) {
        console.error("Apple Sign-In Error:", response.error);
        return;
      }
      const authorizationData = response.authorization;

      const { code, id_token } = authorizationData;
      const user = response?.user || null;
      const resp = await onAppleVerifyLogin({
        code: code,
        user: user,
        id_token: id_token,
        sessionLog,
      });
      await handleUserNavigation(resp);
    } catch (error) {
      console.error("Error handling Apple success:", error);
    } finally {
      setAppleVerifyLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setError(null);
  };
  const handleLink = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isProcessing && isAuthenticated)
    return (
      <Navigate
        to={user?.type === "brand" ? "/dashboard/segments" : "/dashboard/posts"}
      />
    );

  return (
    <LandingPageLayout>
      {/* {(loading || googleVerifyLoading) && <Loader />} */}
      <AuthLayoutV2>
        {error != null && (
          <Notification
            message={error}
            type="error"
            onClose={handleCloseNotification}
          />
        )}
        <Flex className="SigninForm" vertical gap={"1rem"}>
          <Text mainHeading className="text-center fs-24 fw-400">
            {t("login.heading")}
          </Text>
          <AuthForm
            useForm={form}
            onSubmit={onSubmit}
            chcekBoxValue={t("form.sign-in.buttons.checkbox")}
            submitText={t("form.sign-in.buttons.sign-in")}
            forgotPasswordText={t("form.sign-in.buttons.forgot-password")}
            loading={signInloading || isProcessing}
            inputFields={[
              {
                name: "email",
                placeholder: t("form.sign-in.placeholders.email-placeholder"),
                prefix: <img src={EmailLogo} className="site-form-item-icon" />,
              },
              {
                name: "password",
                type: showPassword ? "text" : "password",
                placeholder: t(
                  "form.sign-in.placeholders.password-placeholder"
                ),
                prefix: <img src={PassLogo} className="site-form-item-icon" />,
                suffix: showPassword ? (
                  <EyeInvisibleOutlined
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <EyeOutlined
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                ),
              },
            ]}
          />
          <Divider plain className="register-auth-divider ">
            <Text className={"fs-12 fw-400 text-greyscale-500"}>
              Or sign in with
            </Text>
          </Divider>

          <Flex vertical gap="large">
            <Flex className="social-logins">
              <Flex className="register-auth-white-social-btns">
                <WhiteStoreButton
                  isLoading={googleSignInLoading}
                  imgSrc={!googleSignInLoading && Google}
                  largeText="Google"
                  handleClick={googleLogin}
                />

                <p style={{ paddingRight: "5px" }}></p>

                <AppleSignIn
                  authOptions={{
                    clientId: "ubu.platform.login",
                    scope: "name email",
                    redirectURI: `https://ubu.live/login`,
                    state: "state",
                    nonce: "nonce",
                    usePopup: true,
                    responseType: "code",
                    responseMode: "form_post",
                  }}
                  onSuccess={handleAppleSuccess}
                  render={(renderProps) => (
                    <WhiteStoreButton
                      imgSrc={AppleLogo}
                      largeText="Apple"
                      handleClick={renderProps.onClick}
                      loading={appleVerifyLoading}
                    />
                  )}
                />
              </Flex>
              {/* <Flex className="register-auth-white-social-btns">
                <WhiteStoreButton
                  className="register-auth-white-social-btns"
                  imgSrc={Fb}
                  largeText="Facebook"
                />
              </Flex> */}
            </Flex>
            <Flex className="register-auth-f2" justify="center" align="center">
              <Text className="register-auth-f2-text fs-14 fw-400">
                Don’t have an account?{" "}
                <Link to="/registration">
                  <Text className={"fw-700 text-primary-600"}>Sign Up</Text>
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </AuthLayoutV2>
    </LandingPageLayout>
  );
};

export default memo(SignInPage);
