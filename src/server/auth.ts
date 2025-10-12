import z from "zod"
import { auth } from "@/lib/auth"
import { publicProcedure, router } from "./tRPC"
import cookie from 'cookie'

export const authRouter = router({
    signUpViaEmail: publicProcedure.input(z.object({
        email: z.email("Invalid Email"),
        name: z.string().min(3, "Username is too short"),
        password: z.string().min(8, "Password must be at least 8 characters long")
    })).mutation(async ({ input }) => {
        const { email, name, password } = input
        const response = await auth.api.signUpEmail({
            body: {
                email, name, password
            }
        })
        if (!response) {
            return { status: 400, message: "Error" }
        }
        return { status: 200, message: "Sign Up Done" }
    }),
    signInViaEmail: publicProcedure.input(z.object({
        email: z.email("Invalid Email"),
        password: z.string().min(1, "Password cannot be empty")
    })).mutation(async ({ input, ctx }) => {
        const { email, password } = input
        const { headers, response } = await auth.api.signInEmail({
            returnHeaders: true,
            body: {
                email, password
            },
        })
        if (!response) {
            return {
                status: 400, message: "Error"
            }
        }

        const setCookie = headers.get("set-cookie")

        if (setCookie && ctx.resHeaders) {
            ctx.resHeaders.set("Set-Cookie", setCookie);
        }

        return { status: 200, message: "Sign In Done" }
    })
})

export default authRouter