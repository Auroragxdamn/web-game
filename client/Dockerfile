# Stage 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY packages/api/package.json ./packages/api/package.json

RUN bun install

COPY client ./client
COPY packages/api ./packages/api

WORKDIR /app/client
RUN bun run build

# Stage 2: Serve
FROM nginx:alpine

COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
