import type { UserRole } from '@/types/next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface TestUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  accessToken: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // call your API here
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        //   method: "POST",
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" },
        // })

        // const user = await res.json()

        // if (res.ok && user) {
        //   return user
        // }

        // ✅ TEST CREDENTIALS — remove before production
        const testUsers: TestUser[] = [
          {
            id: '1',
            name: 'Admin User',
            email: 'rahat@admin.com',
            password: 'admin',
            role: 'ADMIN',
            accessToken: 'test-token-admin',
          },
          {
            id: '2',
            name: 'Landlord User',
            email: 'landlord@test.com',
            password: 'landlord123',
            role: 'LANDLORD',
            accessToken: 'test-token-landlord',
          },
        ];

        const user = testUsers.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password,
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: user.accessToken,
          };
        }
        // ✅ TEST CREDENTIALS — remove before production end

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: '/auth/login', // ← your custom login page
  },

  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};
