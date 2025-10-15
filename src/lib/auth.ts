import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'

export const auth = betterAuth({
    baseURL: process.env.BASE_URL || "https://clarioserver.peter1512-dev.workers.dev",
    basePath: "/api/auth",
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: [process.env.TRUSTED_ORIGIN || "https://clario-web.pages.dev"],
    session: {
        expiresIn: 60 * 60 * 24 * 7 //.    7 days
    },
    cookieOptions: {
        secure: false,
        sameSite: "lax",
        path: "/",
    },
    advanced: {
        crossSubDomainCookies: {
            enabled: true
        },
        cookies: {
            sessionToken: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    partitioned: true
                }
            }
        }
    }
})

export default auth