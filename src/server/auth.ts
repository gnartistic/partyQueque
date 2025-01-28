import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { env } from "@/env.mjs";
import { prisma } from "./db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      loginBefore: boolean;
      name: string;
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      let userID;
      let id;
      if (!token?.sub?.includes("auth0|")) {
        const userExists = await prisma.users.findFirst({
          where: {
            authid: token?.sub,
          },
        });

        if (userExists) {
          id = userExists.id;
        } else {
          // If first time logging in with a social account, create the user
          if (!token?.email) {
            throw new Error("Email is required to create a new user");
          }

          const user = await prisma.users.create({
            data: {
              authid: token?.sub,
              email: token.email, // Include the email field
              firstname: "New", // Placeholder values, replace as needed
              lastname: "User", // Placeholder values, replace as needed
              birthday: new Date("2000-01-01"), // Placeholder value, replace as needed
            },
          });

          id = user.id;
        }
      } else {
        userID = token?.sub?.replace("auth0|", "") as string;
        id = parseInt(userID) ?? 0;
      }

      const currentUser = await prisma.users.findFirst({
        where: {
          id,
        },
      });

      if (!currentUser) {
        // TODO: Redirect to login if needed
      }

      await prisma.users.update({
        where: {
          id,
        },
        data: {
          lastlogin: new Date(),
        },
      });

      // Check if the user has logged in before
      const loginBefore = currentUser?.loginbefore || false;

      return {
        ...session,
        user: {
          ...session.user,
          id: currentUser?.id,
          name: currentUser?.firstname ?? "User",
          loginBefore,
        },
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};