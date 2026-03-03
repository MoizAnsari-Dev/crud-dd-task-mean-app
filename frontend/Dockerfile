# Stage 1: Build the Angular application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build the application for production
RUN npx ng build --configuration production

# Stage 2: Serve the application using lightweight Nginx
FROM nginx:alpine
# Copy built static files from Stage 1 into Nginx default html folder
COPY --from=build /app/dist/angular-15-crud /usr/share/nginx/html

# Create a minimal Nginx config to run on port 8081 and fallback to index.html for Angular routing
RUN echo 'server { listen 8081; server_name localhost; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]