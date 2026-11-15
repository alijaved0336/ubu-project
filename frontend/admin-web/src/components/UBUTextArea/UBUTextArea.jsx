import styled from "styled-components";
import { Input } from "antd";

const { TextArea } = Input;

const StyledTextArea = styled(TextArea)`
  &.ant-input-outlined {
    font-size: 0.875rem;
    font-weight: 400;
    font-family: Manrope;
    border-radius: 8px;

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

function UBUTextArea({ ...rest }) {
  return <StyledTextArea {...rest} />;
}

export default UBUTextArea;
