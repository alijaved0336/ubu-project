import styled from "styled-components";
import { DatePicker } from "antd";

const StyledDatePicker = styled(DatePicker)`
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

function UBUDatePicker({ format = "MM-DD-YYYY", ...rest }) {
  return <StyledDatePicker format={format} {...rest} />;
}

export default UBUDatePicker;
