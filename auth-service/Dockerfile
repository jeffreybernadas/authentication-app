# Development Stage
FROM node:22-alpine AS development

# Define working dir in container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Set registry to npmjs registry and install dependencies
RUN npm config set registry https://registry.npmjs.org/ && npm ci

# Copy all files to container
COPY . .

# Build the application for production
RUN npm run build

# Start the application in development mode
CMD ["npm", "run", "dev"]

# Production Stage
FROM node:22-alpine AS production

# Define working dir in container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Set registry to npmjs registry and install dependencies
RUN npm config set registry https://registry.npmjs.org/ && npm ci --only=production

# Copy all files to container
COPY --from=development /app/dist ./dist

# Start the application in production mode
CMD ["node", "dist/index.js"]
