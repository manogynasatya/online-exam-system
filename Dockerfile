# Build stage
FROM node:18 AS build

WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install dependencies in the container (Linux environment)
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
