import axiosInstance from "./axiosInstance";

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: axiosInstance.defaults.baseURL }) =>
  async ({ url, method, data, params, headers, onUploadProgress }) => {
    try {
      const response = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        onUploadProgress: onUploadProgress
          ? (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );

                onUploadProgress(progress);
              }
            }
          : undefined,
      });
      return { data: response };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
