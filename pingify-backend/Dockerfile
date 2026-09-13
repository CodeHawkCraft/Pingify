# ==========================================
# STAGE 1: Build Environment
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies like typescript)
RUN npm ci

# Copy the rest of your application source code
COPY . .

# Compile TypeScript to JavaScript (usually outputs to a /dist or /build folder)
RUN npm run build

# ==========================================
# STAGE 2: Production Environment
# ==========================================
FROM node:20-alpine AS runner

# Set production environment variable
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package files to install production-only dependencies
COPY package*.json ./

# Install ONLY production dependencies to keep the image slim
RUN npm ci --only=production

# Copy compiled JavaScript from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Use the non-root 'node' user provided by the alpine image for security
USER node

# Expose your backend API port (adjust to match your application configuration)
EXPOSE 3000

# Run the compiled JavaScript entry point directly with Node
CMD ["node", "dist/index.js"]
