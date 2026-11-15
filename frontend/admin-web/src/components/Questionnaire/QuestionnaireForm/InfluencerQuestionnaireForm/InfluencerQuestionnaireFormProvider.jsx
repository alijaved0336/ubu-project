import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGetInfluencerQuestionnaireQuery } from "@src/store/api/questionnaireApi";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
// import { questionnaireData } from "./helpers";

const InfluencerQuestionnaireFormContext = createContext();

const InfluencerQuestionnaireFormProvider = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParams = Object.fromEntries(searchParams.entries());
  const isEditing = queryParams?.edit === "true" ?? false;

  const [otherStates, setOtherStates] = useState({
    selectedGender: 0,
  });

  const [selectedGender, setSelectedGender] = useState(undefined);

  const { questionnaireData, isLoading } = useGetInfluencerQuestionnaireQuery(
    { all: Boolean(isEditing) },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        questionnaireData: data,
        isLoading: isLoading || isFetching,
      }),
      refetchOnMountOrArgChange: true,
    }
  );

  const inputOptions = useMemo(() => {
    const filteredQuestions = questionnaireData?.questionnaire
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
  }, [questionnaireData]);

  useEffect(() => {
    const defaultOtherStates = inputOptions?.reduce((acc, curr) => {
      acc[curr?.input_field?.fieldName] = false;

      return acc;
    }, {});

    setOtherStates((prev) => ({ ...prev, ...defaultOtherStates }));
  }, [inputOptions]);

  const handleChangeOtherStates = useCallback((name, value) => {
    setOtherStates((prevStates) => ({ ...prevStates, [name]: value }));
  }, []);

  const value = useMemo(
    () => ({
      otherStates,
      setOtherStates,
      isLoadingQuestionnaire: isLoading,
      questionnaireData,
      inputOptions,
      onChangeOtherStates: handleChangeOtherStates,
      selectedGender,
      setSelectedGender,
      isEditing,
    }),
    [
      otherStates,
      handleChangeOtherStates,
      setOtherStates,
      inputOptions,
      questionnaireData,
      isLoading,
      selectedGender,
      setSelectedGender,
      isEditing,
    ]
  );

  return (
    <InfluencerQuestionnaireFormContext.Provider value={value}>
      {children}
    </InfluencerQuestionnaireFormContext.Provider>
  );
};

export const useInfluencerQuestionnaireForm = () => {
  return useContext(InfluencerQuestionnaireFormContext) ?? {};
};

InfluencerQuestionnaireFormProvider.propTypes = {
  children: PropTypes.node,
};

export default InfluencerQuestionnaireFormProvider;
