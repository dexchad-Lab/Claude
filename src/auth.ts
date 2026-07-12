import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import { isLoginLockedOut, recordLoginAttempt } from "@/lib/rateLimit";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email;

        if (await isLoginLockedOut(email)) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          await recordLoginAttempt(email, false);
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        await recordLoginAttempt(email, passwordsMatch);
        if (!passwordsMatch) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        // Look up fresh name/email so profile edits in Settings show up
        // immediately instead of waiting for the JWT to be re-issued.
        const user = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { name: true, email: true },
        });
        if (user) {
          session.user.name = user.name;
          session.user.email = user.email;
        }
      }
      return session;
    },
  },
});
