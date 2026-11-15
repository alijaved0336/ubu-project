import styled from "styled-components";
import { Select } from "antd";
import propTypes from "prop-types";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const StyledSelect = styled(Select)`
  &.ant-select-outlined {
    font-size: 0.875rem;
    font-weight: 400;
    font-family: Manrope;
    border-radius: 8px;
    height: auto;

    .ant-select-selector {
      padding: 8px;
      border-color: #e0e2e7;
      border-radius: 8px;
    }

    &:hover {
      .ant-select-selector {
        border-color: #e0e2e7 !important;
      }
    }

    &:focus,
    &:focus-visible,
    &:focus-within,
    &:active {
      border-color: none;
      outline: none;
      .ant-select-selector {
        border-color: #e0e2e7 !important;
        box-shadow: 0 0 0 2px rgba(140, 140, 140, 0.2);
      }
    }
  }
`;

function UBUSelect({
  placeholder = "Select an option",
  options,
  allowClear = false,
  ...rest
}) {
  return (
    <StyledSelect
      placeholder={placeholder}
      {...rest}
      allowClear={
        allowClear
          ? {
              clearIcon: (
                <CloseCircleOutlined
                  style={{ fontSize: 20, transform: "translate(-20%, -20%)" }}
                />
              ),
            }
          : false
      }
    >
      {options?.map((option) => (
        <Option
          className={"ff-manrope"}
          key={option.value}
          value={option.value}
        >
          {option.label}
        </Option>
      ))}
    </StyledSelect>
  );
}

UBUSelect.propTypes = {
  placeholder: propTypes.string,
  options: propTypes.array,
  allowClear: propTypes.bool,
};

export default UBUSelect;
