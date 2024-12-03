const { initTRPC } = require('@trpc/server');
const { z } = require('zod');

const t = initTRPC.context().create();

const userRouter = t.router({
  getAll: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  create: t.procedure
    .input(
      z.object({
        firstname: z.string(),
        lastname: z.string(),
        birthday: z.string(),
        spotifyauth: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.create({ data: input });
    }),
});

module.exports = { userRouter };