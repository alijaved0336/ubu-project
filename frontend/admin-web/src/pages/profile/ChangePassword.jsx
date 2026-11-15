import styles from "./ProfilePage.module.css";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";

import { NavLink } from "react-router-dom";
import { Button, Form, Input, Layout, message } from "antd";
import { useTranslation } from "react-i18next";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@src/utils/showNotification";
import { isSuccess } from "@src/utils/responseHelpers";
import { logout } from "@src/store/features/authSlice";
import { useDispatch } from "react-redux";

const ChangePassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        message.warning("New and Confirm Passwords do not match!");
        return;
      }

      setIsLoading(true);
      const response = await axiosInstance.put("/user/change_password", {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      if (isSuccess(response.status)) {
        showNotification({
          notificationType: "success",
          message: "Password Changed Successfully",
          description: "Your password has been changed successfully",
        });
        dispatch(logout());
        navigate("/login");
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: "Password Updation Failed",
        description:
          error.response?.data?.message ||
          "Failed to reset the password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          {
            title: <NavLink to="/dashboard/profile">Profile</NavLink>,
          },
          { title: "Change Password" },
        ]}
      />
      <Content className={styles.content}>
        <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-full tw-pt-8 tw-pb-32">
          <div className="tw-w-full tw-max-w-md tw-bg-white tw-p-6 tw-rounded-lg">
            <h1 className="tw-text-lg tw-font-[400] tw-text-center tw-mb-4 tw-leading-[30px] tw-tracking-[0.2px] tw-text-[#0F172A] tw-manrope">
              {t("form.reset-password.heading", "Change Your Password")}
            </h1>
            <Form layout="vertical" onFinish={onSubmit}>
              <Form.Item
                name="oldPassword"
                rules={[
                  { required: true, message: "Please enter your old password" },
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
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Input.Password
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-lg tw-flex"
                    placeholder="Enter Old Password"
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      fontSize: "0.875rem",
                      color: "#4b5563",
                    }}
                  />
                </div>
              </Form.Item>

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
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Input.Password
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-lg tw-flex"
                    placeholder="Enter New Password"
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      fontSize: "0.875rem",
                      color: "#4b5563",
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
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <Input.Password
                    placeholder="Confirm Password"
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      fontSize: "0.875rem",
                      color: "#4b5563",
                    }}
                  />
                </div>
              </Form.Item>

              {/* Submit Button */}
              <Button
                htmlType="submit"
                size="large"
                loading={isLoading}
                className="tw-w-full tw-bg-black tw-text-white tw-py-2 tw-rounded-lg tw-text-md tw-hover:bg-gray-800 tw-transition"
              >
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ChangePassword;
