# Stage 1: Build the client
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# 1. Copy absolutely everything from your context into the container
COPY . .

# 2. Install dependencies (Bun will automatically find your lockfile)
RUN bun install

# 3. Build the client workspace
RUN bun run --cwd client build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# 4. Copy the compiled dist folder over to Nginx
COPY --from=builder /app/client/dist /usr/share/nginx/html

# 5. BULLETPROOF NGINX CONFIG
# We create the file dynamically here so Docker never throws an "nginx.conf not found" error again.
RUN echo "server {" > /etc/nginx/conf.d/default.conf && \
    echo "    listen 80;" >> /etc/nginx/conf.d/default.conf && \
    echo "    location / {" >> /etc/nginx/conf.d/default.conf && \
    echo "        root /usr/share/nginx/html;" >> /etc/nginx/conf.d/default.conf && \
    echo "        index index.html index.htm;" >> /etc/nginx/conf.d/default.conf && \
    echo "        try_files \$uri \$uri/ /index.html;" >> /etc/nginx/conf.d/default.conf && \
    echo "    }" >> /etc/nginx/conf.d/default.conf && \
    echo "}" >> /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]