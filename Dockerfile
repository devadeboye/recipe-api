FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Build the app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Run the app
CMD ["node", "dist/main"]
