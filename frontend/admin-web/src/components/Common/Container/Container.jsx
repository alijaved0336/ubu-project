import cn from "@src/cn";
import PropTypes from "prop-types";
import React from "react";

const Container = ({ children, className }) => {
  return (
    <div className={cn("xl:tw-px-0 tw-px-4 md:tw-px-4", className)}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
export default Container;
