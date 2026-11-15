import { object } from "zod";
import {
  addressValidation,
  checkBoxesValidation,
  cityValidation,
  otherFieldValidation,
  privacyPolicyCB,
  radioValidation,
  stateValidation,
  zipCodeValidation,
} from "@src/utils/formInputValidations";
import { shouldIncludeQuestion } from "./helpers";

const getInfluencerQuestionnaireValidationSchema = (
  t,
  questionnaireData,
  otherFields,
  inputOptions,
  selectedGender
) => {
  const hasFeminineQuestion = (questionnaireData || [])?.some(
    (question) => question.sr_no === 16
  );
  const hasMasculineQuestion = (questionnaireData || [])?.some(
    (question) => question.sr_no === 17
  );
  const hasNonBinaryQuestion = (questionnaireData || [])?.some(
    (question) => question.sr_no === 31
  );

  const requiredQuestions = (questionnaireData || [])?.filter(
    (question) => !question?.is_optional
  );

  // const genderBasedQuestion = requiredQuestions?.filter((question) =>
  //   shouldIncludeQuestion(question, selectedGender)
  // );

  const schema = requiredQuestions?.reduce(
    (schema, question) => {
      if (question.is_multi_selected) {
        schema.checkboxSchema[question.sr_no] = checkBoxesValidation(t);
      } else {
        schema.radioSchema[question.sr_no] = radioValidation();
      }

      return schema;
    },
    { radioSchema: {}, checkboxSchema: {} }
  );

  const conditionalSchema = inputOptions?.reduce((acc, option) => {
    if (otherFields[option?.input_field?.fieldName]) {
      acc[option?.input_field?.fieldName] = otherFieldValidation(
        `Please ${option?.input_field?.placeholder?.toLowerCase()}`
      );
    }

    return acc;
  }, []);

  console.log({
    hasMasculineQuestion,
    hasFeminineQuestion,
    hasNonBinaryQuestion,
  });

  const stylesSchema = {
    ...(selectedGender === "Female" &&
      hasFeminineQuestion && { 16: checkBoxesValidation(t) }),
    ...(selectedGender === "Male" &&
      hasMasculineQuestion && { 17: checkBoxesValidation(t) }),
    ...(selectedGender === "Non-binary" &&
      hasNonBinaryQuestion && { 31: checkBoxesValidation(t) }),
  };

  const addressSchema = {
    address: addressValidation(t),
    city: cityValidation(t),
    state: stateValidation(t),
    zipCode: zipCodeValidation(t),
  };

  return object({
    ...schema.radioSchema,
    ...schema.checkboxSchema,
    ...stylesSchema,
    ...addressSchema,
    ...conditionalSchema,
    privacyPolicyCB: privacyPolicyCB(t),
  });
};

export default getInfluencerQuestionnaireValidationSchema;
