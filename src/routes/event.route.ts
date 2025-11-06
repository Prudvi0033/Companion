import { Hono } from "hono";
import { createEvent, deleteEvent, editEvent, getAllEvents, getEvent, relavantEvents } from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const eventRouter = new Hono()

eventRouter.use("*", authMiddleware)

eventRouter.get("/all", getAllEvents)
eventRouter.get("/relavant", relavantEvents)
eventRouter.get("/:id", getEvent)
eventRouter.post("/", createEvent)
eventRouter.post("/:id",editEvent)
eventRouter.delete("/:id", deleteEvent)


export default eventRouter