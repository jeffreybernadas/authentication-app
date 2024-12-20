# Development Stage
FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ && npm ci

COPY . .

CMD ["npm", "run", "dev"]

# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ && npm ci 

COPY . .

RUN npm run build

# Production Stage with Nginx
FROM nginx:alpine AS production

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]