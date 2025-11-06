import { Hono } from "hono"
import { authRouter } from "./auth.route"

const globalRouter = new Hono()

globalRouter.route("/auth", authRouter)

export default globalRouter