# Quick Start Guide

## Getting the Project Running

### Prerequisites

Make sure you have these installed:
- Node.js 20 or higher
- pnpm 8 or higher
- Docker and Docker Compose

### Step 1: Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all packages in the monorepo.

### Step 2: Start Development Databases

```bash
docker-compose up -d
```

This starts PostgreSQL and Redis containers in the background.

### Step 3: Set Up Environment Variables

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env

# Frontend
cp packages/frontend/.env.example packages/frontend/.env
```

The default values should work for local development.

### Step 4: Start Development Servers

```bash
pnpm dev
```

This command starts both the backend and frontend servers:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## What You'll See

When you open http://localhost:5173, you'll see:
- A landing page with "Brass Birmingham" title
- Options to create or join a game
- Basic routing structure

## Project Structure Quick Reference

```
brass-birmingham/
├── packages/
│   ├── shared/          # Game types, constants, logic
│   ├── backend/         # Express + Socket.io server
│   └── frontend/        # React app
├── docker-compose.yml   # Database containers
└── package.json         # Workspace root
```

## Common Commands

```bash
# Development
pnpm dev                 # Start everything
pnpm dev:backend         # Backend only
pnpm dev:frontend        # Frontend only

# Building
pnpm build               # Build all packages

# Testing
pnpm test                # Run all tests
pnpm test:watch          # Watch mode

# Code Quality
pnpm lint                # Check linting
pnpm format              # Format code
pnpm typecheck           # Type check
```

## Stopping Services

```bash
# Stop development servers
# Press Ctrl+C in the terminal

# Stop Docker containers
docker-compose down
```

## Troubleshooting

### Port Already in Use

If you see port conflict errors:

```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Docker Issues

If Docker containers aren't starting:

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs

# Restart containers
docker-compose restart
```

### Module Not Found Errors

If you see module resolution errors:

```bash
# Clean everything and reinstall
pnpm clean
rm -rf node_modules packages/*/node_modules
pnpm install
```

## What's Implemented

✅ **Types & Data Structures**
- All game entities (players, tiles, cards, board)
- Complete type safety with TypeScript
- Board data with 31 locations
- All 6 industry types with proper stats

✅ **Development Infrastructure**
- Hot module reload for fast development
- Docker containers for databases
- Monorepo with proper workspace setup
- Linting and formatting configured

✅ **Basic UI**
- Landing page
- Routing structure
- TailwindCSS styling
- Responsive layout

✅ **Backend Server**
- Express API server
- Socket.io for real-time
- Error handling
- Environment configuration

## Next Steps

The foundation is complete! Here's what needs to be built next:

1. **Game Engine**
   - Game initialization logic
   - Action validation
   - State management

2. **Board UI**
   - Interactive game board
   - Tile and link visualization
   - Player information display

3. **Multiplayer**
   - Lobby system
   - Game rooms
   - Real-time synchronization

Check `docs/PROGRESS.md` for detailed implementation status.

## Getting Help

- See `docs/DEVELOPMENT.md` for detailed development guide
- Check `docs/PROGRESS.md` for implementation roadmap
- Read the code comments in `packages/shared/src/types/` for game rules

## Architecture Overview

```
Frontend (React)
    ↓ HTTP/Socket.io
Backend (Express)
    ↓ SQL
PostgreSQL (Game State)

Backend
    ↓ Cache
Redis (Sessions)
```

All game logic types are shared between frontend and backend via the `@brass/shared` package.

Happy coding! 🚂
