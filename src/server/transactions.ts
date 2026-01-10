import prisma from "@/lib/prisma";
import { publicProcedure, router } from "./tRPC";

export const transactionsRouter = router({
    createDefaultCategories: publicProcedure.mutation(async ({ }) => {
        const USER_ID = "Wm1zO1KHImNFRWpPxbJ3kQ2UoU7pA0Bg"

        const salaryCategory = await prisma.category.findFirst({
            where: { name: "Salary", userId: null },
        });

        const foodCategory = await prisma.category.findFirst({
            where: { name: "Food & Drinks", userId: null },
        });

        await prisma.transaction.create({
            data: {
                userId: USER_ID,
                amount: 1750.00,
                description: "Salary for first half of October",
                categoryId: salaryCategory?.id,

            }
        })

        await prisma.transaction.create({
            data: {
                userId: USER_ID,
                amount: 10.5,
                description: "Top Tea",
                categoryId: foodCategory?.id ?? undefined,
            }
        })
    }),
    getTransactions: publicProcedure.query(async ({ }) => {
        const transactions = await prisma.transaction.findMany()

        return { transactions: transactions }
    })
})