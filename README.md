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
- `bun run start`: Start the client using the built production assets.

### Database Scripts

These scripts manage the SQLite database via Drizzle ORM:

- `bun run db:generate`: Generate Drizzle database migrations.
- `bun run db:push`: Apply the Drizzle schema directly to the database.
- `bun run db:studio`: Launch Drizzle Studio to inspect the database visually.
- `bun run db:seed`: Seed the database with initial data.
- `bun run db:reset`: Delete the local database, recreate it, and run the seeder.
