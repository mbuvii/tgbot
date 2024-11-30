# Use the official Node.js image as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install necessary packages
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (if you're using a web interface; otherwise it's not strictly necessary)
EXPOSE 3000

# Run the bot
CMD ["node", "index.js"]
