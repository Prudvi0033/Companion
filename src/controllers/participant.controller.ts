import type { Context } from "hono";
import { prisma } from "../lib/prisma";

export const getParticipants = async (c: Context) => {
  try {
    const userId = c.get('userId')
    const eventId = c.req.param('id')

    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    })

    if(!event){
        return c.json({
            msg: "No event found"
        })
    }

    const participants = await prisma.participant.findMany({
        where: {
            eventId: eventId
        },
        include: {
            user: true,
            _count: true
        }
    })

    return c.json({
        msg: "Event users",
        participants
    })
  } catch (error) {
    console.log("Error in getting participants", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

export const removeParticipant = async (c: Context) => {
  try {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ msg: "Unauthorized" }, 401);
    }

    const eventId = c.req.param('id');
    if (!eventId) {
      return c.json({ msg: "Event ID is required" }, 400);
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return c.json({ msg: "No event found" }, 404);
    }

    if (event.userId !== userId) {
      return c.json({ msg: "Not authorized" }, 403);
    }

    const participant = await prisma.participant.findFirst({
      where: { eventId, userId },
    });

    if (!participant) {
      return c.json({ msg: "Participant not found" }, 404);
    }

    await prisma.participant.delete({
      where: { id: participant.id },
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { availableSlots: event.availableSlots + 1 },
    });

    return c.json({ msg: "Participant removed successfully" });
  } catch (error) {
    console.log("Error in removing participant", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

