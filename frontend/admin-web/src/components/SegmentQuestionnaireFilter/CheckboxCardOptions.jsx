import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";
import { Controller } from "react-hook-form";
import CheckboxCard from "./CheckboxCard";

const CheckboxCardOptions = ({ serialNumber, options, control }) => {
  return (
    <Controller
      name={String(serialNumber)}
      control={control}
      render={({ field }) => (
        <Checkbox.Group
          {...field}
          className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-4 lg:tw-grid-cols-3 xs:tw-grid-cols-2 tw-gap-4"
        >
          {options?.map((option) => (
            <CheckboxCard key={option?.option} option={option} />
          ))}
        </Checkbox.Group>
      )}
    />
  );
};

CheckboxCardOptions.propTypes = {
  serialNumber: PropTypes.number,
  options: PropTypes.array,
  control: PropTypes.any,
};

export default CheckboxCardOptions;
