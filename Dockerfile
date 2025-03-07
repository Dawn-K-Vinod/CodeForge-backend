# Use an official Node.js runtime as the base image
FROM node:16

# Install GCC and other necessary dependencies
RUN apt-get update && apt-get install -y gcc

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
