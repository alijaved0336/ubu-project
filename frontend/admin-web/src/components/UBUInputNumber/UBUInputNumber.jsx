import { InputNumber } from "antd";
import styled from "styled-components";

const StyledInputNumber = styled(InputNumber)`
  &.ant-input-number-outlined {
    font-size: 0.875rem;
    font-weight: 400;
    font-family: Manrope;
    border-radius: 8px;
    input {
      padding: 0.5rem;
    }
    .ant-input-number-prefix {
      font-size: 0.75rem;
    }
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

export default StyledInputNumber;
