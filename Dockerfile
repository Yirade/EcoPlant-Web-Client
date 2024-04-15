# syntax=docker/dockerfile:1.4

# 1. For build React app
FROM node:lts AS development

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV CI=true
ENV PORT=3000

# Command to start the application
CMD [ "npm", "start" ]

# Additional stage for development environment setup
FROM development AS dev-envs

# Install necessary tools
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && useradd -s /bin/bash -m vscode \
    && groupadd docker \
    && usermod -aG docker vscode

# Additional stage for building the application
FROM development AS build

# Run additional build steps if necessary
# RUN npm run build
