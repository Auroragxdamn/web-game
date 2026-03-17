import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { api } from "./routes/api";
import { spotifyRoutes } from "./routes/spotify";

const port = Number(Bun.env.PORT ?? 3000);
const hostname = Bun.env.HOST ?? "0.0.0.0";
const clientAppUrl = Bun.env.CLIENT_APP_URL ?? "http://localhost:5173";

const app = new Elysia()
  .use(
    cors({
      origin: clientAppUrl,
      credentials: true,
    }),
  )
  .use(api)
  .use(spotifyRoutes)
  .get("/ping", () => "pong")
  .listen({
    port,
    hostname,
  });

export type App = typeof app;

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
