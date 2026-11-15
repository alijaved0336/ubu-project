import { Link } from "react-router-dom";
import { memo, useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import LandingPageLayout from "@src/pages/layouts/LandingPageLayout";
import { AuthLayoutV2 } from "@src/layouts";
import axiosInstance from "@src/application-wide/axios/axios-instance";

const ChangePassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Extract token from URL query parameters
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setErrorMessage("Invalid or missing reset token.");
    }
  }, [location]);

  const onSubmit = useCallback(
    async (values) => {
      setIsLoading(true);
      setSuccessMessage("");
      setErrorMessage("");
      try {
        if (values.newPassword !== values.confirmPassword) {
          setErrorMessage("Passwords do not match!");
          setIsLoading(false);
          return;
        }

        const response = await axiosInstance.put("/user/reset-password", {
          token,
          newPassword: values.newPassword,
        });
        if (response && response.data) {
          setSuccessMessage("Your password has been reset successfully.");
          // Redirect to login after success
          setTimeout(() => navigate("/login"), 3000);
        } else {
          throw new Error("Unexpected response from the server.");
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to reset the password. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, navigate]
  );

  return (
    <LandingPageLayout>
      <AuthLayoutV2>
        <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-full tw-pt-8 tw-pb-32 tw-px-8">
          <div className="tw-w-full tw-max-w-md tw-bg-white tw-p-6 tw-rounded-lg">
            <h1 className="tw-text-[1.5rem] tw-font-[400] tw-text-center tw-mb-4 tw-leading-[30px] tw-tracking-[0.2px] tw-text-[#0F172A] tw-manrope">
              {t("form.reset-password.heading", "Enter New Password")}
            </h1>
            {errorMessage && (
              <div className="tw-mb-6 tw-p-4 tw-bg-red-100 tw-text-red-800 tw-rounded-lg">
                {errorMessage}
              </div>
            )}
            <Form layout="vertical" onFinish={onSubmit}>
              {/* New Password Field */}
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter your new password" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters long",
                  },
                ]}
              >
                <div
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db", // Light gray border
                    borderRadius: "0.375rem", // Rounded corners
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem", // Space between input and icon
                  }}
                >
                  <Input.Password
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-lg tw-flex"
                    placeholder="Enter New Password"
                    style={{
                      width: "100%",
                      border: "none", // Remove input's default border
                      outline: "none", // Remove outline on focus
                      boxShadow: "none", // Remove any inner shadow
                      fontSize: "0.875rem", // Text size
                      color: "#4b5563", // Text color
                    }}
                  />
                </div>
              </Form.Item>

              {/* Confirm Password Field */}
              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <div
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db", // Light gray border
                    borderRadius: "0.375rem", // Rounded corners
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem", // Space between input and icon
                  }}
                >
                  <Input.Password
                    placeholder="Confirm Password"
                    style={{
                      width: "100%",
                      border: "none", // Remove input's default border
                      outline: "none", // Remove outline on focus
                      boxShadow: "none", // Remove any inner shadow
                      fontSize: "0.875rem", // Text size
                      color: "#4b5563", // Text color
                    }}
                  />
                </div>
              </Form.Item>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="tw-w-full tw-bg-black tw-text-white tw-py-2 tw-rounded-lg tw-text-lg tw-hover:bg-gray-800 tw-transition"
              >
                {isLoading
                  ? t("form.reset-password.buttons.loading", "Loading...")
                  : t(
                      "form.reset-password.buttons.confirm",
                      "Confirm & Continue"
                    )}
              </button>
            </Form>
            {successMessage && (
              <div className="tw-mt-4 tw-p-4 tw-bg-yellow-100 tw-text-yellow-800 tw-rounded-lg">
                {successMessage}
              </div>
            )}
            <div className="tw-mt-6 tw-text-center tw-text-sm">
              <Link to="/login" className="tw-text-blue-600 tw-hover:underline">
                {t("form.reset-password.buttons.sign-in", "Back to Sign In")}
              </Link>
              <p className="tw-mt-2">
                {t(
                  "form.reset-password.prompt.no-account",
                  "Don’t have an account?"
                )}{" "}
                <Link
                  to="/registration"
                  className="tw-text-blue-600 tw-hover:underline"
                >
                  {t("form.reset-password.buttons.sign-up", "Sign Up")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </AuthLayoutV2>
    </LandingPageLayout>
  );
};

export default memo(ChangePassword);
