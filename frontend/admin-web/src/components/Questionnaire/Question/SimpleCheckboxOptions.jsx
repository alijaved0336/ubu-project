import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";
import { Controller } from "react-hook-form";
import SimpleCheckbox from "../Widgets/SimpleCheckbox";

const SimpleCheckboxOptions = ({
  serialNumber,
  options,
  errors,
  control,
  setValue,
  clearErrors,
}) => {
  return (
    <Controller
      name={String(serialNumber)}
      control={control}
      render={({ field }) => (
        <Checkbox.Group
          {...field}
          status={errors[serialNumber] ? "error" : ""}
          className=" tw-flex tw-gap-4 tw-items-start tw-flex-wrap"
        >
          {options?.map((option) => (
            <SimpleCheckbox
              key={option?.option}
              option={option}
              serialNumber={serialNumber}
              control={control}
              errors={errors}
              setValue={setValue}
              clearErrors={clearErrors}
            />
          ))}
        </Checkbox.Group>
      )}
    />
  );
};

SimpleCheckboxOptions.propTypes = {
  serialNumber: PropTypes.number,
  options: PropTypes.array,
  errors: PropTypes.object,
  control: PropTypes.any,
  setValue: PropTypes.func,
  clearErrors: PropTypes.func,
};

export default SimpleCheckboxOptions;
