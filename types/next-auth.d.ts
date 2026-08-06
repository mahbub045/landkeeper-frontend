import 'next-auth';
import 'next-auth/jwt';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'LANDLORD'
  | 'ADMIN'
  | 'LETTING_AGENT'
  | 'MORTGAGE_ADVISER'
  | 'TENANT';

declare module 'next-auth' {
  interface User {
    id: string;
    role: UserRole;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      accessToken: string;
      refreshToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}
