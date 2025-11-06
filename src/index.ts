import { Hono } from "hono";
import globalRouter from "./routes";

const app = new Hono()

app.get("/health", (c) => {
    return Response.json(Date.now())
})

app.route("/api", globalRouter)

Bun.serve({
    port: process.env.PORT || 3030,
    fetch: app.fetch
})