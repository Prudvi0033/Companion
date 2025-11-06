import type { Context, Next } from "hono"
import jwt  from "jsonwebtoken"
import { JWT_ACCESS_SECRET } from "../services/constants"

const secret = JWT_ACCESS_SECRET

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        const authHeader = await c.req.header("Authorization")
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return c.json({msg: "No token provided"}, 401)
        }

        const token = authHeader.split(" ")[1]!
        const decoded = jwt.verify(token, secret) as {userId: string}

        c.set("userId", decoded.userId)

        await next()

    } catch (error) {
        return c.json({ msg: "Invalid or expired token" }, 401);
    }
}