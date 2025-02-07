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
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["sh", "-c", "npm run preview -- --port $PORT --host 0.0.0.0"]
