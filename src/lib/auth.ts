import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
    baseURL: process.env.BASE_URL || "http://localhost:8787",
    basePath: "/api/auth",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["https://clario-web.pages.dev", "http://localhost:5173"],

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
        cookies: {
            sessionToken: {
                attributes: {
                    sameSite: "None",
                    secure: true,
                },
            },
        },
        defaultCookieAttributes: {
            sameSite: "None",
            secure: true,
        }
    },
});

export default auth;
