import React, { useEffect } from "react";
import { Checkbox as AntCheckbox, Input } from "antd";
import PropTypes from "prop-types";
import cn from "@src/cn";
import { Controller, useWatch } from "react-hook-form";

import { CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";

const StyledInput = styled(Input)`
  padding: 4px 12px;
  border-radius: 58px;
  /* background-color: rgba(255, 197, 41, 0.2); mimic checked radio */
  display: flex;
  align-items: center;
  cursor: pointer;
  width: fit-content;

  &:hover,
  &:focus,
  &:active,
  &.ant-input-focused,
  &.ant-input-outlined:focus-within {
    /* box-shadow: 0 0 0 0.125rem rgba(5, 145, 255, 0.1); */
    box-shadow: 0 0 0 0.125rem rgba(0, 0, 0, 0.2);

    /* background-color: rgba(255, 197, 41, 0.25); */
    /* border: 1px solid black; */
    border-color: black !important;
  }

  input {
    border: none;
    background: transparent;
    outline: none;
  }
`;
const Checkbox = ({
  option,
  serialNumber,
  className,
  control,
  setValue,
  otherStates,
  onChangeOtherStates,
  ...rest
}) => {
  const selectedOption = useWatch({ name: String(serialNumber), control });

  useEffect(() => {
    const showInput =
      option?.input_field && selectedOption?.includes(option?.option);

    if (showInput) {
      onChangeOtherStates &&
        onChangeOtherStates(option?.input_field?.fieldName, true);
    }
  }, [selectedOption, option, onChangeOtherStates, serialNumber]);

  const handleClearOption = () => {
    const filteredOptions = selectedOption?.filter(
      (op) => op !== option?.option
    );

    if (setValue) {
      setValue(String(serialNumber), filteredOptions);
      setValue(option?.input_field?.fieldName, "");
    }

    onChangeOtherStates &&
      onChangeOtherStates(option?.input_field?.fieldName, false);
  };

  return (
    <>
      {option?.input_field && otherStates[option?.input_field?.fieldName] && (
        <span>
          <Controller
            name={option?.input_field?.fieldName}
            control={control}
            render={({ field }) => (
              <div>
                <StyledInput
                  {...field}
                  size="small"
                  placeholder={option?.input_field?.placeholder}
                  suffix={
                    <CloseOutlined
                      onClick={handleClearOption}
                      style={{ cursor: "pointer", color: "#999" }}
                    />
                  }
                />
              </div>
            )}
          />
        </span>
      )}
      <AntCheckbox
        value={option?.option}
        {...rest}
        className={cn("tw-flex tw-items-center tw-gap-2", className, {
          "!tw-hidden tw-pointer-events-none":
            option?.input_field && otherStates[option?.input_field?.fieldName],
        })}
      >
        <span>{option?.option}</span>
      </AntCheckbox>
    </>
  );
};

Checkbox.propTypes = {
  option: PropTypes.object,
  className: PropTypes.string,
  serialNumber: PropTypes.number,
  control: PropTypes.any,
  setValue: PropTypes.func,
  otherStates: PropTypes.object,
  onChangeOtherStates: PropTypes.func,
};

export default Checkbox;
