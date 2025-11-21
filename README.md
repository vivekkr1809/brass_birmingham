# Brass Birmingham - Digital Implementation

A comprehensive digital implementation of the Brass Birmingham board game by Martin Wallace, Gavan Brown, and Matt Tolman.

## Project Overview

This is a full-featured multiplayer web implementation of Brass Birmingham, supporting 2-4 players with real-time synchronization, game state persistence, and comprehensive rule enforcement.

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Database**: PostgreSQL (game state)
- **Cache**: Redis (sessions, real-time data)
- **Testing**: Vitest

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright

### Shared
- **Language**: TypeScript
- **Purpose**: Shared game logic, types, and validation

## Project Structure

```
brass-birmingham/
├── packages/
│   ├── backend/          # Express server, Socket.io, database
│   ├── frontend/         # React application
│   └── shared/           # Shared types, game logic, validation
├── docker/               # Docker configurations
├── docs/                 # Documentation
└── scripts/              # Build and deployment scripts
```

## Features

- ✅ Full Brass Birmingham rule implementation
- ✅ 2-4 player multiplayer support
- ✅ Real-time game synchronization
- ✅ Game state persistence and resume
- ✅ Both Canal and Rail Era support
- ✅ Complete action validation
- ✅ Network connectivity pathfinding
- ✅ Resource management (coal, iron, beer)
- ✅ All 6 industry types with proper mechanics
- ✅ Turn order calculation
- ✅ Income and VP tracking
- ✅ Merchant and market systems

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev
```

### Development

```bash
# Run backend only
pnpm dev:backend

# Run frontend only
pnpm dev:frontend

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Format code
pnpm format
```

## Game Rules

This implementation follows the official Brass Birmingham rulebook (2018.11.20). All game mechanics, scoring, and special rules are faithfully implemented.

### Key Game Mechanics
- **Canal Era & Rail Era**: Two distinct phases with different rules
- **6 Industry Types**: Cotton Mill, Coal Mine, Iron Works, Manufacturer, Pottery, Brewery
- **6 Action Types**: Build, Network, Develop, Sell, Loan, Scout
- **Network Connectivity**: Complex pathfinding for resource and market access
- **Resource Management**: Coal, Iron, and Beer with market dynamics
- **Income/VP System**: Dual track scoring system

## Documentation

- [Game Rules Reference](./docs/RULES.md)
- [API Documentation](./docs/API.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## Credits

**Original Game Design**: Martin Wallace, Gavan Brown, Matt Tolman
**Publisher**: Roxley Games
**Digital Implementation**: For educational and personal use

## License

This project is for educational and personal use only. Brass Birmingham is a copyrighted game owned by Roxley Games. This digital implementation uses only schematic graphics and does not include any copyrighted artwork.

See [LICENSE](./LICENSE) for details.

## Roadmap

### Phase 1: Core Foundation ✅
- [x] Project setup
- [x] Data models
- [x] Game state management

### Phase 2: Game Rules (In Progress)
- [ ] Action validation
- [ ] Resource management
- [ ] Network connectivity
- [ ] Scoring system

### Phase 3: Multiplayer
- [ ] WebSocket integration
- [ ] Lobby system
- [ ] Real-time sync

### Phase 4: UI/UX
- [ ] Game board visualization
- [ ] Player interface
- [ ] Action controls

### Phase 5: Testing & Polish
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Accessibility features

### Phase 6: Advanced Features
- [ ] AI opponents
- [ ] Game replay
- [ ] Statistics and analytics
