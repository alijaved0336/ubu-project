import useAxiosImmediately from "../axios/use-axios-immediately";

import { useCallback } from "react";

const GET_WHATS_NEW_API_URL = "/whats_new/get_all";

const useGetWhatsNew = (fetchImmediately = true) => {
  const apiRequest = {
    method: "GET",
    url: `${GET_WHATS_NEW_API_URL}`,
  };

  const { loading, error, value, fetch } = useAxiosImmediately(
    apiRequest,
    fetchImmediately
  );

  const onGetWhatsNew = useCallback(async () => {
    return await fetch("GET", `${GET_WHATS_NEW_API_URL}`);
  }, [fetch]);

  return { loading, value, error, onGetWhatsNew };
};

export default useGetWhatsNew;
