# =============================================================================
# Oke Mekanik SaaS - Docker Deployment
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx vite build

# ── Production Image ─────────────────────────────────────────────────────
FROM node:22-alpine

LABEL maintainer="Mulky Malikul Dhaher <mulkymalikuldhaher@email.com>"
LABEL description="Oke Mekanik — Mobile Mechanic Service SaaS Platform"

WORKDIR /app

# Copy package files and install production deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy server code
COPY server/ ./server/

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Non-root user
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
USER appuser

# Start server
CMD ["node", "server/index.js"]
