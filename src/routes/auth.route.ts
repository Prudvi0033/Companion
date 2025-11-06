import { Hono } from "hono";
import { login, logout, refreshToken, signUp } from "../controllers/auth.controller";

export const authRouter = new Hono()

authRouter.post("/sign-up", signUp)
authRouter.post("login", login)
authRouter.post("/refresh", refreshToken)
authRouter.post("/logout", logout)
