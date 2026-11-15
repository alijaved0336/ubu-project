import React from "react";
import PropTypes from "prop-types";
import CheckboxOptions from "./CheckboxOptions";
import CheckboxCardOptions from "./CheckboxCardOptions";

import { Heading } from "../Common/Typography";

const Question = ({
  question,
  control,
  setValue,
  otherStates,
  onChangeOtherStates,
}) => {
  const { sr_no, options, question: questionTitle } = question || {};

  const optionsHasDescriptions = options?.some(
    (option) => option?.option_discription
  );

  const showCheckboxCard = optionsHasDescriptions;
  const showCheckbox = !optionsHasDescriptions;

  return (
    <div className="tw-space-y-4">
      <Heading level={6} className="tw-font-semibold">
        {questionTitle}
      </Heading>

      {showCheckbox && (
        <CheckboxOptions
          control={control}
          options={options}
          serialNumber={sr_no}
          setValue={setValue}
          otherStates={otherStates}
          onChangeOtherStates={onChangeOtherStates}
        />
      )}

      {showCheckboxCard && (
        <CheckboxCardOptions
          control={control}
          options={options}
          serialNumber={sr_no}
        />
      )}
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.object,
  control: PropTypes.any,
  setValue: PropTypes.func,
  otherStates: PropTypes.object,
  onChangeOtherStates: PropTypes.func,
};

export default Question;
