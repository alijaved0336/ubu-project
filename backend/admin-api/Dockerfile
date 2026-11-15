# Specify target platform as a build argument
ARG TARGETPLATFORM=linux/arm64

# Use a Node.js image for building the application
FROM --platform=$TARGETPLATFORM node:21.5.0-alpine3.19 AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN apk add --no-cache python3 make g++ libc6-compat && \
  yarn install --force --build-from-source @sentry/profiling-node && \
  yarn cache clean 

# Copy project files and build the application
COPY . .
# Build the application if necessary

RUN yarn build

# Start a new, smaller stage
FROM --platform=$TARGETPLATFORM node:21.5.0-alpine3.19

WORKDIR /app
# Install Chromium and necessary libraries
RUN apk add --no-cache chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont

# Set environment variable for Puppeteer to skip its own Chromium download and use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install `glibc` compatibility and essential build tools
RUN apk add --no-cache libc6-compat python3 make g++

# Copy over the node_modules folder from the build stage
COPY --from=build /app/node_modules ./node_modules
# Copy over the built application from the build stage
COPY --from=build /app/dist ./dist
# Copy over the package.json file from the build stage
COPY --from=build /app/package.json ./package.json

# Copy project files (including tsconfig.json)
COPY --from=build /app/.env.production.enc ./.env.production.enc
COPY --from=build /app/.env.staging.enc ./.env.staging.enc
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/tsconfig.json ./tsconfig.json

# Expose the port
EXPOSE 3000
# Start the server
CMD ["/bin/sh", "-c", "yarn start:${NODE_ENV:-staging}"]

