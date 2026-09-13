# --- Stage 1: Build the React Application ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your application code
COPY . .

# Receive the build arg from docker-compose and expose it to Vite during the build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the static production files (generates /app/dist or /app/build)
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from Stage 1 to Nginx's default public directory
# Note: Change "dist" to "build" if you are using Create React App instead of Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 inside the container
EXPOSE 80

# Start Nginx in the foreground (bydefault nginx runs in the background, but we want it to run in the foreground for Docker)
CMD ["nginx", "-g", "daemon off;"]
