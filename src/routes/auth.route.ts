import { Hono } from "hono";
import { login, logout, signUp } from "../controllers/auth.controller";

export const authRouter = new Hono()

authRouter.post("/sign-up", signUp)
authRouter.post("login", login)
authRouter.post("/logout", logout)
