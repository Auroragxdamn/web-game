# Server

The backend of the web game, built exclusively with [ElysiaJS](https://elysiajs.com/) and [Bun](https://bun.sh/). 
It uses [Drizzle ORM](https://orm.drizzle.team/) for database management pointing to a local SQLite/libSQL setup.

## Getting Started

Dependencies are managed from the root of the monorepo, so ensure you have run `bun install` there.

## Development

To start the ElysiaJS development server with hot-module reloading:

```bash
bun run dev
```

*(You can also run `bun run server` from the root directory).*

The server will be available at `http://localhost:3000`.

In containers, the port can be overridden with the `PORT` environment variable.
Spotify credentials are read from the monorepo root `.env` during local development.

Required Spotify variables:

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/spotify/callback
CLIENT_APP_URL=http://localhost:5173
```

## Database

Drizzle queries and schema are located inside `src/db/`.
Use the `db:*` prefixed npm scripts from the monorepo root to manage schema generations, syncs, and seeding.
