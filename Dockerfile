# Use the official Node.js 16 image as the base
FROM node:16

# Install GCC
RUN apt-get update && apt-get install -y gcc

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the backend
CMD ["node", "server.js"]
