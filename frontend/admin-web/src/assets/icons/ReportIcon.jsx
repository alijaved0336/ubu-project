import React from "react";
import PropTypes from "prop-types";

const ReportIcon = ({
  width = "24",
  height = "24",
  fill = "white",
  className,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18 3.75H19C19.6904 3.75 20.25 4.30964 20.25 5V19C20.25 19.6904 19.6904 20.25 19 20.25H18C17.3096 20.25 16.75 19.6904 16.75 19V5C16.75 4.30964 17.3096 3.75 18 3.75Z"
        stroke="#8F8F8F"
        className={className}
        strokeWidth="1.5"
      />
      <path
        d="M11.5 9.75H12.5C13.1904 9.75 13.75 10.3096 13.75 11V19C13.75 19.6904 13.1904 20.25 12.5 20.25H11.5C10.8096 20.25 10.25 19.6904 10.25 19V11C10.25 10.3096 10.8096 9.75 11.5 9.75Z"
        stroke="#8F8F8F"
        strokeWidth="1.5"
        className={className}
      />
      <path
        d="M5 16.75H6C6.69036 16.75 7.25 17.3096 7.25 18V19C7.25 19.6904 6.69036 20.25 6 20.25H5C4.30964 20.25 3.75 19.6904 3.75 19V18C3.75 17.3096 4.30964 16.75 5 16.75Z"
        stroke="#8F8F8F"
        strokeWidth="1.5"
        className={className}
      />
    </svg>
  );
};

ReportIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  fill: PropTypes.string,
};
export default ReportIcon;
