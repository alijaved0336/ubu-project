import React from "react";
import { Radio } from "antd";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import RadioCard from "../Widgets/RadioCard";

const RadioCardOptions = ({ serialNumber, options, errors, control }) => {
  return (
    <div>
      <Controller
        name={String(serialNumber)}
        control={control}
        render={({ field }) => (
          <Radio.Group
            {...field}
            status={errors[serialNumber] ? "error" : ""}
            className="tw-grid tw-grid-cols-1 tw-gap-4"
          >
            {options?.map((option) => (
              <RadioCard key={option?.option} option={option} />
            ))}
          </Radio.Group>
        )}
      />
    </div>
  );
};

RadioCardOptions.propTypes = {
  serialNumber: PropTypes.number,
  options: PropTypes.array,
  errors: PropTypes.object,
  control: PropTypes.any,
};

export default RadioCardOptions;
