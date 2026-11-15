import React from "react";
import PropTypes from "prop-types";

const Progressbar = ({ currentStep, totalSteps }) => {
  const currentProgress = ((currentStep + 1) / totalSteps) * 100;
  return (
    <div className="tw-w-full tw-h-[12px] tw-bg-[#1e1e1e1f]">
      <div
        className="tw-transition-all tw-duration-200"
        style={{
          height: "100%",
          width: `${currentProgress}%`,
          backgroundColor: "#039837",
        }}
      ></div>
    </div>
  );
};

Progressbar.propTypes = {
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
};

export default Progressbar;
