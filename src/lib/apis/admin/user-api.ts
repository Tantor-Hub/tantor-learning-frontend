import { baseQuery, createApi } from "../base-api";
import { UserRole, IUser } from "@/types/user";

export interface UsersListResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: IUser[];
  };
}

export interface IUsersListByGroupResponse {
  status: number;
  message: string;
  data: {
    length: number;
    list: IUser[];
  };
}

export interface AddUserRequest {
  firstName: string;
  lastName: string;
  password: string;
  nick_name: string; // ie. username CFR. to the mockup on figma
  email: string;
  id_role: number;
  phone: string;
}

export interface AddUserResponse {
  status: number;
  message: string;
}

export interface Subscriber {
  id: number;
  user_email: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscribersResponse {
  status: number;
  data: {
    length: number;
    list: Subscriber[];
  };
}

export interface DailyLoginsResponse {
  status: number;
  message: string;
  data: {
    dailyLogins: {
      date: string;
      count: number;
    }[];
    period: string;
    totalLogins: number;
  };
}

export const AdminApi = createApi({
  reducerPath: "adminApi",
  baseQuery,
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    listUsers: builder.query<UsersListResponse, void>({
      query: () => "users/listall",
      providesTags: ["Admin"],
    }),
    add: builder.mutation<AddUserResponse, AddUserRequest>({
      query: (userData) => ({
        url: "users/user/add",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Admin"],
    }),
    listUserByGroup: builder.query<
      IUsersListByGroupResponse,
      {
        group: UserRole | "all";
      }
    >({
      query: (request) => `users/list/bygroup/${request.group}`,
      providesTags: ["Admin"],
    }),
    listSubscribers: builder.query<SubscribersResponse, void>({
      query: () => "cms/admin/newsletter/subscribers",
      providesTags: ["Admin"],
    }),
    getDailyLogins: builder.query<DailyLoginsResponse, void>({
      query: () => "users/admin/daily-logins",
      providesTags: ["Admin"],
    }),
    toggleVerification: builder.mutation<{ status: number; message: string }, { userId: string }>({
      query: (request) => ({
        url: `users/admin/user/${request.userId}/toggle-verification`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin"],
    }),
    getUserProfile: builder.query<
      {
        status: number;
        message: string;
        data: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          avatar: string;
          role: string;
          phone: string;
          address: string;
          city: string;
          country: string;
          dateBirth: string;
          createdAt: string;
          updatedAt: string;
        };
      },
      { userId: string }
    >({
      query: (request) => `users/admin/user/${request.userId}/profile`,
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useListUsersQuery,
  useAddMutation,
  useListUserByGroupQuery,
  useListSubscribersQuery,
  useGetDailyLoginsQuery,
  useToggleVerificationMutation,
  useGetUserProfileQuery,
} = AdminApi;
