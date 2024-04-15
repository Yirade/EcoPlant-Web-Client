# syntax=docker/dockerfile:1.4

# Stage 1: Set up development environment and copy package.json and package-lock.json
FROM node:lts AS setup

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Stage 2: Install dependencies
FROM setup AS dependencies

# Install dependencies
RUN npm install

# Stage 3: Copy the rest of the application code
FROM dependencies AS copy-code

# Copy the rest of the application code
COPY . .

# Stage 4: Set up development environment
FROM copy-code AS dev-envs

# Install necessary tools
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && useradd -s /bin/bash -m vscode \
    && groupadd docker \
    && usermod -aG docker vscode
