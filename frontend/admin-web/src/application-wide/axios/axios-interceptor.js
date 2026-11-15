import axiosInstance from "./axios-instance";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@src/store/features/authSlice";

const isAuthLogin = (config) => {
  return config.config.headers["X-Tracking-ID"] === "auth-login";
};

const isGenerateBodyScan = (config) => {
  return config.headers["X-GENERATE-BODY-SCAN"] === "body-scan";
};

const AxiosInterceptor = ({ children }) => {
  const [isSet, setIsSet] = useState(false);
  const { accessToken } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("axios: configuring...");

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (
          error &&
          error.response &&
          error.response?.data?.statusCode === 401
        ) {
          dispatch(logout());
        }

        return Promise.reject(error);
      }
    );

    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const bearerToken = `Bearer ${accessToken}`;

        // if (isGenerateBodyScan(config)) {
        //   config.headers = config.headers;
        // } else {
        //   config.headers.Authorization = bearerToken;
        // }
        config.headers = {...config.headers,Authorization:bearerToken}        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    setIsSet(true);

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, dispatch]);

  return isSet && children;
};
export default AxiosInterceptor;
