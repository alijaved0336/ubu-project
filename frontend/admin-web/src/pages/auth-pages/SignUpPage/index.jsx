import { memo, useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Flex, message, notification, Typography } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  AppleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Google from "../../../assets/google.png";
import AppleLogo from "../../../assets/apple-color.png";
import Fb from "../../../assets/fb-logo.png";
import EmailLogo from "../../../assets/emaillogo.png";
import PassLogo from "../../../assets/passlogo.png";
import UsernameLogo from "../../../assets/username-logo.png";
import AuthPageLayout from "../AuthPageLayout";
import AuthForm from "../../../components/AuthForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WhiteStoreButton from "../../../components/WhiteSocialButtons";
import { Link, useNavigate } from "react-router-dom";
import getSignUpSchema from "../../../schemas/signUpSchema";
import LandingPageLayout from "../../layouts/LandingPageLayout";
import { showNotification } from "../../../utils/showNotification";
import useRegistration from "../../../application-wide/api-gateway-hooks/use-registration";
import { useGoogleLogin } from "@react-oauth/google";
import { useVerifyGoogle } from "../../../application-wide/api-gateway-hooks";
import Loader from "../../../components/Loader";
import { Text } from "@src/components";
import { useDispatch } from "react-redux";
import { setCredentials } from "@src/store/features/authSlice";
import { AuthLayoutV2 } from "@src/layouts";
import Recaptcha from "../../../components/Recaptcha/Recaptcha"; // Import your Recaptcha component
import "./SignUpPage.less";
import useVerifyApple from "@src/application-wide/api-gateway-hooks/use-verify-apple";
import AppleLogin from "react-apple-login";
import { render } from "less";
import AppleSignIn from "react-apple-signin-auth";
import { useScript, appleAuthHelpers } from "react-apple-signin-auth";
import { CHECK_EMAIL_IN_SPAM_MESSAGE } from "@src/utils/constant";
import { isSuccess } from "@src/utils/responseHelpers";

const SignUpPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const schema = useMemo(() => getSignUpSchema(t), [t]);
  const { loading, value, onRegistration } = useRegistration();
  const [appleVerifyLoading, setAppleVerifyLoading] = useState(false);

  const {
    value: googleVerifyValue,
    loading: googleVerifyLoading,
    onVerifyLogin,
  } = useVerifyGoogle();

  const dispatch = useDispatch();
  const captchaRef = useRef(null);

  const {
    value: appleVerifyValue,
    // loading: appleVerifyLoading,
    onAppleVerifyLogin,
  } = useVerifyApple();

  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null); // State to store reCAPTCHA token

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = useCallback(
    async (values) => {
      
      showNotification({
        notificationType: "warning",
        description: "Website registrations are temporarily unavailable. Please use our iOS app to continue registering.",
      });
      //UnComment this later


      // if (!recaptchaToken) {
      //   showNotification({
      //     notificationType: "error",
      //     message: "reCAPTCHA validation failed",
      //     description: "Please complete the reCAPTCHA verification.",
      //   });

      //   return;
      // }
      // const { checkbox, ...payload } = values;
      
      // const response = await onRegistration({ ...payload, recaptchaToken });

      // if (response.status === 201) {
      //   message.success(
      //     `A verification email has been sent on your given email address. ${CHECK_EMAIL_IN_SPAM_MESSAGE}`,
      //     10
      //   );
      //   dispatch(setCredentials(response.data));
      //   navigate("/registration/role", { state: { email: payload.email } });
      //   captchaRef?.current?.reset();
      // } else {
      //   showNotification({
      //     notificationType: "error",
      //     message:
      //       response.response?.data?.error === "Conflict"
      //         ? "OOPS"
      //         : response.response?.data?.error,
      //     description: response.response?.data?.message,
      //   });
      //   captchaRef?.current?.reset();
      // }
    },
    [recaptchaToken]
  );

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const handleGoogleSuccess = async (response) => {
    try {
      const { access_token } = response;
      const resp = await onVerifyLogin(access_token);
      if (!isSuccess(resp.status)) {
        notification.error({
          message: "Error",
          description: resp?.response?.data?.message || FALLBACK_ERROR_MESSAGE,
        });
        return;
      }
      if (resp?.data) {
        dispatch(setCredentials(resp.data));
      }

      if (resp && resp.data.msg?.[0].includes("dashboard")) {
        let user = resp.data.user;
        if (user.type === "brand") {
          navigate("/dashboard/segments");
        } else {
          navigate("/dashboard/posts");
        }
        // if (user.isAdmin) {
        // } else {
        //   navigate("/coming-soon");
        // }
      } else {
        navigate("/registration/role", { state: { email: resp.data.email } });
      }
    } catch (error) {
      console.error("Error handling Google success:", error);
    }
  };

  const handleAppleSuccess = async (response) => {
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
      });

      if (resp && resp.data.msg.includes("dashboard")) {
        let user = resp.data.user;
        if (user.type === "brand") {
          navigate("/dashboard/segments");
        } else {
          navigate("/dashboard/posts");
        }
        // if (user.isAdmin) {
        // } else {
        //   navigate("/coming-soon");
        // }
      } else {
        navigate("/registration/role", { state: { email: resp.data.email } });
      }
    } catch (error) {
      console.error("Error handling Apple success:", error);
    } finally {
      setAppleVerifyLoading(false);
    }
  };


  const handleGoogleClick = async (response) => {
    showNotification({
      notificationType: "warning",
      description: "Website registrations are temporarily unavailable. Please use our iOS app to continue registering.",
    });
  } 

  const handleAppleClick = async (response) => {
    showNotification({
      notificationType: "warning",
      description: "Website registrations are temporarily unavailable. Please use our iOS app to continue registering.",
    });
  } 

  const handleGoogleError = (error) => {};
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  const handleValidateCaptcha = () => {
    if (!recaptchaToken) {
      captchaRef?.current?.setErrorMessage();
    }
  };

  return (
    <LandingPageLayout>
      {/* {(loading || googleVerifyLoading) && <Loader />} */}
      <AuthLayoutV2>
        <Flex className="SignUpForm" vertical gap={"1rem"}>
          <Text mainHeading className="text-center fs-24 fw-400">
            {t("form.sign-up.heading")}
          </Text>
          <AuthForm
            useForm={form}
            onSubmit={onSubmit}
            onValidateCaptcha={handleValidateCaptcha}
            chcekBoxValue={t("form.sign-up.buttons.checkbox")}
            cbValue={t("form.sign-up.buttons.checkbox-value")}
            submitText={t("form.sign-up.buttons.sign-up")}
            signupLabel={t("form.sign-up.placeholders.label")}
            forgotPasswordText={t("form.sign-up.buttons.forgot-password")}
            loading={loading}
            inputFields={[
              {
                name: "first_name",
                placeholder: "First Name",
                rules: [
                  {
                    pattern: /^[A-Za-z ]+$/,
                    message: "Only alphabets are allowed",
                  },
                ],
                prefix: <img src={UsernameLogo} />,
              },
              {
                name: "last_name",
                placeholder: "Last Name",
                rules: [
                  {
                    pattern: /^[A-Za-z ]+$/,
                    message: "Only alphabets are allowed",
                  },
                ],
                prefix: <img src={UsernameLogo} />,
              },
              {
                name: "dob",
                type: "date",
                placeholder: t("form.sign-up.placeholders.dob-placeholder"),
                prefix: <CalendarOutlined style={{ color: '#64748b' }} />,
              },
              {
                name: "email",
                placeholder: t("form.sign-up.placeholders.email-placeholder"),
                prefix: <img src={EmailLogo} />,
              },
              {
                name: "password",
                type: showPassword ? "text" : "password",
                placeholder: t(
                  "form.sign-up.placeholders.password-placeholder"
                ),
                prefix: <img src={PassLogo} />,
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
              {
                name: "confirm_password",
                type: "password",
                placeholder: "Confirm Password",
                prefix: <img src={PassLogo} />,
                rules: [
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ],
              },
            ]}            
            Captcha={
              <div className="tw-mb-4">
                <Recaptcha ref={captchaRef} onVerify={setRecaptchaToken} />
              </div>
            }
          />

          <Divider plain className="register-auth-divider ">
            <Text className={"fs-12 fw-400 text-greyscale-500"}>
              {t("form.sign-up.placeholders.signup-with")}
            </Text>
          </Divider>

          <Flex vertical gap="large">
            <Flex className="social-logins">
              <Flex className="register-auth-white-social-btns">
                {/* <WhiteStoreButton
                  imgSrc={Google}
                  largeText="Google"
                  handleClick={googleLogin}
                  isLoading={googleVerifyLoading}
                /> */}

                <WhiteStoreButton
                  imgSrc={Google}
                  largeText="Google"
                  handleClick={handleGoogleClick}
                  isLoading={false}
                />

                <p style={{ paddingRight: "5px" }}></p>

                {/* <AppleSignIn
                  authOptions={{
                    clientId: "ubu.platform.login",
                    scope: "name email",
                    redirectURI: "https://ubu.live/registration",
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
                /> */}

                <WhiteStoreButton
                  imgSrc={AppleLogo}
                  largeText="Apple"
                  handleClick={handleAppleClick}
                  loading={false}
                />
              </Flex>
            </Flex>
            <Flex className="register-auth-f2" justify="center" align="center">
              <Text className="register-auth-f2-text fs-14 fw-400">
                {t("form.sign-up.placeholders.dont-have-account")}{" "}
                <Link to="/login">
                  <Text className={"fw-700 text-primary-600"}>
                    {t("form.sign-up.placeholders.sign-in-link")}
                  </Text>
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </AuthLayoutV2>
    </LandingPageLayout>
  );
};

export default memo(SignUpPage);
