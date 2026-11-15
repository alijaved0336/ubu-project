import React from "react";
import PropTypes from "prop-types";

const ProductIcon = ({ width = "24", height = "24", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <g id="fi:box">
        <path
          id="Vector"
          d="M21.1445 15.9999V7.9999C21.1442 7.64918 21.0516 7.30471 20.8761 7.00106C20.7006 6.69742 20.4483 6.44526 20.1445 6.2699L13.1445 2.2699C12.8405 2.09437 12.4956 2.00195 12.1445 2.00195C11.7935 2.00195 11.4486 2.09437 11.1445 2.2699L4.14453 6.2699C3.84079 6.44526 3.58851 6.69742 3.41299 7.00106C3.23747 7.30471 3.14489 7.64918 3.14453 7.9999V15.9999C3.14489 16.3506 3.23747 16.6951 3.41299 16.9987C3.58851 17.3024 3.84079 17.5545 4.14453 17.7299L11.1445 21.7299C11.4486 21.9054 11.7935 21.9979 12.1445 21.9979C12.4956 21.9979 12.8405 21.9054 13.1445 21.7299L20.1445 17.7299C20.4483 17.5545 20.7006 17.3024 20.8761 16.9987C21.0516 16.6951 21.1442 16.3506 21.1445 15.9999Z"
          stroke="#8F8F8F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        />
        <path
          id="Vector_2"
          d="M3.41406 6.95996L12.1441 12.01L20.8741 6.95996"
          stroke="#8F8F8F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        />
        <path
          id="Vector_3"
          d="M12.1445 22.08V12"
          stroke="#8F8F8F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        />
      </g>
    </svg>
  );
};

ProductIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  fill: PropTypes.string,
};
export default ProductIcon;
