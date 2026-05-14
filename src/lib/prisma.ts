import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

let prisma: PrismaClient | null = null;

export function getPrismaClient() {
    if (!prisma) {
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
}

export default getPrismaClient();