FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files first (for caching)
COPY package*.json ./

# Install deps
RUN npm install --production

# Copy rest of app
COPY . .

# Expose port
EXPOSE 3000

# Run server
CMD ["node", "server.js"]
