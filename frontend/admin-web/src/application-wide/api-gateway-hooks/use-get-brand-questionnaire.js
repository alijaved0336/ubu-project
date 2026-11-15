import { useCallback } from "react";
import useAxiosImmediately from "../axios/use-axios-immediately";

const GET_BRAND_API_URL = "/questionnaire";

const useGetBrandQuestionnaireOrInfluencerQuestionnaire = (
  fetchImmediately = true,
  user_type
) => {
  const apiRequest = {
    method: "GET",
    url: `${GET_BRAND_API_URL}/${user_type}?aa=true`,
  };

  const { loading, error, value, fetch } = useAxiosImmediately(
    apiRequest,
    fetchImmediately
  );

  const onBrandOrInfluencerQuestionnaire = useCallback(async () => {
    return await fetch("GET", `${GET_BRAND_API_URL}/${user_type}`);
  }, [fetch]);

  return { loading, value, error, onBrandOrInfluencerQuestionnaire };
};
export default useGetBrandQuestionnaireOrInfluencerQuestionnaire;
