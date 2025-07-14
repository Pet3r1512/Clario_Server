import { PrismaClient } from "@/generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// Ensure env is loaded if not already
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
}

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

export default prisma;
