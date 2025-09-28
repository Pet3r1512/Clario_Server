import authRouter from './auth';
import { transactionsRouter } from './transactions';
import { router } from './tRPC';

export const appRouter = router({
    auth: authRouter,
    transactions: transactionsRouter
});

export type AppRouter = typeof appRouter
