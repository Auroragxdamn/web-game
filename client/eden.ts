import { treaty } from "@elysiajs/eden";
import type { App } from "../server/src/index";

// Point the treaty client to our Elysia server running on port 3000
export const client = treaty<App>("http://localhost:3000");
