import { useCallback } from "react";
import useAxiosImmediately from "../axios/use-axios-immediately";

const GET_BRAND_PROFILE_API_URL = "/brand";

const useGetBrandProfileInformation = (
  fetchImmediately = true,
  brandId
) => {
  const apiRequest = {
    method: "GET",
    url: `${GET_BRAND_PROFILE_API_URL}/${brandId}`,
  };

  const { loading, error, value, fetch } = useAxiosImmediately(
    apiRequest,
    fetchImmediately
  );

  const onGetBrandProfile = useCallback(async () => {
    return await fetch("GET", `${GET_BRAND_PROFILE_API_URL}/${brandId}`);
  }, [fetch, brandId]);

  return { loading, value, error, onGetBrandProfile };
};

export default useGetBrandProfileInformation;
