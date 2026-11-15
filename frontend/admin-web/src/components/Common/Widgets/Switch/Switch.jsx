import React from "react";
import { Switch as AntSwitch } from "antd";
import cn from "@src/cn";
import PropTypes from "prop-types";

const Switch = ({
  wrapperClassName,
  className,
  isChecked,
  disabled,
  labelLeft,
  labelRight,
  onChange,
  ...rest
}) => {
  return (
    <div className={cn("tw-flex tw-gap-2", wrapperClassName)}>
      <AntSwitch
        {...rest}
        onChange={onChange}
        className={cn(className)}
        checked={isChecked}
        disabled={disabled}
      />
    </div>
  );
};

Switch.propTypes = {
  wrapperClassName: PropTypes.string,
  className: PropTypes.string,
  isChecked: PropTypes.bool,
  labelLeft: PropTypes.string,
  labelRight: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Switch;
