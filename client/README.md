# Client

The frontend codebase for the web game. 
Built using **React 19**, **Zustand** for state management, and **Framer Motion** for animations.

It integrates with the ElysiaJS backend using `@elysiajs/eden` for end-to-end type safety.

## Getting Started

Make sure you have installed dependencies from the root directory using `bun install`.

## Development

To run the client dev server:

```bash
bun --hot index.ts
```

*(You can also run `bun run client` or `bun run dev` from the root directory to start this automatically).*

## Build

To build the client for production, run the build script from the monorepo root:

```bash
bun run build
```
