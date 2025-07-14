import z from "zod"
import { auth } from "@/lib/auth"
import { publicProcedure, router } from "./tRPC"

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
    })
})

export default authRouter