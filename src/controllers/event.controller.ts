import type { Context } from "hono";
import { prisma } from "../lib/prisma";

export const createEvent = async (c: Context) => {
  try {
    const user = await c.get("userId");
    console.log("Token", user);
    
    const {
      name,
      description,
      eventImage,
      latitude,
      longitude,
      dateTime,
      duration,
      totalSlots,
      availableSlots,
      tags,
    } = await c.req.json();

    const event = await prisma.event.create({
      data: {
        name,
        userId: user,
        description,
        eventImage,
        latitude,
        longitude,
        dateTime,
        duration,
        totalSlots,
        availableSlots,
        tags,
      },
    });

    return c.json(
      {
        msg: "Event Created",
        event
      },
      200
    );
  } catch (error) {
    console.log("Error in event Creation", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

export const editEvent = async (c: Context) => {
  try {
    const user = c.get("userId");
    const eventId = c.req.param("id");

    const {
      name,
      description,
      eventImage,
      latitude,
      longitude,
      dateTime,
      duration,
      totalSlots,
      availableSlots,
      tags,
    } = await c.req.json();

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!existingEvent) {
      return c.json({ msg: "No event found" }, 400);
    }

    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        name,
        userId: user,
        description,
        eventImage,
        latitude,
        longitude,
        dateTime,
        duration,
        totalSlots,
        availableSlots,
        tags,
      },
    });

    return c.json({ msg: "Event updated" });
  } catch (error) {
    console.log("Error in event Creation", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

export const getEvent = async (c: Context) => {
    try {
        const eventId = c.req.param('id')
        if(!eventId){
            return c.json({
                msg: "No event id"
            }, 400)
        }
        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        })

        return c.json({
            event
        })
    } catch (error) {
        console.log("error in getting event", error);
        
    }
}

export const deleteEvent = async (c: Context) => {
  try {
    const user = c.get("userId");
    const eventId = c.req.param("id");

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!existingEvent) {
      return c.json(
        {
          msg: "Event not found",
        },
        400
      );
    }

    if (user !== existingEvent.userId) {
      return c.json({ msg: "Not authorized" }, 403);
    }

    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    return c.json("Event deleted");
  } catch (error) {
    console.log("Error in event deletion", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

export const relavantEvents = async (c: Context) => {
  try {
    const user = c.get("userId");
    const userCategories = await prisma.user.findUnique({
      where: {
        id: user,
      },
      select: {
        interests: true,
      },
    });

    const userInterests = userCategories?.interests ?? [];

    const events = await prisma.event.findMany({
      where: {
        tags: {
          hasSome: userInterests,
        },
      },
    });

    return c.json({
      events,
    });
  } catch (error) {
    console.log("Error in event Creation", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

export const getAllEvents = async (c: Context) => {
  try {
    const events = await prisma.event.findMany();
    return c.json({
      msg: "Got all the events",
      events,
    });
  } catch (error) {
    console.log("Error in event Creation", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};
