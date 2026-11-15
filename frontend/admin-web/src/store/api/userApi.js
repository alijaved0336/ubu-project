import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../services/baseQueryWithReauth";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}`,
  }),
  tagTypes: ["User", "DeleteUser", "UpdateUser", "GetAmazonInfluencers"],
  endpoints: (build) => ({
    getUser: build.query({
      query: () => ({ url: "user/" }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["User"],
    }),

    getAmazonInfluencers: build.query({
      query: ({ currentPage, itemsPerPage, searchTerm }) => ({
        url: `user/getAmazonInfluencers?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`,
      }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["GetAmazonInfluencers"],
    }),

    getInfluencerProfile: build.query({
      query: () => ({
        url: `influencer/profile_info`,
      }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),

    updateUser: build.mutation({
      query: (payload) => ({
        url: "update-user",
        method: "PUT",
        data: payload,
      }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["UpdateUser"],
      // invalidatesTags: (result, error) => {
      //   return error ? [] : ["User"];
      // },
    }),

    updateUserProfilePhoto: build.mutation({
      query: (payload) => ({
        url: "user/update_user_profile_photo",
        method: "PUT",
        data: payload?.formData,
        onUploadProgress: payload?.callback,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: (result, error) => {
        return error ? [] : ["User"];
      },
    }),

    deleteUser: build.mutation({
      query: () => ({
        url: "user/",
        method: "DELETE",
      }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["DeleteUser"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetAmazonInfluencersQuery,
  useGetInfluencerProfileQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserProfilePhotoMutation,
} = userApi;

export default userApi;
