import prisma from "@/lib/prisma";
import { publicProcedure, router } from "./tRPC";
import z from "zod";

export const balancesRouter = router({
    createDefaultBalance: publicProcedure.input(
        z.object({
            userId: z.string(),
            currency: z.enum(["AUD", "USD", "VND"]).default("AUD")
        })
    ).mutation(async ({ input }) => {
        const { userId, currency } = input

        const defaultBalance = await prisma.balance.create({
            data: {
                userId: userId,
                currency: currency
            }
        })

        if (!defaultBalance) {
            return {
                status: 400,
                error: "Error when creating default balance"
            }
        }

        return {
            status: 200,
            message: "Default balance is created"
        }
    })
})