# Development Guide

## Prerequisites

- Node.js 20+
- pnpm 8+
- Docker and Docker Compose (optional, for databases)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd brass-birmingham
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Databases

```bash
docker-compose up -d
```

This will start PostgreSQL and Redis containers.

### 4. Configure Environment Variables

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env

# Frontend
cp packages/frontend/.env.example packages/frontend/.env
```

Edit the `.env` files if needed.

### 5. Run Development Servers

```bash
# Run everything (backend + frontend)
pnpm dev

# Or run individually
pnpm dev:backend
pnpm dev:frontend
```

The frontend will be available at `http://localhost:5173`
The backend API will be available at `http://localhost:3001`

## Project Structure

```
brass-birmingham/
├── packages/
│   ├── shared/          # Shared types, constants, and game logic
│   │   ├── src/
│   │   │   ├── types/   # TypeScript type definitions
│   │   │   ├── constants/  # Game data (board, cards, etc.)
│   │   │   └── index.ts
│   │   └── package.json
│   ├── backend/         # Express + Socket.io server
│   │   ├── src/
│   │   │   ├── routes/  # REST API routes
│   │   │   ├── services/ # Business logic
│   │   │   ├── socket/  # Socket.io handlers
│   │   │   └── index.ts
│   │   └── package.json
│   └── frontend/        # React application
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── pages/   # Page components
│       │   ├── hooks/   # Custom React hooks
│       │   ├── stores/  # Zustand stores
│       │   └── App.tsx
│       └── package.json
├── docker/              # Docker configuration
├── docs/                # Documentation
└── package.json         # Root workspace config
```

## Available Scripts

### Root Level

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Type check all packages

### Package Level

Each package has its own scripts:

```bash
# In any package directory
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm test       # Run tests
pnpm typecheck  # Type check
```

## Database Management

```bash
# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Reset database
pnpm db:reset
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Building for Production

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @brass/backend build
pnpm --filter @brass/frontend build
```

## Docker

```bash
# Build images
docker build -f Dockerfile.backend -t brass-backend .
docker build -f Dockerfile.frontend -t brass-frontend .

# Run with docker-compose
docker-compose up
```

## Debugging

### VS Code

Add this to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev:backend"],
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Common Issues

### Port Already in Use

If ports 3001 or 5173 are in use:

```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Database Connection Issues

Make sure Docker containers are running:

```bash
docker-compose ps
docker-compose logs postgres
```

### Module Resolution Issues

Clear cache and reinstall:

```bash
pnpm clean
rm -rf node_modules packages/*/node_modules
pnpm install
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## Architecture Notes

### Shared Package

The `@brass/shared` package contains:
- Type definitions for all game entities
- Game constants (board layout, card definitions, etc.)
- Pure functions for game logic
- No external dependencies (except dev tools)

### Backend Package

The backend uses:
- Express for REST API
- Socket.io for real-time updates
- PostgreSQL for persistent storage
- Redis for sessions and caching

### Frontend Package

The frontend uses:
- React 18 with hooks
- Zustand for state management
- TailwindCSS for styling
- Socket.io client for real-time updates

## Performance Tips

1. Use React DevTools Profiler to identify slow components
2. Enable Socket.io debug mode: `localStorage.debug = 'socket.io-client:*'`
3. Monitor PostgreSQL queries with `EXPLAIN ANALYZE`
4. Use Redis for caching frequently accessed data
