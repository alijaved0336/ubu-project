import React, { createContext, useContext, useMemo } from "react";
import { useGetSegmentQuestionnaireQuery } from "@src/store/api/questionnaireApi";
import PropTypes from "prop-types";

const InfluencerQuestionnaireContext = createContext();

const InfluencerQuestionnaireProvider = ({ children }) => {
  const { questionnaireData, isLoadingQuestionnaire } =
    useGetSegmentQuestionnaireQuery(undefined, {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        questionnaireData: data?.data ?? {},
        isLoadingQuestionnaire: isLoading || isFetching,
      }),
      refetchOnMountOrArgChange: true,
    });

  const value = useMemo(
    () => ({
      isLoadingQuestionnaire,
      questionnaireData,
    }),
    [isLoadingQuestionnaire, questionnaireData]
  );

  return (
    <InfluencerQuestionnaireContext.Provider value={value}>
      {children}
    </InfluencerQuestionnaireContext.Provider>
  );
};

export const useInfluencerQuestionnaire = () => {
  return useContext(InfluencerQuestionnaireContext) ?? {};
};

InfluencerQuestionnaireProvider.propTypes = {
  children: PropTypes.node,
};
export default InfluencerQuestionnaireProvider;
