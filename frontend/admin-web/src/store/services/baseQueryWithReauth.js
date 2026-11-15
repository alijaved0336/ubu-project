import { Mutex } from "async-mutex";
import { axiosBaseQuery } from "./axiosBaseQuery";
import axiosInstance from "./axiosInstance";
import authApi from "../api/authApi";
import { logout } from "../features/authSlice";

// create a new mutex
const mutex = new Mutex();

const baseQueryWithReauth = (
  { baseUrl } = { baseUrl: axiosInstance.defaults.baseURL }
) => {
  // wait until the mutex is available without locking it
  return async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    const baseQuery = axiosBaseQuery({ baseUrl: baseUrl });

    const updatedArgs = {
      ...args,
      headers: {
        ...args.headers,
        Authorization: `Bearer ${api.getState().auth.accessToken}`, // Dynamically get token from Redux store
      },
    };

    let result = await baseQuery(updatedArgs);

    if (result.error && result.error.status === 401) {
      // checking whether the mutex is locked
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        api.dispatch(logout());
        release();
        // try {
        //   const refreshToken = api.getState().auth.refreshToken; // Get refresh token from Redux state

        //   // Call the refreshToken mutation from authApi
        //   const refreshResult = await api
        //     .dispatch(authApi.endpoints.refreshToken.initiate(refreshToken))
        //     .unwrap();
        //   const { data } = refreshResult ?? {};

        //   if (data?.accessToken) {
        //     updatedArgs.headers.Authorization = `Bearer ${data.accessToken}`;
        //     result = await baseQuery(updatedArgs);
        //   } else {
        //     api.dispatch(logout());
        //   }
        // } catch (ex) {
        //   api.dispatch(logout());
        // } finally {
        //   // release must be called once the mutex should be released again.
        //   release();
        // }
      } else {
        // wait until the mutex is available without locking it
        await mutex.waitForUnlock();

        if (!api.getState().auth.accessToken) {
          return { error: { status: 401, data: "Session expired" } };
        }

        result = await baseQuery(updatedArgs);
      }
    }
    return result;
  };
};

export default baseQueryWithReauth;
