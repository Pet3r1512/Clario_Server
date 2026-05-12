import prisma from "@/lib/prisma";
import { publicProcedure, router } from "./tRPC";
import z from "zod";
import CalculateHighestIncome from "../lib/analytics/CalculateHighestIncome"

export const analyticsRouter = router({
    highestIncomeOfMonth: publicProcedure.input(
        z.object({
            userId: z.string(),
            month: z.number().min(1).max(12).default(
                new Date().getMonth() + 1
            ),

            year: z.number().default(
                new Date().getFullYear()
            ),
        })
    ).query(async ({ input }) => {
        const { userId, month, year } = input

        const startOfMonth = new Date(year, month - 1, 1);

        const endOfMonth = new Date(
            year,
            month,
            0,
            23,
            59,
            59
        );

        const allIncomeAmount = await prisma.transaction.findMany({
            where: {
                userId,
                categoryId: {
                    lt: 8,
                },
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            select: {
                amount: true,
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const formattedIncome = allIncomeAmount
            .filter(
                (income): income is typeof income & { category: { name: string } } =>
                    income.category !== null
            )
            .map((income) => ({
                amount: income.amount.toNumber(),
                category: income.category,
            }));

        return { highestIncome: CalculateHighestIncome(formattedIncome) }
    })
})