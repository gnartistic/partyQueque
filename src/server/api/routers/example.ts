import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello World! ${input.text}`,
      };
    }),
    
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
