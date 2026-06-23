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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
          {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          },
        );

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }

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
    signIn: '/auth/signin', // ← your custom login page
  },

  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};
