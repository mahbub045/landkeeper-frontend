import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          scope: 'openid email profile',
        },
      },
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if (!res.ok) return null;

        const { access, refresh } = await res.json();

        if (!access) return null;

        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${access}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!profileRes.ok) return null;

        const profile = await profileRes.json();

        return {
          id: profile.id,
          email: profile.email,
          role: profile.role,
          accessToken: access,
          refreshToken: refresh,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // ✅ Called by SessionSync → update() after token refresh in baseApi
      if (trigger === 'update' && session?.accessToken) {
        token.accessToken = session.accessToken;
        token.refreshToken = session.refreshToken;
        return token;
      }

      // ✅ Google sign-in flow
      if (account?.provider === 'google' && account.access_token) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/social/google`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                access_token: account.access_token,
              }),
            },
          );

          if (res.ok) {
            const { access, refresh } = await res.json();

            const profileRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
              {
                headers: {
                  Authorization: `Bearer ${access}`,
                  'Content-Type': 'application/json',
                },
              },
            );

            if (profileRes.ok) {
              const profile = await profileRes.json();
              token.id = profile.id;
              token.email = profile.email;
              token.role = profile.role;
              token.accessToken = access;
              token.refreshToken = refresh;
            }
          } else {
            console.error('Backend Google auth failed:', await res.text());
          }
        } catch (error) {
          console.error('Google auth backend error:', error);
        }

        return token;
      }

      // ✅ Credentials sign-in flow
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email || '';
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },

  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};
