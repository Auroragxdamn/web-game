# Client Application

The frontend portion of the web game, built using [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/).

## Getting Started

Because this is part of a monorepo, you can manage the client from the root directory or directly inside this `client` directory. 

Ensure dependencies are installed from the root:
```bash
bun install
```

## Available Scripts

From the `client` directory, you can run:

- `bun run dev`: Start the Vite development server.
- `bun run build`: Compile TypeScript and build the React app for production.
- `bun run preview`: Locally preview the production build.
- `bun run lint`: Run ESLint to catch issues.

*(Alternatively, run `bun run client` or `bun run build` from the monorepo root).*

## UI Components & Styling

- **Styling**: Uses Tailwind CSS v4. Standard utility classes applies.
- **Components**: Uses `shadcn/ui`. When generating new components, make sure you are in the `client` directory (e.g., `cd client && bunx --bun shadcn@latest add ...`). Component code will be generated inside `src/components/ui`.
