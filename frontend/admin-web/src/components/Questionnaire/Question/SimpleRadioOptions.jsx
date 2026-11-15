import PropTypes from "prop-types";
import { Radio } from "antd";
import { Controller } from "react-hook-form";
import SimpleRadio from "../Widgets/SimpleRadio";

const SimpleRadioOptions = ({
  serialNumber,
  options,
  errors,
  control,
  setValue,
  clearErrors,
}) => {
  return (
    <div>
      <Controller
        name={String(serialNumber)}
        control={control}
        render={({ field }) => (
          <Radio.Group
            {...field}
            status={errors[serialNumber] ? "error" : ""}
            className=" tw-flex tw-gap-4 tw-items-start tw-flex-wrap"
          >
            {options?.map((option) => (
              <SimpleRadio
                key={option?.option}
                option={option}
                serialNumber={serialNumber}
                control={control}
                errors={errors}
                setValue={setValue}
                clearErrors={clearErrors}
              />
            ))}
          </Radio.Group>
        )}
      />
    </div>
  );
};

SimpleRadioOptions.propTypes = {
  serialNumber: PropTypes.number,
  options: PropTypes.array,
  errors: PropTypes.object,
  control: PropTypes.any,
  setValue: PropTypes.func,
  clearErrors: PropTypes.func,
};

export default SimpleRadioOptions;
