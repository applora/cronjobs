# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuperCrawler is a distributed web crawling system built with Node.js, TypeScript, and Playwright. It uses Redis for task queue management and is designed for high-concurrency web scraping with anti-detection capabilities.

## Development Commands

### Essential Commands
```bash
# Install dependencies (also fetches Camoufox binaries)
pnpm install

# Development with hot reload
pnpm dev

# Build TypeScript to JavaScript
pnpm build

# Start production server
pnpm start
```

### Docker Commands
```bash
# Build and start all services (web + Redis)
docker-compose up -d

# View service logs
docker-compose logs -f web

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

## Architecture Overview

The project follows a modular architecture with clear separation of concerns:

### Core Components

1. **API Layer** (`src/api/`): REST API built on Hono framework
   - Lightweight, fast web framework
   - Middleware for logging and authentication
   - Currently minimal - routes are being added

2. **Crawling Engine** (`src/crawls/`): Web scraping using Crawlee
   - Playwright-based router for JavaScript-heavy sites
   - Camoufox integration for anti-detection
   - Handles the actual web scraping logic

3. **Queue Management** (`src/queue/`): Redis-based task queue
   - Manages distributed crawling tasks
   - Enables horizontal scaling
   - Currently empty - implementation pending

4. **Workers** (`src/workers/`): Background task processors
   - Processes items from the Redis queue
   - Handles crawling tasks asynchronously
   - Currently empty - implementation pending

### Key Technologies

- **Node.js + TypeScript**: Runtime with strict type checking
- **Hono**: Minimalist web framework (vs Express/Fastify)
- **Crawlee**: Professional crawling framework
- **Playwright**: Browser automation for dynamic content
- **Camoufox**: Anti-detection browser fingerprinting
- **Redis**: Task queue and data caching
- **Docker**: Containerized deployment

## Project Structure

```
src/
├── api/         # REST API endpoints and middleware
├── crawls/      # Crawling logic and route handlers
├── queue/       # Redis queue management (TODO)
├── workers/     # Background task processors (TODO)
└── index.ts     # Server entry point
```

## Development Notes

### TypeScript Configuration
- Strict mode enabled with additional type checks
- Path alias: `@/*` maps to `./src/*`
- ESNext target for modern JavaScript features
- Use `import/export` syntax (ES modules)

### Environment Variables
Create a `.env` file based on `.env.example` (if present):
- `NODE_ENV`: development/production
- `REDIS_URL`: Redis connection string
- `PORT`: Server port (default: 3000)

### Docker Development
- Multi-stage build optimizes image size
- Base image includes Playwright and Camoufox
- Version compatibility check via `check-playwright-version.mjs`
- Persistent storage in `./storage` directory

## Code Conventions

### Import Patterns
- Use absolute imports with `@/` prefix for internal modules
- External imports should be grouped separately
- Example: `import app from '@/api/index.js'`

### Module System
- Always use `.js` extensions in imports (TypeScript requirement)
- The project uses ES modules (`"type": "module"`)

### API Development with Hono
- Routes are defined using Hono's router methods
- Middleware chain processes requests before handlers
- See commented auth middleware in `src/api/index.ts` for examples

## Current Implementation Status

**Completed:**
- Project setup and tooling
- Docker configuration
- Basic server structure
- TypeScript configuration

**In Progress:**
- API routes and endpoints
- Crawling routes and logic

**TODO:**
- Redis queue implementation
- Worker processes
- Error handling and logging
- Authentication middleware
- Task result storage
- Monitoring endpoints