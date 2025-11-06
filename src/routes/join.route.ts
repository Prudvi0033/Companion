import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.middleware";
import { joinEvent, leaveEvent } from "../controllers/join.controller";

const joinRouter = new Hono()

joinRouter.use("*", authMiddleware)

joinRouter.post("/:id", joinEvent)
joinRouter.delete("/:id", leaveEvent)

export default joinRouter