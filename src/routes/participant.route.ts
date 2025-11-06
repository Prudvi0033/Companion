import { Hono } from "hono";
import { getParticipants, removeParticipant } from "../controllers/participant.controller";

const participantRouter = new Hono()

participantRouter.get("/:id", getParticipants)
participantRouter.delete("/:id", removeParticipant)

export default participantRouter