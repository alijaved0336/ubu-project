import useAxiosImmediately from "../axios/use-axios-immediately";

import { useCallback } from "react";

const GET_REVIEWS_API_URL = "/reviews/get-brand-reviews";

const useGetBrandReviews = (
  fetchImmediately = true,
  brandId
) => {
  const apiRequest = {
    method: "GET",
    url: `${GET_REVIEWS_API_URL}/${brandId}`,
  };

  const { loading, error, value, fetch } = useAxiosImmediately(
    apiRequest,
    fetchImmediately
  );

  const onGetBrandReviews = useCallback(async () => {
    return await fetch("GET", `${GET_REVIEWS_API_URL}/${brandId}`);
  }, [fetch, brandId]);

  return { loading, value, error, onGetBrandReviews };
};

export default useGetBrandReviews;
