# Stage 1: build the React app
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Relative URL: works on localhost, LAN, and any public hostname with no rebuild.
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: nginx serves the built files and proxies /api to the backend.
# ponytail: no `vite preview` in front of users -- it is a dev server, and it
# rejects requests whose Host header it does not recognise (tunnels, domains).
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
