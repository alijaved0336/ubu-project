import { useState } from "react";
import { Alert, Button, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import "./Dashboard.less";
import { CHECK_EMAIL_IN_SPAM_MESSAGE } from "@src/utils/constant";

const EmailVerificationBanner = ({ emailVerified }) => {
  const [resendLoading, setResendLoading] = useState(false);

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      const response = await axiosInstance.get("/resend/email");
      message.success(response.data + " " + CHECK_EMAIL_IN_SPAM_MESSAGE);
    } catch (error) {
      console.error("Error resending verification email:", error);
      message.error("Something went wrong. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  // if (emailVerified) return null;
  return (
    <div className="verify-email-message">
      <Alert
        message={
          <>
            Your email is not verified yet. Please verify your email to unlock
            all features and access your account fully.{" "}
            {resendLoading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ margin: "6px", color: "#ff7800" }}
                    spin
                  />
                }
              />
            ) : (
              <Button
                type="link"
                className="resend-verification-email"
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </Button>
            )}
          </>
        }
        type="warning"
        className="email-verification-banner"
      />
    </div>
  );
};

EmailVerificationBanner.propTypes = {
  emailVerified: PropTypes.bool.isRequired,
};

export default EmailVerificationBanner;
