#!/bin/bash

# Simple test script to verify Docker deployment works correctly
echo "=== Testing FileShare Docker Deployment ==="

# Build the Docker image
echo "Building Docker image..."
docker build -t fileshare-app . || {
    echo "Failed to build Docker image"
    exit 1
}

# Run the container in detached mode
echo "Starting container..."
CONTAINER_ID=$(docker run -d -p 3000:3000 --env-file .env fileshare-app) || {
    echo "Failed to start container"
    exit 1
}

echo "Container started with ID: $CONTAINER_ID"

# Wait a moment for the application to start
echo "Waiting for application to start..."
sleep 5

# Test the health endpoint
echo "Testing health endpoint..."
curl -f http://localhost:3000/health || {
    echo "Health check failed"
    docker logs $CONTAINER_ID
    docker stop $CONTAINER_ID
    exit 1
}

echo "Health check passed!"

# Test basic functionality by checking if the main page loads
echo "Testing main page load..."
curl -f http://localhost:3000/ || {
    echo "Main page load failed"
    docker logs $CONTAINER_ID
    docker stop $CONTAINER_ID
    exit 1
}

echo "Main page loaded successfully!"

# Clean up
echo "Cleaning up..."
docker stop $CONTAINER_ID

echo "=== Test completed successfully ==="