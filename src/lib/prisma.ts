// prisma.ts
import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"

neonConfig.poolQueryViaFetch = true

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    throw new Error("DATABASE_URL is not defined")
}

const adapter = new PrismaNeon({ connectionString })

let client: PrismaClient | null = null

export function getPrismaClient() {
    if (!client) {
        client = new PrismaClient({
            adapter,
            log: ["error"],
        })
    }
    return client
}

export default getPrismaClient()
