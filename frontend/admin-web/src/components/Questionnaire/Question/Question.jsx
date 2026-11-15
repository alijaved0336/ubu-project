import React, { memo } from "react";

import PropTypes from "prop-types";
import SimpleRadioOptions from "./SimpleRadioOptions";
import RadioCardOptions from "./RadioCardOptions";
import SimpleCheckboxOptions from "./SimpleCheckboxOptions";
import CheckboxCardOptions from "./CheckboxCardOptions";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import cn from "@src/cn";
import CheckboxCardSmallOptions from "./CheckboxCardSmallOptions";

const Question = ({
  question,
  errors,
  hasError,
  control,
  setValue,
  clearErrors,
}) => {
  const {
    sr_no,
    options,
    is_multi_selected,
    layout,
    question: questionTitle,
    title,
    description,
  } = question || {};

  const showSimpleRadioOptions = !is_multi_selected && layout === "simpleRadio";
  const showRadioCardOptions = !is_multi_selected && layout === "radioCard";

  const showSimpleCheckoxOptions =
    is_multi_selected && layout === "simpleCheckbox";
  const showCheckboxCardOptions =
    is_multi_selected && layout === "checkboxCard";
  const showCheckboxCardSmallOptions =
    is_multi_selected && layout === "checkboxCardSmall";

  const error = errors ? errors[sr_no] : "";

  return (
    <div
      className={cn(
        " tw-rounded-[32px] tw-py-5 tw-px-4 tw-bg-[#FAFAFA]  tw-space-y-6 tw-border tw-border-[#FAFAFA]",
        {
          "tw-border-[#ff4d4f]": hasError,
        }
      )}
    >
      <div className="md:tw-w-[737px] tw-h-[calc(100vh-290px)] tw-overflow-auto tw-px-5 tw-custom-scrollbar">
        <div className="tw-space-y-3">
          <Heading level={6}>{title || questionTitle}</Heading>
          <div>
            {title && questionTitle && (
              <Paragraph className="tw-text-base tw-font-semibold">
                {questionTitle}
              </Paragraph>
            )}
            {description && (
              <Paragraph className="tw-text-sm tw-font-medium">
                {description}
              </Paragraph>
            )}
          </div>
        </div>
        <div>
          <div className="tw-text-[#ff4d4f] tw-my-3">{error?.message}</div>
          {showSimpleRadioOptions && (
            <SimpleRadioOptions
              serialNumber={sr_no}
              options={options}
              control={control}
              errors={errors}
              setValue={setValue}
              clearErrors={clearErrors}
            />
          )}
          {showSimpleCheckoxOptions && (
            <SimpleCheckboxOptions
              serialNumber={sr_no}
              options={options}
              control={control}
              errors={errors}
              setValue={setValue}
              clearErrors={clearErrors}
            />
          )}
          {showRadioCardOptions && (
            <RadioCardOptions
              serialNumber={sr_no}
              options={options}
              control={control}
              errors={errors}
            />
          )}

          {showCheckboxCardOptions && (
            <CheckboxCardOptions
              serialNumber={sr_no}
              options={options}
              control={control}
              errors={errors}
            />
          )}
          {showCheckboxCardSmallOptions && (
            <CheckboxCardSmallOptions
              serialNumber={sr_no}
              options={options}
              control={control}
              errors={errors}
            />
          )}
        </div>
      </div>
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.object,
  errors: PropTypes.object,
  hasError: PropTypes.bool,
  control: PropTypes.any,
  setValue: PropTypes.func,
  clearErrors: PropTypes.func,
};
export default Question;
