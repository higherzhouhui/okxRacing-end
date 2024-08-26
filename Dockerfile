# Use an official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Rebuild the bcrypt library inside the Docker container
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the application will listen on
EXPOSE 5000

# Set the environment variables for the MySQL connection
ENV DB_HOST=backend-system
ENV DB_PORT=3308
ENV DB_USERNAME=root
ENV DB_PASSWORD=Aman@1504
ENV DB_NAME=backend-system

# Start the Node.js application
CMD ["node", "index.js"]