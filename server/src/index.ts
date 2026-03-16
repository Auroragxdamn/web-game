import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { api } from "./routes/api";

const app = new Elysia()
  .use(cors())
  .use(api)
  .get("/ping", () => "pong 🏓")
  .listen(3000);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
