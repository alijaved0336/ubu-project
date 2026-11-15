import React from "react";
import PropTypes from "prop-types";
import cn from "@src/cn";

const Paragraph = ({ className, children, ...rest }) => {
  return (
    <p {...rest} className={cn("tw-text-base tw-font-manrope", className)}>
      {children && children}
    </p>
  );
};

Paragraph.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Paragraph;
