import PropTypes from "prop-types";
import FinalStep from "./FinalStep";
import Question from "../../Question/Question";
import Progressbar from "@src/components/Common/Progressbar/Progressbar";

import { Form, notification, Spin } from "antd";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@src/components/Common/Widgets";
import { setUpdatedUser } from "@src/store/features/authSlice";
import { useUpdateUserMutation } from "@src/store/api/userApi";
import { shouldIncludeQuestion } from "./helpers";
import { Heading } from "@src/components/Common/Typography";
import { useInfluencerQuestionnaireForm } from "./InfluencerQuestionnaireFormProvider";

const InfluencerQuestionnaireForm = ({ form, audienceRegion, onBack }) => {
  const { user } = useSelector((state) => state.auth || {});
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const {
    questionnaireData,
    otherStates,
    inputOptions,
    setOtherStates,
    isLoadingQuestionnaire,
    setSelectedGender,
  } = useInfluencerQuestionnaireForm();

  const surveyQuestions = questionnaireData?.questionnaire;
  console.log({ surveyQuestions });
  const currentQuestion = surveyQuestions?.[currentQuestionIndex] ?? {};

  const isLastQuestion = currentQuestionIndex === surveyQuestions.length;
  const isFirstQuestion = currentQuestionIndex === 0;

  const areQuestionsComplete = currentQuestionIndex >= surveyQuestions.length;

  const {
    handleSubmit,
    watch,
    formState: { errors },
    control,
    trigger,
    clearErrors,
    setValue,
  } = form;

  const hasError =
    !!errors[currentQuestion?.sr_no] ||
    Object.keys(otherStates).some((key) => !!errors[key]);

  const gender = watch("2");

  const handleNextStep = async () => {
    let nextIndex = currentQuestionIndex + 1;

    const currentQuestionKey = String(currentQuestion.sr_no);

    const checkedStates = otherStates
      ? Object.keys(otherStates).filter((key) => otherStates[key] === true)
      : [];

    let isValid = await trigger([currentQuestionKey, ...checkedStates]);

    if (!isValid) return;

    clearErrors();

    while (
      nextIndex < surveyQuestions.length &&
      !shouldIncludeQuestion(surveyQuestions[nextIndex], gender)
    ) {
      nextIndex++;
    }

    if (nextIndex <= surveyQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const handlePreviousStep = () => {
    if (isFirstQuestion) return onBack && onBack();

    let prevIndex = currentQuestionIndex - 1;

    const fieldNames = Object.keys(otherStates);

    const updatedOtherStates = fieldNames?.reduce((acc, field) => {
      const value = watch(field);

      if (!value) {
        acc[field] = false;
      }

      return acc;
    }, {});

    setOtherStates((prev) => ({ ...prev, ...updatedOtherStates }));
    clearErrors();

    while (
      prevIndex >= 0 &&
      !shouldIncludeQuestion(surveyQuestions[prevIndex], gender)
    ) {
      prevIndex--;
    }

    if (prevIndex >= 0) {
      setCurrentQuestionIndex(prevIndex);
    }
  };

  const onSubmit = async (data) => {
    const mappedData = Object.keys(data)?.reduce((acc, key) => {
      if (!Array.isArray(data[key]) && !isNaN(key)) {
        acc[key] = [data[key]];
      } else {
        acc[key] = data[key];
      }

      return acc;
    }, {});

    inputOptions?.forEach((option) => {
      mappedData[option?.sr_no] = mappedData[option?.sr_no]?.filter(
        (answer) => !answer?.includes(option?.option)
      );

      if (mappedData[option?.input_field?.fieldName]) {
        mappedData[option?.sr_no]?.push(
          `${option?.input_field?.fieldName}:${
            mappedData[option?.input_field?.fieldName]
          }`
        );
        delete mappedData[option?.input_field?.fieldName];
      }
    });
    const {
      address,
      city,
      state,
      zipCode,
      privacyPolicyCB,
      additionalInfo,
      ...answers
    } = mappedData;

    const influencerAdditionalDto = Object.keys(answers)
      ?.reduce((acc, key) => {
        const foundQuestion = surveyQuestions.find(
          (question) => question?.sr_no === +key
        );

        if (foundQuestion) {
          acc.push({
            questionId: foundQuestion?.id,
            srNo: key,
            answer: answers[key],
          });
        }

        return acc;
      }, [])
      ?.reduce((acc, item, index) => {
        acc[index] = item;
        return acc;
      }, {});

    const payload = {
      influencerAdditionalDto,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      avatar: user?.avatar || null,
      address: address,
      city: city,
      state: state,
      zip_code: zipCode,
      instagram_creds: data?.instagram_creds,
      is_influencer: true,
      influencer: {
        audience_region: audienceRegion || "",
      },
    };

    try {
      const data = await updateUser(payload).unwrap();

      if (data) {
        dispatch(setUpdatedUser(data));
      }

      if (data?.is_scanned) {
        navigate("/dashboard/posts");
      } else {
        navigate("/qr-Page");
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    }
  };

  useEffect(() => {
    setSelectedGender(gender);
  }, [gender, setSelectedGender]);

  return (
    <Form
      className="tw-relative tw-min-h-[calc(100vh-104px)] tw-flex tw-flex-col tw-justify-between"
      onFinish={handleSubmit(onSubmit)}
    >
      <div className="tw-mx-auto">
        <Heading level={2} className="tw-mb-4">
          UBU Onboarding
        </Heading>

        {isLoadingQuestionnaire && (
          <div className="tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2">
            <Spin size="default" />
          </div>
        )}

        {currentQuestionIndex < surveyQuestions.length && (
          <Question
            key={currentQuestion?.sr_no}
            question={currentQuestion}
            errors={errors}
            hasError={hasError}
            control={control}
            setValue={setValue}
            clearErrors={clearErrors}
          />
        )}

        {currentQuestionIndex >= surveyQuestions.length && (
          <FinalStep
            errors={errors}
            control={control}
            audienceRegion={audienceRegion}
          />
        )}
      </div>

      <div className="tw-sticky tw-left-0 tw-w-full tw-h-auto tw-bottom-0 tw-bg-white tw-z-10 tw-mx-auto md:tw-w-[737px]">
        {currentQuestionIndex < surveyQuestions.length && (
          <Progressbar
            currentStep={currentQuestionIndex}
            totalSteps={surveyQuestions.length || 0}
          />
        )}
        <div className="tw-pt-3 tw-pb-3  tw-flex tw-justify-between tw-items-center">
          <Button
            htmlType="button"
            variant="outlined"
            onClick={handlePreviousStep}
          >
            Back
          </Button>

          {!isLastQuestion && (
            <Button
              htmlType="button"
              className="tw-ml-auto"
              disabled={isLoadingQuestionnaire}
              onClick={handleNextStep}
            >
              Next
            </Button>
          )}
          {areQuestionsComplete && (
            <Button
              htmlType="submit"
              disabled={isUpdatingUser}
              loading={isUpdatingUser}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
};

InfluencerQuestionnaireForm.propTypes = {
  form: PropTypes.object,
  audienceRegion: PropTypes.string,
  onBack: PropTypes.func,
};
export default InfluencerQuestionnaireForm;
