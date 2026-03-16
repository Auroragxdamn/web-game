# Stage 1: Build the client with Debian (for Vite/Rolldown support)
FROM oven/bun:1 AS builder
WORKDIR /app

# 1. Copy the ENTIRE repository so Eden can read the server types
COPY . .

# 2. Install dependencies for the whole workspace
RUN bun install

# 3. Move INSIDE the client folder to run the build
WORKDIR /app/client
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# 4. Copy the compiled dist folder (Note the new path: /app/client/dist)
COPY --from=builder /app/client/dist /usr/share/nginx/html

# 5. BULLETPROOF NGINX CONFIG
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