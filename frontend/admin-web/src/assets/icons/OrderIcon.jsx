import React from "react";
import PropTypes from "prop-types";

const OrderIcon = ({
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5139 20.4998H6.16604C3.09968 20.4998 0.747274 19.3922 1.41547 14.9346L2.1935 8.89339C2.6054 6.66913 4.02416 5.81787 5.26901 5.81787H15.4475C16.7107 5.81787 18.047 6.7332 18.523 8.89339L19.3011 14.9346C19.8686 18.8888 17.5802 20.4998 14.5139 20.4998Z"
        stroke="#8F8F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M14.6512 5.59824C14.6512 3.21216 12.7169 1.27787 10.3309 1.27787V1.27787C9.18186 1.273 8.07825 1.72603 7.26406 2.53679C6.44987 3.34754 5.99218 4.44923 5.99219 5.59824H5.99219"
        stroke="#8F8F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M13.2965 10.1017H13.2507"
        stroke="#8F8F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M7.4659 10.1017H7.42013"
        stroke="#8F8F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
};

OrderIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  fill: PropTypes.string,
};

export default OrderIcon;
