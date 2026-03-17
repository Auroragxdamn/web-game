# Web Game Monorepo

A fullstack web game built using Bun, ElysiaJS, React, and Drizzle ORM.
This is a monorepo setup containing the `client` and `server` applications.

## Project Structure

- `client/`: The frontend React application (Vite, Tailwind CSS v4, shadcn/ui).
- `server/`: The backend ElysiaJS API server (SQLite, Drizzle ORM).

## Getting Started

To install all dependencies across the monorepo:

```bash
bun install
```

## Available Scripts (from Root)

- `bun run dev`: Concurrently start both client and server in development mode.
- `bun run client`: Start the client development server.
- `bun run server`: Start the server development server.
- `bun run build`: Build the client for production.
- `bun run start`: Start the server in production mode.

## Runtime Defaults

- Client dev server: `http://localhost:5173`
- API server: `http://localhost:3000`
- Override the frontend API target with `VITE_API_URL`.

## Deployment

- `docker-compose.yml` runs the client on port `80` and the API on port `3000`.
- The server persists the SQLite database in the `server-data` Docker volume.
- This layout is suitable for Dokploy as a compose-based deployment.

### Database Scripts

These scripts manage the SQLite database via Drizzle ORM:

- `bun run db:generate`: Generate Drizzle database migrations.
- `bun run db:push`: Apply the Drizzle schema directly to the database.
- `bun run db:studio`: Launch Drizzle Studio to inspect the database visually.
- `bun run db:seed`: Seed the database with initial data.
- `bun run db:reset`: Delete the local database, recreate it, and run the seeder.
