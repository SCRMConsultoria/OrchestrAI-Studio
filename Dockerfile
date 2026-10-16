# ==========================================
# OrchestrAI Studio - Production Dockerfile
# Multi-stage build for optimal performance
# ==========================================

# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* bun.lock* ./

# Install all dependencies (including devDependencies for building)
RUN npm install --frozen-lockfile || npm install

# Copy application sources
COPY . .

# Build Vite frontend into /app/dist
RUN npm run build

# Stage 2: Production runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only + tsx for running TypeScript server
COPY package.json package-lock.json* bun.lock* ./
RUN npm install --omit=dev && npm install -g tsx

# Copy built frontend assets from builder
COPY --from=builder /app/dist ./dist

# Copy backend server code and configs
COPY server.ts ./
COPY src/backend ./src/backend
COPY src/types ./src/types
COPY tsconfig.json ./

# Expose production port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the full-stack Express production server
CMD ["tsx", "server.ts"]
