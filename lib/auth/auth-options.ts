import { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,

      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({
      token,
      account,
    }) {
      if (account) {
        token.githubId = Number(
          account.providerAccountId
        );

        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id = token.sub ?? "";

        session.user.githubId =
          token.githubId as number;

        session.user.accessToken =
          token.accessToken as string;
      }

      return session;
    },
  },
};