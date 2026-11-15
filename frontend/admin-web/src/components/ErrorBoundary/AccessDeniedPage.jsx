import React from "react";
import { Heading, Paragraph } from "../Common/Typography";
import { Button } from "../Common/Widgets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AccessDeniedImage from "@src/assets/access-denied.png";

const AccessDeniedPage = () => {
  const { user } = useSelector((state) => state.auth || {});

  const navigate = useNavigate();

  const handleNavigateToDashboard = () => {
    if (user?.type === "brand") {
      navigate("/dashboard/segments");
    } else {
      navigate("/dashboard/posts");
    }
  };
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-screen tw-bg-gray-100 tw-p-6">
      <div className="tw-text-center tw-flex tw-flex-col tw-items-center tw-gap-4">
        <img
          src={AccessDeniedImage}
          alt="Access Denied"
          className="tw-mb-6 tw-w-72 tw-h-auto tw-rounded-md"
        />

        <Heading level={2} className="tw-text-red-400">
          Access Denied
        </Heading>
        <Paragraph className="tw-text-lg tw-text-gray-medium">
          You do not have permission to access this page.
        </Paragraph>
        <Button onClick={handleNavigateToDashboard}>Go Back Safe</Button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
