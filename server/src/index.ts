import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { api } from "./routes/api";

const port = Number(Bun.env.PORT ?? 3000);
const hostname = Bun.env.HOST ?? "0.0.0.0";

const app = new Elysia()
  .use(cors())
  .use(api)
  .get("/ping", () => "pong")
  .listen({
    port,
    hostname,
  });

export type App = typeof app;

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
