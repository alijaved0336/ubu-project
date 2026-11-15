# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Bundle the app source inside the Docker container
COPY . .

# Change ownership of the project files to the node user
RUN chown -R node:node /usr/src/app

# Build the app
RUN npm run build

EXPOSE 4173

# Use the non-root user to avoid permission issues
USER node

# Define the command to run your app
CMD ["npm", "run", "preview"]