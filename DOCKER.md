# Docker Configuration

This Next.js application is configured with optimized Docker images for both development and production environments.

## Files

- `Dockerfile` - Production image with PM2 clustering
- `Dockerfile.dev` - Development image with hot reloading
- `ecosystem.config.js` - PM2 configuration for production
- `ecosystem.standalone.config.js` - Alternative PM2 config for standalone builds
- `.dockerignore` - Excludes unnecessary files from Docker context

## Key Features

### Production Image (`Dockerfile`)
- **Multi-stage build** for optimized image size
- **Alpine Linux** base for security and smaller footprint
- **Non-root user** (`nextjs`) for security
- **PM2 clustering** for scalability
- **Health checks** via `/api/health` endpoint
- **Signal handling** with dumb-init

### Development Image (`Dockerfile.dev`)
- **Hot reloading** support
- **Non-root user** for security
- **Volume mounting** friendly
- **Development optimizations**

## Build Commands

### Development
```bash
docker build -f Dockerfile.dev -t banknbook:dev .
```

### Production
```bash
docker build -f Dockerfile -t banknbook:prod .
```

## Run Commands

### Development
```bash
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules banknbook:dev
```

### Production
```bash
docker run -p 3000:3000 banknbook:prod
```

## Environment Variables

- `NODE_ENV` - Set to `production` or `development`
- `PORT` - Application port (default: 3000)
- `HOSTNAME` - Bind address (default: 0.0.0.0)
- `NEXT_TELEMETRY_DISABLED` - Disable Next.js telemetry

## Health Check

The application includes a health check endpoint at `/api/health` that returns application status and metrics.

## Security Features

- Non-root user execution
- Minimal Alpine Linux base image
- Proper file permissions
- Signal handling for graceful shutdowns

## Notes

- Uses `package.json` for dependency management
- Optimized for parent container deployment
- Includes comprehensive `.dockerignore` for efficiency
- Production image includes PM2 for process management and clustering
