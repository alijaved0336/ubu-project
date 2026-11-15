import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";
import { Controller } from "react-hook-form";

import CheckboxCardSmall from "../Widgets/CheckboxCardSmall";

const CheckboxCardSmallOptions = ({
  serialNumber,
  options,
  errors,
  control,
}) => {
  return (
    <Controller
      name={String(serialNumber)}
      control={control}
      render={({ field }) => (
        <Checkbox.Group
          {...field}
          status={errors[serialNumber] ? "error" : ""}
          className="tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-gap-4"
        >
          {options?.map((option) => (
            <CheckboxCardSmall key={option?.option} option={option} />
          ))}
        </Checkbox.Group>
      )}
    />
  );
};

CheckboxCardSmallOptions.propTypes = {
  serialNumber: PropTypes.number,
  options: PropTypes.array,
  errors: PropTypes.object,
  control: PropTypes.any,
};

export default CheckboxCardSmallOptions;
