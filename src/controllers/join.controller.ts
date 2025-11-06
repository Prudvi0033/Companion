import type { Context } from "hono";
import { prisma } from "../lib/prisma";

export const joinEvent = async (c: Context) => {
  try {
    const userId = c.get("userId")
    const eventId = c.req.param("id")

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

    if(event.availableSlots <= 0){
        return c.json({
            msg: "No slots available"
        })
    }

    const existingParticipant = await prisma.participant.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    if(existingParticipant){
        return c.json({
            msg: "Already joined the event"
        })
    }

    const newPatcipant = await prisma.participant.create({
        data: {
            userId: userId,
            eventId: eventId
        }
    })

    await prisma.event.update({
        where:{
            id: eventId
        },
        data: {
            availableSlots: event.availableSlots - 1
        }
    })

    return c.json({
        msg: "Event Joined",
        newPatcipant
    })


  } catch (error) {
    console.log("Error in joining event", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

export const leaveEvent = async (c: Context) => {
  try {
    const userId = c.get("userId")
    const eventId = c.req.param("id")

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

    const participant = await prisma.participant.findUnique({
        where: {
            eventId_userId: {eventId, userId}
        }
    })

    if(!participant){
        return c.json({
            msg: "Participant not found"
        })
    }

    await prisma.participant.delete({
        where: {
            eventId_userId : {eventId, userId}
        }
    })

    await prisma.event.update({
        where: {
            id: eventId
        },
        data: {
            availableSlots: event.availableSlots + 1
        }
    })

    return c.json({
        msg: "Particinat Leaved the event"
    })


  } catch (error) {
    console.log("Error in leaving event", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};


