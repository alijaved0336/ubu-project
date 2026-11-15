# Specify target platform as a build argument
ARG TARGETPLATFORM=linux/arm64

# Use a Node.js Alpine image for the build stage
FROM --platform=$TARGETPLATFORM node:21.5.0-alpine3.19 AS build

# Set working directory
WORKDIR /app

# Install dependencies for building native modules
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy dependency files
COPY package.json yarn.lock ./

# Install dependencies and ensure correct binaries for the target platform
RUN yarn install --frozen-lockfile && \
  yarn cache clean

# Copy the application source code
COPY . .

# Build the application
RUN yarn build

# Production stage with a smaller image
FROM --platform=$TARGETPLATFORM node:21.5.0-alpine3.19

# Set working directory
WORKDIR /app

# Install runtime dependencies for compatibility
RUN apk add --no-cache libc6-compat python3 make g++

# Copy dependencies and build output from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/tsconfig.json ./tsconfig.json

# Copy environment files
COPY .env.production.enc .env.production.enc
COPY .env.staging.enc .env.staging.enc

# Expose the application port
EXPOSE 3001

# Start the production server
CMD ["/bin/sh", "-c", "yarn start:${NODE_ENV:-staging}"]
