import type { DefaultSession } from "next-auth";

export type UserRole =
  | "SUPER_ADMIN"
  | "LANDLORD"
  | "ADMIN"
  | "LETTING_AGENT";

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
