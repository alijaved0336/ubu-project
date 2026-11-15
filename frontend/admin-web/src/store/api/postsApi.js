import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../services/baseQueryWithReauth";

const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: baseQueryWithReauth({
    baseUrl: `${import.meta.env.VITE_BACKEND_API_BASE_URL}posts`,
    //baseUrl: 'http://localhost:3000/posts'
  }),
  tagTypes: ["AllPosts", "PostById"],
  endpoints: (build) => ({
    getAllPosts: build.query({
      query: ({ currentPage, itemsPerPage, searchTerm, status }) => ({
        url: `?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&status=${status}`,
      }),

      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["AllPosts"],
    }),
    getPostById: build.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data,
      providesTags: ["PostById"],
    }),

    deletePost: build.mutation({
      query: (postId) => ({
        url: `/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error) => {
        return error ? [] : ["AllPosts"];
      },
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useDeletePostMutation,
} = postsApi;

export default postsApi;
