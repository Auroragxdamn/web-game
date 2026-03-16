# Stage 1: Build the client (Swapped from alpine to standard debian to fix Rolldown/Rust bindings)
FROM oven/bun:1 AS builder
WORKDIR /app

# 1. Copy everything
COPY . .

# 2. Install dependencies
RUN bun install

# 3. Build the client 
RUN bun run build

# Stage 2: Serve with Nginx (Keep this as alpine so your final image is still tiny!)
FROM nginx:alpine

# 4. Copy the compiled dist folder
COPY --from=builder /app/dist /usr/share/nginx/html

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