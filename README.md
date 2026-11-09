# FileShare

A file sharing service that allows users to upload and share files via links.

## Features
- Upload files via web interface
- Share files via generated download links
- Automatic cleanup of old files (older than 4 hours)
- File size limits to prevent abuse
- MongoDB database for file metadata
- Responsive web interface
- Y2K Chaotic Aesthetic Design
- 1GB file sharing support

## Architecture
- **Frontend**: Simple HTML/CSS/JavaScript interface with chaotic Y2K design
- **Backend**: Node.js/Express server
- **Database**: MongoDB for file metadata
- **File Storage**: Local disk storage (in uploads directory)

## Deployment Options

### Docker Deployment
To run with Docker (simplified single container):
```bash
# Build the Docker image
docker build -t fileshare-app .

# Run the container (assuming MongoDB is available at mongodb://mongodb:27017/FileShare)
docker run -p 3000:3000 --env-file .env fileshare-app
```

### Node.js Test Version (No Docker Required)
To run the application directly with Node.js without Docker:
```bash
# Install dependencies
npm install

# Start the server
npm start

# Or directly with Node
node test-node.js
```

### Cloudflare Deployment
To deploy with Cloudflare:
1. Build the Docker image: `docker build -t fileshare-app .`
2. Push to your container registry
3. Configure Cloudflare Workers for routing
4. Set up Cloudflare R2 for better large file handling

## Configuration

### Environment Variables (`.env` file)
- `DATABASE_URL`: MongoDB connection string
- `PORT`: Port to run the application (default: 3000)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 100MB)
- `UPLOAD_PATH`: Path where files are stored (default: `uploads`)

## File Size Limitations

The application now supports up to 1GB files by default. To adjust the limit:
1. Update `MAX_FILE_SIZE` in the `.env` file (in bytes)
2. Configure Cloudflare Workers with appropriate request/response size limits
3. Consider using Cloudflare R2 for better large file handling

For Cloudflare deployment, ensure your Worker configuration allows:
- Request body size up to 1GB
- Response size up to 1GB

The application uses environment variables to configure file size limits, allowing easy adjustment without code changes.

## Y2K Chaotic Aesthetic

The application features a chaotic Y2K-inspired design with:
- Animated elements and flickering effects
- Green neon color scheme
- Comic Sans MS font for authentic 2000s feel
- Grid backgrounds and floating elements
- Pulsing animations and gradients

## Cloudflare Integration

For large file sharing via Cloudflare:
1. Use Cloudflare Workers for API routing
2. Set up Cloudflare R2 for better object storage (recommended)
3. Configure proper CORS headers for file downloads
4. Set up appropriate caching for static files

## Security Notes

- The application uses a basic session secret for production use, please change it
- Files are automatically cleaned up after 4 hours
- Consider adding authentication for additional security

## Development

### Prerequisites
- Node.js 18+
- MongoDB

### Setup
```bash
npm install
npm start
```

### Environment Setup
Create a `.env` file with:
```
DATABASE_URL=mongodb://localhost:27017/FileShare
PORT=3000
```

### Docker Setup
```bash
docker-compose up --build
```

## Testing

To test the Node.js version without Docker:
1. Run `npm install` to install dependencies
2. Run `npm start` or `node test-node.js`
3. Access the application at `http://localhost:3000`

The test version provides the same functionality as the Docker version but runs directly in Node.js without requiring Docker containers.

## License

ISC License