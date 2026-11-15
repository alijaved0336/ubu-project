import { Select } from "antd";
import propTypes from "prop-types";

import "./Select.less";

function UBUSelect({
  options,
  varient,
  shape,
  placeholder = "Select...",
  ...rest
}) {
  return (
    <Select
      placeholder={placeholder}
      className={`UBUSelect ${varient} ${shape}`}
      {...rest}
    >
      {options.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
}

UBUSelect.propTypes = {
  options: propTypes.array,
  shape: propTypes.string,
  varient: propTypes.string,
  placeholder: propTypes.string,
};

export default UBUSelect;
