import 'next-auth';
import 'next-auth/jwt';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'LANDLORD'
  | 'ADMIN'
  | 'LETTING_AGENT'
  | 'MORTGAGE_ADVISER'
  | 'TENANT';

export type SubscriptionStatus =
  'ACTIVE' | 'PENDING' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';

declare module 'next-auth' {
  interface User {
    id: string;
    role: UserRole;
    has_subscription: boolean;
    subscription_status: SubscriptionStatus;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      has_subscription: boolean;
      subscription_status: SubscriptionStatus;
      accessToken: string;
      refreshToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    has_subscription: boolean;
    subscription_status: SubscriptionStatus;
    accessToken: string;
    refreshToken: string;
  }
}
