import prisma from "@/lib/prisma";
import { publicProcedure, router } from "./tRPC";

export const transactionsRouter = router({
    createDefaultCategories: publicProcedure.mutation(async ({ }) => {
        await prisma.$connect()
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
                date: new Date("2025-09-29"),
                categoryId: salaryCategory?.id,

            }
        })

        await prisma.transaction.create({
            data: {
                userId: USER_ID,
                amount: 10.5,
                description: "Top Tea",
                date: new Date("2025-09-30"),
                categoryId: foodCategory?.id ?? undefined,
            }
        })
    }),
    getTransactions: publicProcedure.query(async ({ }) => {
        await prisma.$connect()
        const transactions = await prisma.transaction.findMany()

        prisma.$disconnect()
        return { transactions: transactions }
    })
})