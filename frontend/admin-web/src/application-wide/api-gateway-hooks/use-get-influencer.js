import { useCallback } from "react";
import useAxiosImmediately from "../axios/use-axios-immediately";

const GET_BRAND_API_URL = "/influencer";

const useGetInfluencer = (
  fetchImmediately = true,
  inf_id
) => {
  const apiRequest = {
    method: "GET",
    url: `${GET_BRAND_API_URL}/${inf_id}`,
  };

  const { loading, error, value, fetch } = useAxiosImmediately(
    apiRequest,
    fetchImmediately
  );

  const onGetInlfuencer = useCallback(async () => {
    return await fetch("GET", `${GET_BRAND_API_URL}/${inf_id}`);
  }, [fetch]);

  return { loading, value, error, onGetInlfuencer };
};
export default useGetInfluencer;
