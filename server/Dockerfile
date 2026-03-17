FROM oven/bun:1-alpine
WORKDIR /app

# Copy workspace manifests first so Bun can resolve local packages deterministically
COPY package.json bun.lock ./
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json
COPY packages/api/package.json ./packages/api/package.json

# Install dependencies for the workspace
RUN bun install

# Copy the source after dependency installation for better layer caching
COPY server ./server
COPY packages/api ./packages/api

# Setup a data directory for the SQLite database so it can be safely mounted as a volume
RUN mkdir -p /app/data
WORKDIR /app/server
RUN rm -f local.db && ln -sf /app/data/local.db local.db

EXPOSE 3000
CMD ["bun", "run", "start:deploy"]
