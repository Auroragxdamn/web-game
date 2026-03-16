# Stage 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app

# 1. Copy everything
COPY . .

# 2. Install all dependencies
RUN bun install

# 3. Build the client
WORKDIR /app/client
RUN bun run build

# Stage 2: Serve
FROM nginx:alpine

# CHANGE: Pointing to /app/dist instead of /app/client/dist
COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]