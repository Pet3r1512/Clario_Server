import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
    baseURL: isProduction
        ? "https://api.clariofinance.site"
        : "http://localhost:8787",

    basePath: "/api/auth",

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
    },

    trustedOrigins: isProduction
        ? [
            "https://www.clariofinance.site",
        ]
        : [
            "http://localhost:5173",
            "http://192.168.50.89:5173",
        ],

    session: {
        expiresIn: 60 * 60 * 24 * 7,

        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },

    advanced: {
        crossSubDomainCookies: {
            enabled: true,
            domain: ".clariofinance.site",
        },

        defaultCookieAttributes: {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            path: "/",
        },
    },
});

export default auth;
