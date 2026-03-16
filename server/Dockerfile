FROM oven/bun:1-alpine
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN bun install

# Setup a data directory for the SQLite database so it can be safely mounted as a volume
RUN mkdir -p /app/data
WORKDIR /app/server
RUN rm -f local.db && ln -sf /app/data/local.db local.db

EXPOSE 3000
CMD ["bun", "run", "start"]
