# --------------------
# Build stage
# --------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build


# --------------------
# Production stage
# --------------------
FROM node:20-alpine

WORKDIR /app

# Create non-root user & group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Change ownership of app files
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/index.js"]
