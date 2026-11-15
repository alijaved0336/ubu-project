import cn from "@src/cn";
import PropTypes from "prop-types";
import React from "react";

const SuccessTickIcon = ({ color = "orange", className }) => {
  return (
    <div
      className={cn(
        "tw-flex tw-justify-center tw-items-center   tw-backdrop-blur-18 tw-rounded-full tw-w-[100px] tw-h-[100px]",
        {
          "tw-bg-orange-shadow tw-drop-shadow-custom": color === "orange",
          "tw-bg-green-shadow tw-drop-shadow-green": color === "green",
        },
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="68"
        height="68"
        viewBox="0 0 68 68"
        fill="none"  
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M34.2833 67.5821C52.8301 67.5821 67.8653 52.5469 67.8653 34.0001C67.8653 15.4532 52.8301 0.417969 34.2833 0.417969C15.7364 0.417969 0.701172 15.4532 0.701172 34.0001C0.701172 52.5469 15.7364 67.5821 34.2833 67.5821ZM50.8052 30.5565C52.613 28.851 52.696 26.003 50.9905 24.1952C49.2851 22.3874 46.437 22.3045 44.6292 24.0099L29.9334 37.8739L23.955 32.1802C22.1553 30.4662 19.3069 30.5357 17.5929 32.3354C15.879 34.1351 15.9484 36.9835 17.7481 38.6975L26.8153 47.3329C28.5472 48.9824 31.267 48.9888 33.0067 47.3475L50.8052 30.5565Z"
          className={cn({
            "tw-fill-orange": color === "orange",
            "tw-fill-green": color === "green",
          })}
        />
      </svg>
    </div>
  );
};

SuccessTickIcon.propTypes = {
  color: PropTypes.oneOf(["orange", "green"]),
  className: PropTypes.string,
};
export default SuccessTickIcon;
