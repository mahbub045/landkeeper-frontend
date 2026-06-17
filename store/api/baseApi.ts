import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AuthRootState } from "../types";

export const TAG_TYPES = [
  "Appearance",
  "Applicant",
  "Auth",
  "Common",
  "CompanyInfo",
  "FormLayout",
  "Network",
  "Organisation",
  "PublicEnquiry",
  "SuperAdmin",
  "UserProfileAndSettings",
] as const;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AuthRootState).auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
});