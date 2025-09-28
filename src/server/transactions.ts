import prisma from "@/lib/prisma";
import { publicProcedure, router } from "./tRPC";

export const transactionsRouter = router({
    createDefaultCategories: publicProcedure.mutation(async ({ }) => {
        await prisma.$connect()
        const response = await prisma.categories.create({
            data: {
                id: 1,
                name: "Demo",
                type: "INCOME",
                description: "demo desc"
            }
        })
        console.log(response)
    })
})