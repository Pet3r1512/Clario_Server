import { transactionsRouter } from './transactions';
import { router } from './tRPC';

export const appRouter = router({
    transactions: transactionsRouter
});

export type AppRouter = typeof appRouter
