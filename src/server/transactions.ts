import prisma from "@/lib/prisma";
import { publicProcedure, router } from "./tRPC";
import z from "zod";
import { SupportedCurrency } from "@prisma/client";

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
    getTransactions: publicProcedure.input(z.object({
        userId: z.string()
    })).query(async ({ input }) => {
        const { userId } = input

        const transactions = await prisma.transaction.findMany({
            where: {
                userId
            },
            orderBy: { createdAt: "desc" },
            omit: {
                id: true,
                userId: true
            }
        })

        return { transactions: transactions }
    }),
    addTransaction: publicProcedure.input(z.object({
        userId: z.string(),
        categoryId: z.number().optional(),
        amount: z.number(),
        currency: z.enum(SupportedCurrency).optional(),
        description: z.string(),
    })).mutation(async ({ input }) => {
        const { userId, categoryId, amount, currency, description } = input

        // get category
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
            select: {
                type: true
            }
        })

        // add new transaction
        const newTransaction = await prisma.transaction.create({
            data: {
                userId: userId,
                categoryId: categoryId,
                amount: amount,
                currency: currency,
                description: description,
            }
        })

        // calculate transaction delta
        const delta = category?.type === "INCOME" ? amount : - amount

        // update balance
        await prisma.balance.upsert({
            where: {
                userId
            },
            update: {
                amount: {
                    increment: delta
                }
            },
            create: {
                userId,
                amount: delta,
                currency: currency || "AUD"
            }
        })

        return newTransaction
    })
})