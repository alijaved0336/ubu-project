import React, { useEffect, useState } from "react";
import { Checkbox, Skeleton } from "antd";
import PropTypes from "prop-types";
import styled from "styled-components";
import cn from "@src/cn";
import { useInfluencerQuestionnaireForm } from "../QuestionnaireForm/InfluencerQuestionnaireForm/InfluencerQuestionnaireFormProvider";
import { Controller, useWatch } from "react-hook-form";
import { CloseOutlined } from "@ant-design/icons";
import { Paragraph } from "@src/components/Common/Typography";
import InputField from "./InputField";

const StyledCheckbox = styled(Checkbox)`
  /* Base styles */
  padding: 8px 10px;
  border-radius: 12px;
  background-color: rgba(30, 30, 30, 0.07);
  display: flex;
  align-items: center;
  cursor: pointer;

  /* Remove Ant Design default tick */
  .ant-checkbox-inner {
    display: none !important;
  }

  &.ant-checkbox-wrapper {
    border: 1px solid rgba(30, 30, 30, 0.07);
  }
  /* Checked State */
  &.ant-checkbox-wrapper-checked {
    border: 1px solid #ffc529;
    background-color: rgba(255, 197, 41, 0.2);
  }
`;

const SimpleCheckbox = ({
  option,
  serialNumber,
  control,
  errors,
  setValue,
  clearErrors,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);

  const { otherStates, onChangeOtherStates } = useInfluencerQuestionnaireForm();
  const selectedOption = useWatch({ name: String(serialNumber), control });

  useEffect(() => {
    const showInput =
      option?.input_field && selectedOption?.includes(option?.option);
    const hideInput =
      option?.input_field && !selectedOption?.includes(option?.option);

    if (showInput) {
      onChangeOtherStates &&
        onChangeOtherStates(option?.input_field?.fieldName, true);
    }

    if (hideInput) {
      onChangeOtherStates &&
        onChangeOtherStates(option?.input_field?.fieldName, false);
    }
  }, [selectedOption, option, onChangeOtherStates]);

  const handleClearOption = () => {
    const filteredOptions = selectedOption?.filter(
      (op) => op !== option?.option
    );

    if (setValue) {
      setValue(String(serialNumber), filteredOptions);
      setValue(option?.input_field?.fieldName, "");
    }

    clearErrors && clearErrors(option?.input_field?.fieldName);
  };

  const inputFieldError =
    errors && errors[option?.input_field?.fieldName]?.message;

  return (
    <>
      {option?.input_field && otherStates[option?.input_field?.fieldName] && (
        <span>
          <Controller
            name={option?.input_field?.fieldName}
            control={control}
            render={({ field }) => (
              <div>
                <InputField
                  {...field}
                  placeholder={option?.input_field?.placeholder}
                  status={inputFieldError ? "error" : ""}
                  suffix={
                    <CloseOutlined
                      onClick={handleClearOption}
                      style={{ cursor: "pointer", color: "#999" }}
                    />
                  }
                />
                {inputFieldError && (
                  <Paragraph className="tw-text-sm tw-text-[#ff4d4f] tw-mt-2">
                    {inputFieldError}
                  </Paragraph>
                )}
              </div>
            )}
          />
        </span>
      )}

      <StyledCheckbox
        value={option?.option}
        {...rest}
        className={cn("", {
          "!tw-hidden tw-pointer-events-none":
            option?.input_field && otherStates[option?.input_field?.fieldName],
        })}
      >
        <div className="tw-flex tw-items-center tw-gap-2">
          {option?.image_url && (
            <>
              {!loaded && (
                <Skeleton.Avatar
                  rootClassName="!tw-flex tw-items-center"
                  shape="circle"
                  size="small"
                  active
                  style={{ width: "1rem", height: "1rem" }}
                />
              )}
              <img
                src={option?.image_url}
                className={cn("tw-w-4 tw-h-4 tw-rounded-full", {
                  "tw-hidden": !loaded,
                })}
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
              />
            </>
          )}
          <span>{option?.option}</span>
        </div>
      </StyledCheckbox>
    </>
  );
};

SimpleCheckbox.propTypes = {
  option: PropTypes.object,
  errors: PropTypes.object,
  image: PropTypes.string,
  serialNumber: PropTypes.number,
  control: PropTypes.any,
  setValue: PropTypes.func,
  clearErrors: PropTypes.func,
};

export default SimpleCheckbox;
