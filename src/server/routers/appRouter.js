const { initTRPC } = require('@trpc/server');
const { userRouter } = require('./users');

const t = initTRPC.context().create();

const appRouter = t.router({
  user: userRouter,
});

module.exports = { appRouter };