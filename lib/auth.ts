import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
        const testUsers = [
          {
            id: '1',
            name: 'Admin User',
            email: 'rahat@admin.com',
            password: 'admin',
            accessToken: 'test-token-admin',
          },
          {
            id: '2',
            name: 'Super Admin',
            email: 'super@test.com',
            password: 'super123',
            accessToken: 'test-token-super',
          },
          {
            id: '3',
            name: 'Test User',
            email: 'user@test.com',
            password: 'user123',
            accessToken: 'test-token-user',
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
        token.accessToken = user.accessToken; // ← store API token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: '/auth/login', // ← your custom login page
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
