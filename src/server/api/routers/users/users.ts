import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { date, z } from "zod";
import { env } from "@/env.mjs";
import { getAuth0Bearer } from "@/server/utils/getAuth0Bearer";
import superjson from "superjson";
import { findUserSchema } from "../../schemas/users/findUser.schema";
import { TRPCError } from "@trpc/server";
import spotifyAuth from "api/spotify-auth";

const stripe = require("stripe")(env.STRIPE_SECRET_KEY);

export const users = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z
          .string()
          .regex(/^(?!.*\s)[A-Za-z0-9!@#$%^&*]+$/)
          .min(8),
        firstname: z.string().optional(),
        lastname: z.string().optional(),
        spotifyauth: z.boolean().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password, firstname, lastname, spotifyauth } = input;

      console.log("Received Input:", input);

      // Check for duplicate email
      const emailExists = await prisma.users.findFirst({
        where: { email },
      });

      if (emailExists) {
        console.warn("Duplicate email detected:", email);
        return {
          success: false,
          message: "DUPLICATE_EMAIL",
        };
      }

      const user = {
        firstname,
        lastname,
        email,
        spotifyauth,
      };

      try {
        // Create user in the database
        const createdUser = await prisma.users.create({ data: user });

        console.log("User Created in DB:", createdUser);

        // Create user in Auth0
        const authToken = await getAuth0Bearer();
        const url = env.AUTH0AUDIENCE + "users";
        const body = JSON.stringify({
          user_id: String(createdUser.id),
          given_name: firstname,
          family_name: lastname,
          name: `${firstname} ${lastname}`,
          email,
          password,
          connection: "Username-Password-Authentication",
        });

        const options = {
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        };

        const res = await fetch(url, options);
        const resData = await res.json();

        console.log("Auth0 Response:", {
          status: res.status,
          data: resData,
        });

        if (!res.ok) {
          console.error("Auth0 User Creation Failed:", resData);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "AUTH0_CREATION_FAILED",
          });
        }

        return {
          status: 201,
          message: "User Successfully Created",
          user: createdUser,
        };
      } catch (error) {
        console.error("Error Creating User:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "USER_CREATION_ERROR",
        });
      }
    }),
  
});