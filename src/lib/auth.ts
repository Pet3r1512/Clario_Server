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
    // advanced: {
    //     useSecureCookies: process.env.NODE_ENV === "production",
    //     crossSubDomainCookies: {
    //         enabled: true,
    //     },
    //     defaultCookieAttributes: {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === "production",
    //         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //         path: "/"
    //     },
    //     cookies: {
    //         session_token: {
    //             name: "Clario",
    //             attributes: {
    //                 httpOnly: true,
    //                 secure: process.env.NODE_ENV === "production",
    //                 sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //                 path: "/"
    //             }
    //         }
    //     }
    // },
    adapter: {
        fetch: async (request: string | Request | URL) => {
            const response = await fetch(request);
            return new Response(await response.text(), response);
        },
    },
})

export default auth