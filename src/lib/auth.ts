import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
    baseURL: "https://clarioserver.peter1512-dev.workers.dev",
    // baseURL: "http://localhost:8787",
    basePath: "/api/auth",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["https://clario-web.pages.dev"],
    // trustedOrigins: ["http://localhost:5173"],

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
    },

    cookieOptions: {
        secure: true,
        httpOnly: true,
        sameSite: "None",
        path: "/",
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            partitioned: true // New browser standards will mandate this for foreign cookies
        },
        cookies: {
            sessionToken: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    partitioned: true // New browser standards will mandate this for foreign cookies
                }
            }
        }
    }
});

export default auth;
