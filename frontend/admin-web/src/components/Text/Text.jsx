import { Typography } from "antd";
import propTypes from "prop-types";

import "./Text.less";

function Text({ children, className, mainHeading = false, ...rest }) {
  return (
    <Typography.Text
      className={`UBU-Text ${
        mainHeading ? "ff-classy" : "ff-manrope"
      } ${className}`}
      {...rest}
    >
      {children}
    </Typography.Text>
  );
}

Text.propTypes = {
  children: propTypes.node,
  className: propTypes.string,
  mainHeading: propTypes.bool,
};

export default Text;
