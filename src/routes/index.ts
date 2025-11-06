import { Hono } from "hono"
import { authRouter } from "./auth.route"
import eventRouter from "./event.route"
import joinRouter from "./join.route"

const globalRouter = new Hono()

globalRouter.route("/auth", authRouter)
globalRouter.route("/event", eventRouter)
globalRouter.route("/join", joinRouter)


export default globalRouter