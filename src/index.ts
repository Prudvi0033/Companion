import { Hono } from "hono";

const app = new Hono()

app.get("/health", (c) => {
    return Response.json(Date.now())
})

Bun.serve({
    port: process.env.PORT || 3030,
    fetch: app.fetch
})