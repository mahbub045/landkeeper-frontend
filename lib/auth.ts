import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // call your API here
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        })

        const user = await res.json()

        if (res.ok && user) {
          return user   // ← must return user object
        }
        return null     // ← return null if login fails
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.accessToken = user.accessToken  // ← store API token
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.accessToken = token.accessToken
      return session
    },
  },

  pages: {
    signIn: "/auth/login",       // ← your custom login page
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
}