import { useState } from "react";
import LandingPageLayout from "../layouts/LandingPageLayout";
import axiosInstance from "../../application-wide/axios/axios-instance";
import { showNotification } from "@src/utils/showNotification";
import "./ComingSoon.less";
import { Spin } from "antd";
import { CHECK_EMAIL_IN_SPAM_MESSAGE } from "@src/utils/constant";

const successMessage = `Thank You for Subscribing! Exciting Updates Coming Soon. ${CHECK_EMAIL_IN_SPAM_MESSAGE}`;
const ComingSoon = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputType, setInputType] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState(
    "Please enter your e-mail address"
  );
  const [toggleLabel, setToggleLabel] = useState(
    "No email? Use your Phone number"
  );

  const handleNotifyMe = async (e) => {
    e.preventDefault();
    if (inputValue !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (inputType === "email" && !emailRegex.test(inputValue)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
      const emailBody = `
      <div style="background-color: #fff; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 10px;">
        <div style="text-align: center; padding: 10px 0; background-color: #000;">
          <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
            UBU
          </h1>
        </div>
        <div style="padding: 20px;">
          <h1 style="font-size: 1.5rem; color: #000; text-align: center;">New Subscription Alert</h1>
          <p style="font-size: 1rem; line-height: 1.5; color: #333;">
            You have a new subscriber!
          </p>
          <p style="font-size: 1rem; line-height: 1.5; color: #333;">
            <strong>Subscriber's ${
              inputType === "tel" ? "Phone" : "Email"
            }:</strong> ${inputValue}
          </p>
        </div>
      </div>
    `;
      try {
        if (inputType === "email") {
          setIsLoading(true);
          await axiosInstance.post(`/mail/send`, {
            to: "sohaib@codingcops.com",
            subject: `You've Got a New UBU Subscriber!`,
            text: emailBody,
            isHtml: true,
          });

          const res = await axiosInstance.post("send-email-to-subscriber", {
            [inputType === "tel" ? "phone_number" : "email"]: inputValue,
            page: "landing",
          });
          if (res.status === 201) {
            setInputValue("");
            showNotification({
              notificationType: "success",
              message: `${successMessage}`,
            });
          }
        } else {
          setIsLoading(true);
          const res = await axiosInstance.post("send-message-to-subscriber", {
            [inputType === "tel" ? "phone_number" : "email"]: inputValue,
            page: "landing",
          });
          if (res.status === 201) {
            setInputValue("");
            showNotification({
              notificationType: "success",
              message: `${successMessage}`,
            });
          }
        }
      } catch (error) {
        console.error(error);
        showNotification({
          notificationType: "error",
          message: `${error.response.data.message}`,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      showNotification({
        notificationType: "error",
        message: "Please enter a valid email / phone",
      });
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setErrorMessage("");
  };

  const handleLabelClick = () => {
    if (inputType === "email") {
      setInputType("tel");
      setInputPlaceholder("Enter your phone number");
      setToggleLabel("No phone? Use your email address");
    } else {
      setInputType("email");
      setInputPlaceholder("Enter your email address");
      setToggleLabel("No email? Use your phone number");
    }
  };

  return (
    <LandingPageLayout>
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <h1>Something Awesome is coming...</h1>
          <div className="text-and-form">
            <p className="text">
              Big things are coming! We&apos;re working on something special
              just for you. Stay tuned for the grand reveal! Subscribe to be the
              first to know about all the features.
            </p>
            <form
              className="subscribe-form"
              onSubmit={(e) => handleNotifyMe(e)}
            >
              <div>
                <input
                  type={inputType}
                  placeholder={inputPlaceholder}
                  value={inputValue}
                  onChange={handleChange}
                />
                <p
                  className="toggle-label"
                  onClick={handleLabelClick}
                  style={{ cursor: "pointer" }}
                >
                  {toggleLabel}
                </p>
                {errorMessage && (
                  <p className="tw-text-red-800">{errorMessage}</p>
                )}
              </div>

              <button className="notify-button" type="submit">
                Notify me {isLoading ? <Spin /> : null}
              </button>
            </form>
          </div>
        </div>
        <div className="coming-soon-banner">
          <span className="banner-text">C</span>
        </div>
      </div>
    </LandingPageLayout>
  );
};

export default ComingSoon;
