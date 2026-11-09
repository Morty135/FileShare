#!/bin/bash

# FileShare Deployment Script
# This script helps deploy the FileShare application using Docker or Node.js

set -e

echo "=== FileShare Deployment Script ==="

# Check if docker is installed
if command -v docker &> /dev/null; then
    echo "Docker is installed. Using Docker deployment."
    
    # Create uploads directory if it doesn't exist
    mkdir -p uploads

    # Build the Docker image
    echo "Building FileShare application..."
    docker build -t fileshare-app .

    # Run the container (assuming MongoDB is available at mongodb://mongodb:27017/FileShare)
    echo "Starting FileShare container..."
    docker run -p 3000:3000 --env-file .env fileshare-app

    echo "Application is now running:"
    echo "  - Web interface: http://localhost:3000"
    echo "  - Health check: http://localhost:3000/health"

    echo ""
    echo "To view logs:"
    echo "  docker logs -f <container-id>"

    echo ""
    echo "To stop the application:"
    echo "  docker stop <container-id>"

    echo ""
    echo "For Cloudflare deployment:"
    echo "  1. Build the image: docker build -t fileshare-app ."
    echo "  2. Push to your container registry"
    echo "  3. Configure Cloudflare Workers for routing"
    echo "  4. Set up Cloudflare R2 for better large file handling"
else
    echo "Docker not found. Using Node.js test deployment."
    echo "Make sure you have Node.js installed and run:"
    echo "  npm install"
    echo "  npm start"
    echo ""
    echo "The application will run on http://localhost:3000"
fi