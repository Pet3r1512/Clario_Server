import { balancesRouter } from './balance';
import { transactionsRouter } from './transactions';
import { router } from './tRPC';

export const appRouter = router({
    transactions: transactionsRouter,
    balances: balancesRouter
});

export type AppRouter = typeof appRouter
