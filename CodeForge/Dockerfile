# Use the official Node.js 16 image as the base
FROM node:16

# Install GCC (required for compiling C code)
RUN apt-get update && apt-get install -y gcc

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your backend runs on
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
