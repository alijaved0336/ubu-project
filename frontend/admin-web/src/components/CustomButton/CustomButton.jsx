import { Button } from "antd";
import propTypes from "prop-types";

import "./CustomButton.less";

function CustomButton({ className, variant, shape, children, ...rest }) {
  return (
    <Button
      className={`CustomButton ff-manrope ${className} ${variant} ${shape}`}
      type="text"
      {...rest}
    >
      {children}
    </Button>
  );
}

CustomButton.propTypes = {
  variant: propTypes.oneOf(["black", "default"]),
  shape: propTypes.oneOf(["round", "round-md", "round-lg"]),
  children: propTypes.node,
  className: propTypes.string,
};

export default CustomButton;
