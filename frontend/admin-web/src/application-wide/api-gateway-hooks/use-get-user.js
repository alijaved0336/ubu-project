import { useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const GET_API_URL = `${import.meta.env.VITE_BACKEND_API_BASE_URL}user`;

const useGetUser = (accessToken) => {
  const token = useSelector((state) => state?.auth?.accessToken || "");

  const onGetUser = useCallback(
    async () => {
      console.log("Fetching user with token:", token);

      try {
        const response = await axios.get(GET_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure 'Bearer' is included if using Bearer tokens
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error; // Optional: rethrow error for handling in the component
      }
    },
    [token] // Include `token` in the dependency array
  );

  return { onGetUser };
};

export default useGetUser;
