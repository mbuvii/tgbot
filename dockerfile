# Use the official Node.js image as the base
FROM node:22.11.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Command to run the bot
CMD ["node", "index.js"]
