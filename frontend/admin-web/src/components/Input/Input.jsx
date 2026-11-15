import { Input } from "antd";
import styled from "styled-components";

const CustomInput = styled(Input)`
  &.ant-input-outlined {
    font-size: 0.875rem;
    font-weight: 400;
    font-family: Manrope;
    padding: 0.5rem;
    border-radius: 8px;
    .ant-input-prefix svg {
      width: 16px;
      height: 16px;
      fill: #858d9d;
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

export default CustomInput;
