# Dockerfile for Production with PM2

# Stage 1: Build the application
FROM node:24 AS builder

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
 && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:24

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
 && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Install pm2 globally
RUN npm install pm2 -g

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Copy the ecosystem file
COPY ecosystem.config.js .

# Expose the port the app runs on
EXPOSE 3000

# Command to start the server with pm2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]