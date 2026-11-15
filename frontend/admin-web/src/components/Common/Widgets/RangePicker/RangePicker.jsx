import React from "react";
import { DatePicker, Space } from "antd";
import styled from "styled-components";
import { CloseCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { RangePicker: AntRangePicker } = DatePicker;

const StyledRangePicker = styled(AntRangePicker)`
  &.ant-picker {
    font-size: 0.875rem;
    font-weight: 400;
    font-family: Manrope;
    padding: 0.5rem;
    border-radius: 8px !important;

    &:hover {
      border-color: #e0e2e7;
    }

    &:focus,
    &:focus-visible,
    &:focus-within,
    &:active {
      outline: none;
      border-color: #e0e2e7;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
  }
`;

const RangePicker = ({ className, ...rest }) => {
  return (
    <StyledRangePicker
      {...rest}
      placement="bottomRight"
      className={className}
      allowClear={{
        clearIcon: <CloseCircleOutlined style={{ fontSize: 20 }} />,
      }}
    />
  );
};

RangePicker.propTypes = {
  className: PropTypes.string,
};
export default RangePicker;
