import React from "react";
import PropTypes from "prop-types";

const WaitlistUserIcon = ({ width = "24", height = "24", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* User Head & Body */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.73555 13.207C11.4246 13.207 14.5776 13.766 14.5776 15.999C14.5776 18.232 11.4456 18.807 7.73555 18.807C4.04555 18.807 0.893555 18.253 0.893555 16.019C0.893555 13.785 4.02455 13.207 7.73555 13.207Z"
        stroke="#8F8F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.73561 10.02C5.31361 10.02 3.34961 8.057 3.34961 5.635C3.34961 3.213 5.31361 1.25 7.73561 1.25C10.1566 1.25 12.1206 3.213 12.1206 5.635C12.1296 8.048 10.1796 10.011 7.76661 10.02H7.73561Z"
        stroke="#8F8F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      
      {/* Clock Icon */}
      <circle 
        cx="17" 
        cy="17" 
        r="4" 
        stroke="#8F8F8F" 
        strokeWidth="1.5" 
        className={className} 
      />
      <path 
        d="M17 15V17L18.5 18" 
        stroke="#8F8F8F" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
      />
    </svg>
  );
};

WaitlistUserIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
};

export default WaitlistUserIcon;
