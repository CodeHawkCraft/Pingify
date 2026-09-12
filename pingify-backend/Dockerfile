FROM node:22-slim

WORKDIR /app

COPY package*.json ./
# ponytail: devDeps kept — `npm run migrate:latest` needs tsx at runtime.
# Prune them (and precompile the knexfile) only if image size starts mattering.
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["sh", "-c", "npm run migrate:latest && npm start"]
