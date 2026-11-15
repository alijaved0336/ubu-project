import React, { useCallback, useMemo } from "react";

const useQuestionnaireHelpers = (questionnaireData, selectedAnswers) => {
  const questionnaire = useMemo(() => {
    return Object.values(questionnaireData)?.flatMap((category) =>
      category?.map((question, index) => ({
        ...question,
        type: index === 0 ? "category" : "",
      }))
    );
  }, [questionnaireData]);

  const { appliedFilters, existingOtherFields } = useMemo(() => {
    const existingOtherFields = Object.values(selectedAnswers)
      ?.flatMap((options) => options)
      ?.filter((option) => option?.includes(":"))
      ?.reduce((acc, curr) => {
        const [key, value] = (curr || "").split(":");

        acc[key] = value;

        return acc;
      }, {});

    const existingFilters = Object.keys(selectedAnswers)?.reduce((acc, key) => {
      const foundQuestion = questionnaire?.find(
        (question) => question?.id === +key
      );

      if (foundQuestion) {
        acc[foundQuestion?.sr_no] = selectedAnswers[key]?.filter(
          (option) => !option?.includes(":")
        );
      }

      return acc;
    }, {});

    const appliedFilters = { ...existingFilters, ...existingOtherFields };

    return { appliedFilters, existingOtherFields };
  }, [selectedAnswers, questionnaire]);

  const inputOptions = useMemo(() => {
    const filteredQuestions = questionnaire
      ?.filter((question) =>
        question?.options?.some((option) => option?.input_field)
      )
      ?.map((question) => ({
        ...question,
        options: question?.options?.filter((option) => option?.input_field),
      }))
      ?.flatMap((question) =>
        question?.options?.map((option) => ({
          ...option,
          sr_no: question?.sr_no,
        }))
      );

    return filteredQuestions;
  }, [questionnaire]);

  const defaultInputOptionsValue = useMemo(() => {
    return inputOptions?.reduce((acc, curr) => {
      if (curr?.input_field?.fieldName) acc[curr.input_field.fieldName] = "";
      return acc;
    }, {});
  }, [inputOptions]);

  const defaultOtherStates = useMemo(() => {
    return inputOptions?.reduce((acc, curr) => {
      if (curr?.input_field?.fieldName) acc[curr.input_field.fieldName] = false;
      return acc;
    }, {});
  }, [inputOptions]);

  const getMappedQuestionnaireData = useCallback(
    (data) => {
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
      return mappedData;
    },
    [inputOptions]
  );

  return {
    questionnaire,
    inputOptions,
    existingOtherFields,
    appliedFilters,
    defaultInputOptionsValue,
    defaultOtherStates,
    getMappedQuestionnaireData,
  };
};

export default useQuestionnaireHelpers;
