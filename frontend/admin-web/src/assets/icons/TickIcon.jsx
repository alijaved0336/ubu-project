import React from "react";
import PropTypes from "prop-types";

const TickIcon = ({
  width = "13",
  height = "9",
  fill = "#F79E1B",
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 9"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Path"
        d="M10.4233 0.280712L4.13029 6.57371L1.83729 4.28071C1.44491 3.90174 0.821205 3.90716 0.435472 4.29289C0.0497378 4.67863 0.0443179 5.30233 0.42329 5.69471L3.42329 8.69471C3.81379 9.08509 4.44679 9.08509 4.83729 8.69471L11.8373 1.69471C12.2163 1.30233 12.2108 0.678627 11.8251 0.292893C11.4394 -0.0928404 10.8157 -0.0982602 10.4233 0.280712Z"
        fill={fill}
      />
    </svg>
  );
};

TickIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
};

export default TickIcon;
