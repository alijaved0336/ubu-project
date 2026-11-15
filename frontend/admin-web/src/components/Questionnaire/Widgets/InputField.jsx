import React from "react";
import { Input } from "antd";
import styled from "styled-components";

const StyledInput = styled(Input)`
  padding: 8px 12px;
  border-radius: 58px;
  background-color: rgba(255, 197, 41, 0.2); /* mimic checked radio */
  border: 1px solid #ffc529;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover,
  &:focus,
  &:active,
  &.ant-input-focused {
    border-color: #ffc529;
    box-shadow: 0 0 0 2px rgba(255, 197, 41, 0.2);
    background-color: rgba(255, 197, 41, 0.25);
  }

  &.ant-input-status-error {
    border-color: #ffa39e !important;
    /* background-color: #fff !important; */
    background-color: rgba(255, 197, 41, 0.25) !important;

    &:hover,
    &:focus,
    &.ant-input-focused {
      border-color: #ffa39e !important;
      /* background-color: #fff !important; */
      background-color: rgba(255, 197, 41, 0.25) !important;
    }
  }

  input {
    border: none;
    background: transparent;
    outline: none;
  }
`;

const InputField = ({ ...rest }) => {
  return <StyledInput {...rest} />;
};

export default InputField;
