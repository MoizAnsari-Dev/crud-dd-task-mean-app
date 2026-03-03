FROM node:18-alpine

WORKDIR /app

# Only copy package dependencies first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies (saves space by skipping dev dependencies)
RUN npm install --omit=dev

# Copy the rest of the backend files
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
