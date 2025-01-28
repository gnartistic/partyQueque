import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { usersRoutes } from "./routers/users";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  ...usersRoutes,
});

// export type definition of API
export type AppRouter = typeof appRouter;
