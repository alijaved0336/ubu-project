import useAxiosImmediatelyQR from "../axios/use-axios-immediately-qr";

const GET_QR_API_URL = "influencer/generate_body_scan_token";

const useGetQRUrl = (fetchImmediately = true) => {
  const apiRequest = {
    method: "GET",
    url: `${GET_QR_API_URL}`,
    data:{},
    config:{
      headers: {
        // Authorization: `Bearer ${token}`,
        "X-GENERATE-BODY-SCAN": "body-scan",
      },
    }
  
  };
  const { loading, error, value } = useAxiosImmediatelyQR(
    apiRequest,
    fetchImmediately
  );

  return { loading, value , error, };
};
export default useGetQRUrl;
