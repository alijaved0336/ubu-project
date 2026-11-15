import { Input } from "antd";
import styled from "styled-components";

const CustomSearchInput = styled(Input.Search)`
  .ant-input-wrapper {
    height: 100%;
    border-radius: 8px;
  }
  .ant-input-group-addon {
    display: none;
  }
  .ant-input-affix-wrapper {
    height: 100%;
    font-size: 0.875rem;
    font-weight: 400;
    font-family: Manrope;
    padding: 0.5rem;
    border-radius: 8px !important;
    .ant-input-prefix svg {
      width: 16px;
      height: 16px;
      fill: #858d9d;
    }
    &:hover {
      border-color: #e0e2e7; // Replace with your theme color for hover
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

export default CustomSearchInput;
