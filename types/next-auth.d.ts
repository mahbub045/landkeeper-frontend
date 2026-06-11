import type { DefaultSession } from "next-auth";

export type UserRole = "ADMIN" | "LANDLORD" | "TENANT";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    role?: UserRole;
  }
  interface Session {
    user: {
      id: string;
      accessToken?: string;
      role?: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken?: string;
    role?: UserRole;
  }
}
