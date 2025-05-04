# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose port (default NestJS port)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]
