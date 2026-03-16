# Stage 1: Build the client
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# 1. Copy ONLY package files and lockfile first for caching
# The wildcards (*) ensure it works whether your file is named bun.lockb or bun.lock
COPY package.json bun.lockb* bun.lock* ./
COPY client/package.json ./client/

# Note: If you have a shared workspace (like packages/ui), copy its package.json here too:
# COPY packages/ui/package.json ./packages/ui/

# 2. Run a clean install at the root to link workspaces
RUN bun install

# 3. NOW copy the rest of your source code
COPY . .

# 4. Build the client
RUN bun run --cwd client build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/client/dist /usr/share/nginx/html

# COPY NGINX CONFIG:
# If your nginx.conf is inside your client folder, use this line:
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
# (If your nginx.conf is actually sitting in the root of your repo, change the above line to: COPY nginx.conf /etc/nginx/conf.d/default.conf)

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]