import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'

export const auth = betterAuth({
    baseURL: "http://localhost:8787",
    basePath: "/api/auth",
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: [process.env.TRUSTED_ORIGIN || "http://localhost:5173"]
})

export default auth

