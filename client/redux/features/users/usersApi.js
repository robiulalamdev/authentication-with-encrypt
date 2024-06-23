import { api } from "../../api/apiSlice";

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    postLogin: builder.mutation({
      query: ({ data }) => ({
        url: `/users/login`,
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["users"],
    }),

    createUser: builder.mutation({
      query: ({ data }) => ({
        url: `/users/signup`,
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["users"],
    }),

    emailVerify: builder.mutation({
      query: ({ token, data }) => ({
        url: `/users/email-verify/${token}`,
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["users"],
    }),
  }),
});

export const {
  usePostLoginMutation,
  useCreateUserMutation,
  useEmailVerifyMutation,
} = usersApi;
