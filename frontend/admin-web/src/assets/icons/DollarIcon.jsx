import React from "react";
import PropTypes from "prop-types";

const DollarIcon = ({
  width = "24",
  height = "24",
  fill = "white",
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.9069 10.0615C13.7936 9.74759 13.5846 9.47588 13.3085 9.28352C13.0325 9.09116 12.7028 8.98756 12.3647 8.98688H11.0987C10.7375 8.98502 10.3884 9.11516 10.119 9.35215C9.84959 9.58913 9.67893 9.91612 9.64004 10.2699C9.60115 10.6236 9.69679 10.9791 9.90847 11.2674C10.1201 11.5557 10.4328 11.7564 10.786 11.8308L12.7138 12.2452C13.1079 12.3302 13.4563 12.5557 13.692 12.8784C13.9276 13.2011 14.0339 13.5982 13.9905 13.9934C13.947 14.3886 13.7568 14.7541 13.4565 15.0195C13.1561 15.285 12.7668 15.4318 12.3633 15.4316H11.2739C10.5617 15.4316 9.95605 14.9841 9.73173 14.3584M11.8193 8.98688V7.375M11.8193 17.0435V15.433M5 21.375V17.922H8.50499"
        stroke="#8F8F8F"
        className={className}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.8457 10.7196C21.2133 12.6784 20.9198 14.7038 20.0113 16.4778C19.1027 18.2518 17.6306 19.6741 15.8259 20.5214C14.0212 21.3687 11.9861 21.5931 10.04 21.1593C8.09393 20.7255 6.34706 19.658 5.07356 18.1246M3.15431 14.0304C2.7867 12.0716 3.0802 10.0462 3.98874 8.27219C4.89728 6.49815 6.36943 5.07587 8.17414 4.22857C9.97885 3.38127 12.0139 3.15692 13.96 3.59073C15.9061 4.02454 17.6529 5.09196 18.9264 6.62545"
        stroke="#8F8F8F"
        className={className}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 3.375V7.375H16"
        stroke="#8F8F8F"
        strokeWidth="1.8"
        className={className}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

DollarIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  fill: PropTypes.string,
};
export default DollarIcon;
