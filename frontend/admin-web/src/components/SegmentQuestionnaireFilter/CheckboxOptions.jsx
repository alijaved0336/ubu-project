import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Checkbox as AntCheckbox } from "antd";
import Checkbox from "./Checkbox";

const CheckboxOptions = ({
  serialNumber,
  options,
  control,
  setValue,
  otherStates,
  onChangeOtherStates,
}) => {
  return (
    <Controller
      name={String(serialNumber)}
      control={control}
      render={({ field }) => (
        <AntCheckbox.Group
          {...field}
          className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-4 lg:tw-grid-cols-3 xs:tw-grid-cols-2 tw-gap-4"
        >
          {options?.map((option) => (
            <Checkbox
              key={option?.option}
              option={option}
              setValue={setValue}
              otherStates={otherStates}
              control={control}
              serialNumber={serialNumber}
              onChangeOtherStates={onChangeOtherStates}
            >
              <span>{option?.option}</span>
            </Checkbox>
          ))}
        </AntCheckbox.Group>
      )}
    />
  );
};

CheckboxOptions.propTypes = {
  serialNumber: PropTypes.number,
  options: PropTypes.array,
  control: PropTypes.any,
  setValue: PropTypes.func,
  otherStates: PropTypes.object,
  onChangeOtherStates: PropTypes.func,
};

export default CheckboxOptions;
