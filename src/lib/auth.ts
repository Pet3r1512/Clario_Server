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
        sameSite: "None",
        httpOnly: true,
        path: "/",
    },
    advanced: {
        defaultCookieAttributes: {
            secure: true,
            sameSite: "None",
            httpOnly: true,
        },
    },

});

export default auth;
