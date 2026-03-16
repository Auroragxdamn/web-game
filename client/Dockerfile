FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy everything
# Install dependencies (from root to respect workspaces)
RUN bun install
# Build the client
WORKDIR /app/client
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
