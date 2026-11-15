import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Flex } from "antd";
import EmailLogo from "../../../assets/emaillogo.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import resetSchema from "../../../schemas/resetSchema";

import "./Reset.less";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import LandingPageLayout from "@src/pages/layouts/LandingPageLayout";
import { AuthLayoutV2 } from "@src/layouts";
import { Text } from "@src/components";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import { Alert } from "antd";
import { CHECK_EMAIL_IN_SPAM_MESSAGE, EMAIL_SENT_MESSAGE } from "@src/utils/constant";

const ResetPage = () => {
  const { t } = useTranslation();
  const schema = useMemo(() => resetSchema(t), [t]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate()

  const onSubmit = useCallback(async (values) => {
    setIsLoading(true);
    setSuccessMessage(""); // Clear previous messages
    setErrorMessage(""); // Clear previous error messages
    try {
      const response = await axiosInstance.post(`/user/forgot-password`, { email: values.email });
      if (response && response.data) {
        setSuccessMessage(`${EMAIL_SENT_MESSAGE} ${CHECK_EMAIL_IN_SPAM_MESSAGE}`);
        form.setValue("email", "")
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to send the email. Please try again."
      );
    } finally {
      setIsLoading(false);
      setTimeout(()=>navigate('/login'), 3000)
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <LandingPageLayout>
      <AuthLayoutV2>
        <Flex gap="small" className="reset-p">
          <Flex className="reset-auth-1">
            <Flex
              className="reset-auth-lay"
              gap="large"
              vertical
              justify="center"
              align="center"
            >
              <Flex className="reset-p-flex2-1">
                <Text mainHeading className="text-center fs-24 fw-400">
                  {t("form.reset-form.heading")}
                </Text>
              </Flex>
              <Flex className="reset-p-flex2-2">
                <Text className="reset-p-flex2-2-desc">
                  {t("form.reset-form.desc")}
                </Text>
              </Flex>
              <div className="tw-flex tw-flex-col tw-items-center tw-w-full tw-max-w-md tw-gap-4">
                {/* Title Section */}

                {/* Email Input Field */}
                <div className="tw-relative tw-w-full tw-flex tw-flex-col">
                  <div className="tw-relative tw-w-full">
                    <img
                      src={EmailLogo}
                      alt="Email Logo"
                      className="tw-absolute tw-w-5 tw-h-5 tw-left-4 tw-top-1/2 tw-transform tw--translate-y-1/2"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      {...form.register("email")}
                      className={`tw-w-full tw-pl-12 tw-py-3 tw-border tw-rounded-lg tw-focus:ring-2 tw-focus:ring-blue-500 tw-focus:outline-none tw-text-sm tw-text-gray-700 
                        ${form.formState.errors.email ? 'tw-border-red-500' : ' '}`}
                    />
                  </div>

                  {/* Error message below input */}
                  {form.formState.errors.email && (
                    <p className="tw-mt-3 tw-text-xs tw-text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}

                  disabled={isLoading}
                  className={`tw-w-full tw-py-3 tw-text-sm tw-font-semibold tw-text-white tw-rounded-lg ${isLoading
                    ? "tw-bg-gray-400 tw-cursor-not-allowed"
                    : "tw-bg-black hover:tw-bg-gray-800 tw-cursor-pointer"
                    } tw-transition tw-duration-300 tw-ease-in-out`}
                >
                  {isLoading ? "Submitting..." : "Continue"}
                </button>


              </div>

              {/* Success Message */}
              {successMessage && (
                <Alert
                  message="Success"
                  description={successMessage}
                  type="success"
                  showIcon
                  style={{ marginTop: "20px", width: "100%" }}
                />
              )}
              {/* Error Message */}
              {errorMessage && (
                <Alert
                  message="Error"
                  description={errorMessage}
                  type="error"
                  showIcon
                  style={{ marginTop: "20px", width: "100%" }}
                />
              )}
              <Flex
                vertical
                className="reset-auth-f2"
                justify="center"
                align="center"
                gap={"1rem"}
              >
                <Link to={"/login"}>
                  <Text className={"fw-700 text-primary-600"}>
                    {t("form.reset-form.buttons.sign-in")}
                  </Text>
                </Link>
                <Text className="fs-14 fw-400">
                  Don’t have an account?{" "}
                  <Link to={"/registration"}>
                    <Text className={"fw-700 text-primary-600"}>Sign Up</Text>
                  </Link>
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </AuthLayoutV2>
    </LandingPageLayout>
  );
};

export default memo(ResetPage);
