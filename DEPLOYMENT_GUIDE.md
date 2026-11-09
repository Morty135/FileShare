# FileShare Deployment Guide

This guide explains how to deploy the FileShare application using Docker and prepare it for Cloudflare integration.

## Prerequisites

- Docker and Docker Compose installed
- Basic understanding of containerization
- MongoDB access (will be provided via Docker Compose)

## Quick Start

1. Clone or download the repository
2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```
3. Access the application at `http://localhost`

## Docker Deployment

For a simplified single container deployment (as requested for Cloudflare):

```bash
# Build the Docker image
docker build -t fileshare-app .

# Run the container (assuming MongoDB is available at mongodb://mongodb:27017/FileShare)
docker run -p 3000:3000 --env-file .env fileshare-app
```

This approach allows the application to run as a single container that can be deployed to Cloudflare Workers or any container hosting platform.

### Environment Configuration

The application uses environment variables defined in `.env`:
- `DATABASE_URL`: MongoDB connection string
- `PORT`: Application port (default: 3000)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 100MB)
- `UPLOAD_PATH`: Path for file storage (default: `uploads`)

## Cloudflare Integration

For deploying with Cloudflare, consider these recommendations:

### 1. Container Deployment
```bash
# Build the Docker image
docker build -t fileshare-app .

# Push to your container registry
docker tag fileshare-app your-registry/fileshare-app
docker push your-registry/fileshare-app
```

### 2. Cloudflare Workers for API Routing
Use a Cloudflare Worker to route requests to your backend:
- Route `/upload` to your upload endpoint
- Route `/file/:id` to your download endpoint
- Handle CORS headers properly
- Configure appropriate request/response sizes (at least 1GB)

### 3. Cloudflare R2 for Large Files
For better large file handling:
- Store files in Cloudflare R2 instead of local storage
- Use Cloudflare's CDN for faster downloads
- Implement proper caching strategies

### 4. Configuration for Cloudflare
- Set appropriate request body sizes in your reverse proxy or Worker configuration (at least 1GB)
- Configure proper CORS settings
- Implement rate limiting
- Set up health checks for automatic monitoring
- Use Cloudflare's built-in features like automatic compression and caching

### 5. Worker Configuration Example
When creating your Cloudflare Worker, make sure to set:
- bodySize: 1073741824 bytes (1GB)
- responseSize: 1073741824 bytes (1GB)

## Production Considerations

### Security
- Change the default session secret in `.env`
- Implement proper authentication if needed
- Set up HTTPS with Cloudflare SSL/TLS
- Configure proper firewall rules

### Performance
- Use Cloudflare Workers for API routing
- Implement CDN for static assets
- Configure appropriate caching headers
- Consider using Cloudflare R2 for object storage

### Monitoring
- Use the `/health` endpoint for monitoring
- Implement proper logging
- Set up error tracking
- Monitor file storage usage

## File Size Limitations

The application now supports up to 1GB files by default but can be increased:
1. Update `MAX_FILE_SIZE` in `.env` to desired limit (in bytes)
2. Configure Cloudflare Workers with appropriate request/response size limits
3. Consider using Cloudflare R2 for better large file handling

For Cloudflare deployment, the Worker configuration must allow:
- Request body size up to 1GB (1073741824 bytes)
- Response size up to 1GB (1073741824 bytes)

The default setting is now 1GB (1073741824 bytes) to support larger file sharing, but can be adjusted based on your requirements.

## Troubleshooting

### Common Issues
1. **Port conflicts**: Make sure port 80/3000 is available
2. **MongoDB connection**: Check database URL in `.env`
3. **File permissions**: Ensure proper permissions for upload directory
4. **Memory issues**: Adjust Docker memory limits if needed

### Debugging
```bash
# Check container status
docker-compose ps

# View application logs
docker-compose logs app

# View database logs
docker-compose logs mongodb
```

## Maintenance

### Cleanup
The application automatically cleans up files older than 4 hours. You can modify this in `src/server.js`.

### Backup
Regularly backup your MongoDB database and file storage directory.

### Updates
To update the application:
1. Pull latest changes
2. Rebuild containers: `docker-compose build`
3. Restart services: `docker-compose up -d`