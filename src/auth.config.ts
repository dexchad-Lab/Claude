import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // Self-hosted app with no fixed canonical domain (localhost in dev,
  // whatever host it's served behind in production) — trust the request Host.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/applications") ||
        nextUrl.pathname.startsWith("/settings") ||
        nextUrl.pathname.startsWith("/network") ||
        nextUrl.pathname.startsWith("/chat");

      if (isProtected) {
        return isLoggedIn;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
