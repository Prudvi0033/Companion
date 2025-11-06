import { Hono } from "hono"
import { authRouter } from "./auth.route"
import eventRouter from "./event.route"

const globalRouter = new Hono()

globalRouter.route("/auth", authRouter)
globalRouter.route("/event", eventRouter)

export default globalRouter