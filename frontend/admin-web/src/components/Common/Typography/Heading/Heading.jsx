import cn from "@src/cn";
import PropTypes from "prop-types";
import React from "react";

const getHeadingLevel = (level, className, children, ...rest) => {
  const baseStyles = {
    1: "tw-text-4xl tw-font-bold tw-m-0 tw-font-manrope",
    2: "tw-text-3xl tw-font-semibold tw-m-0 tw-font-manrope",
    3: "tw-text-2xl tw-font-semibold tw-m-0 tw-font-manrope",
    4: "tw-text-xl tw-font-semibold tw-m-0 tw-font-manrope",
    5: "tw-text-lg tw-font-semibold tw-m-0 tw-font-manrope",
    6: "tw-text-base tw-font-semibold tw-m-0 tw-font-manrope",
  };

  const levels = {
    1: (
      <h1 className={cn(baseStyles[1], className)} {...rest}>
        {children}
      </h1>
    ),
    2: (
      <h2 className={cn(baseStyles[2], className)} {...rest}>
        {children}
      </h2>
    ),
    3: (
      <h3 className={cn(baseStyles[3], className)} {...rest}>
        {children}
      </h3>
    ),
    4: (
      <h4 className={cn(baseStyles[4], className)} {...rest}>
        {children}
      </h4>
    ),
    5: (
      <h5 className={cn(baseStyles[5], className)} {...rest}>
        {children}
      </h5>
    ),
    6: (
      <h6 className={cn(baseStyles[6], className)} {...rest}>
        {children}
      </h6>
    ),
  };

  return levels[level];
};

const Heading = ({ level, className, children }) => {
  return getHeadingLevel(level, className, children);
};

Heading.propTypes = {
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Heading;
