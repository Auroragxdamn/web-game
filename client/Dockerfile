FROM oven/bun:1-alpine AS builder
WORKDIR /app

# 1. Copy ONLY package files and lockfile first
COPY package.json bun.lockb ./
COPY client/package.json ./client/
# Note: If you have a shared workspace (like packages/ui), copy its package.json here too:
# COPY packages/ui/package.json ./packages/ui/

# 2. Run a clean install
RUN bun install

# 3. NOW copy the rest of your source code
COPY . .

# 4. Build the client
RUN bun run --cwd client build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]