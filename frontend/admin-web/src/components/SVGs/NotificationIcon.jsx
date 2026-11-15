import React from "react";
import PropTypes from "prop-types";


function NotificationIcon({width='60', height='60'}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 27 27"
    >
      <path
        stroke="#353535"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11.604 5.911a2.167 2.167 0 014.333 0 7.583 7.583 0 014.333 6.5v3.25a4.333 4.333 0 002.167 3.25H5.104a4.333 4.333 0 002.166-3.25v-3.25a7.583 7.583 0 014.334-6.5"
      ></path>
      <path
        stroke="#353535"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10.52 18.911v1.084a3.25 3.25 0 006.5 0V18.91"
      ></path>
    </svg>
  );
}

NotificationIcon.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
  };
  

export default NotificationIcon;
