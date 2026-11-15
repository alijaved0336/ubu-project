import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Radio, Skeleton } from "antd";

import styled from "styled-components";
import cn from "@src/cn";
import { useInfluencerQuestionnaireForm } from "../QuestionnaireForm/InfluencerQuestionnaireForm/InfluencerQuestionnaireFormProvider";
import { Controller, useWatch } from "react-hook-form";
import { Paragraph } from "@src/components/Common/Typography";
import InputField from "./InputField";

const StyledRadio = styled(Radio)`
  padding: 8px 12px;
  border-radius: 58px;
  background-color: rgba(30, 30, 30, 0.07);
  display: flex;
  align-items: center;
  cursor: pointer;

  &.ant-radio-wrapper {
    border: 1px solid rgba(30, 30, 30, 0.07);
  }

  /* Remove Ant Design default dot */
  .ant-radio-inner {
    display: none !important;
  }

  /* Checked State */
  &.ant-radio-wrapper-checked {
    border: 1px solid #ffc529;
    background-color: rgba(255, 197, 41, 0.2);
  }
`;

const SimpleRadio = ({
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
    const showInput = option?.input_field && option?.option === selectedOption;
    const hideInput = option?.input_field && option?.option !== selectedOption;

    if (showInput) {
      onChangeOtherStates &&
        onChangeOtherStates(option?.input_field?.fieldName, true);
    }

    if (hideInput) {
      onChangeOtherStates &&
        onChangeOtherStates(option?.input_field?.fieldName, false);
      setValue && setValue(option?.input_field?.fieldName, "");
      clearErrors && clearErrors(option?.input_field?.fieldName);
    }
  }, [selectedOption, option, onChangeOtherStates, setValue, clearErrors]);

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
                  status={inputFieldError ? "error" : ""}
                  placeholder={option?.input_field?.placeholder}
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

      <StyledRadio
        value={option?.option}
        {...rest}
        className={cn({
          "!tw-hidden":
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
      </StyledRadio>
    </>
  );
};

SimpleRadio.propTypes = {
  option: PropTypes.object,
  serialNumber: PropTypes.number,
  errors: PropTypes.object,
  control: PropTypes.any,
  setValue: PropTypes.func,
  clearErrors: PropTypes.func,
};

export default SimpleRadio;
