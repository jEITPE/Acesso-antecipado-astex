FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose the port
ENV PORT=3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "preview"]
