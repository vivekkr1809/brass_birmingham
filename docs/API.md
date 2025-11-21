# Brass Birmingham API Documentation

## Base URL

```
http://localhost:3001/api
```

## Endpoints

### Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-21T10:30:00.000Z"
}
```

---

### Create Game

**POST** `/api/games`

Create a new game instance.

**Request Body:**
```json
{
  "playerCount": 2,
  "playerIds": ["player1", "player2"]
}
```

**Parameters:**
- `playerCount` (number): Number of players (2-4)
- `playerIds` (string[]): Array of player IDs (must match playerCount)

**Response:** (201 Created)
```json
{
  "gameId": "abc123",
  "phase": "playing",
  "currentEra": "canal",
  "currentRound": 1,
  "maxRounds": 10,
  "currentPlayerId": "player1",
  "playerCount": 2,
  "players": [
    {
      "playerId": "player1",
      "money": 17,
      "income": 10,
      "victoryPoints": 0,
      "handSize": 8,
      "linkTilesRemaining": 14,
      "actionsRemaining": 1,
      "hasPassed": false
    }
  ]
}
```

---

### List Games

**GET** `/api/games`

Get a list of all active games.

**Response:**
```json
[
  {
    "gameId": "abc123",
    "phase": "playing",
    "currentEra": "canal",
    "currentRound": 1,
    "maxRounds": 10,
    "currentPlayerId": "player1",
    "playerCount": 2,
    "players": [...]
  }
]
```

---

### Get Game

**GET** `/api/games/:gameId`

Get game summary by ID.

**Response:**
```json
{
  "gameId": "abc123",
  "phase": "playing",
  "currentEra": "canal",
  "currentRound": 1,
  "maxRounds": 10,
  "currentPlayerId": "player1",
  "playerCount": 2,
  "players": [...]
}
```

---

### Get Full Game State

**GET** `/api/games/:gameId/state`

Get complete game state (for debugging).

**Response:**
```json
{
  "gameId": "abc123",
  "phase": "playing",
  "currentEra": "canal",
  "currentRound": 1,
  "players": [...],
  "board": {
    "locations": {...},
    "connections": [...],
    "merchants": [...],
    "coalMarket": {...},
    "ironMarket": {...}
  },
  "placedIndustries": {...},
  "cardDeck": {...}
}
```

---

### Execute Action

**POST** `/api/games/:gameId/actions`

Execute a game action.

**Request Body Examples:**

#### Build Action
```json
{
  "type": "build",
  "playerId": "player1",
  "cardUsed": {
    "id": "card123",
    "type": "location",
    "location": "BIRMINGHAM"
  },
  "location": "BIRMINGHAM",
  "industryType": "manufacturer",
  "tileId": "tile123",
  "coalSources": [
    {
      "type": "tile",
      "tileId": "coalmine1",
      "cost": 0
    }
  ],
  "ironSources": [
    {
      "type": "market",
      "cost": 3
    }
  ]
}
```

#### Network Action
```json
{
  "type": "network",
  "playerId": "player1",
  "cardUsed": {
    "id": "card123",
    "type": "location",
    "location": "BIRMINGHAM"
  },
  "connections": [
    {
      "from": "BIRMINGHAM",
      "to": "COVENTRY",
      "linkType": "canal"
    }
  ]
}
```

#### Sell Action
```json
{
  "type": "sell",
  "playerId": "player1",
  "cardUsed": {
    "id": "card123",
    "type": "location",
    "location": "BIRMINGHAM"
  },
  "sales": [
    {
      "tileId": "tile123",
      "merchantId": "merchant1",
      "beerSource": {
        "type": "tile",
        "tileId": "brewery1",
        "cost": 0
      }
    }
  ]
}
```

#### Develop Action
```json
{
  "type": "develop",
  "playerId": "player1",
  "cardUsed": {
    "id": "card123",
    "type": "location",
    "location": "BIRMINGHAM"
  },
  "tileIds": ["tile123", "tile456"],
  "ironSources": [
    {
      "type": "market",
      "cost": 2
    },
    {
      "type": "market",
      "cost": 2
    }
  ]
}
```

#### Loan Action
```json
{
  "type": "loan",
  "playerId": "player1",
  "cardUsed": {
    "id": "card123",
    "type": "location",
    "location": "BIRMINGHAM"
  }
}
```

#### Scout Action
```json
{
  "type": "scout",
  "playerId": "player1",
  "cardUsed": {
    "id": "card123",
    "type": "location",
    "location": "BIRMINGHAM"
  },
  "additionalCardsDiscarded": [
    {
      "id": "card456",
      "type": "industry",
      "industryType": "cotton_mill"
    },
    {
      "id": "card789",
      "type": "location",
      "location": "DERBY"
    }
  ]
}
```

#### Pass Action
```json
{
  "type": "pass",
  "playerId": "player1",
  "cardUsed": {
    "id": "card123",
    "type": "location",
    "location": "BIRMINGHAM"
  }
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "errors": [],
  "stateChanges": [
    {
      "type": "money",
      "playerId": "player1",
      "details": {
        "amount": -12,
        "newTotal": 5
      }
    },
    {
      "type": "tile_placed",
      "playerId": "player1",
      "details": {
        "tileId": "tile123",
        "location": "BIRMINGHAM",
        "industryType": "manufacturer"
      }
    }
  ]
}
```

**Error Response:** (400 Bad Request)
```json
{
  "success": false,
  "errors": [
    "Not enough money (need £12, have £5)",
    "Location not in player network"
  ],
  "stateChanges": []
}
```

---

### Validate Action

**POST** `/api/games/:gameId/actions/validate`

Validate an action without executing it.

**Request Body:** Same as Execute Action

**Response:**
```json
{
  "valid": true,
  "errors": []
}
```

Or if invalid:
```json
{
  "valid": false,
  "errors": [
    "Not enough money",
    "Card not in hand"
  ]
}
```

---

### Delete Game

**DELETE** `/api/games/:gameId`

Delete a game.

**Response:** (204 No Content)

---

## WebSocket Events

### Connect

Connect to the WebSocket server at `ws://localhost:3001`

### Events to Emit

#### `game:join`
Join a game room to receive real-time updates.

```javascript
socket.emit('game:join', 'gameId123');
```

#### `game:leave`
Leave a game room.

```javascript
socket.emit('game:leave', 'gameId123');
```

### Events to Listen

#### `game:joined`
Confirmation that you've joined a game room.

```javascript
socket.on('game:joined', (data) => {
  console.log('Joined game:', data.gameId);
});
```

#### `game:state`
Receive game state updates.

```javascript
socket.on('game:state', (gameState) => {
  console.log('Game updated:', gameState);
});
```

#### `error`
Receive error messages.

```javascript
socket.on('error', (error) => {
  console.error('Error:', error.message);
});
```

---

## Error Codes

- `400` - Bad Request (invalid action, validation failed)
- `404` - Not Found (game not found)
- `500` - Internal Server Error

---

## Example Usage

### Create and Play a Game

```javascript
// 1. Create game
const response = await fetch('http://localhost:3001/api/games', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    playerCount: 2,
    playerIds: ['alice', 'bob']
  })
});
const game = await response.json();

// 2. Execute build action
await fetch(`http://localhost:3001/api/games/${game.gameId}/actions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'build',
    playerId: 'alice',
    cardUsed: { id: 'card1', type: 'location', location: 'BIRMINGHAM' },
    location: 'BIRMINGHAM',
    industryType: 'manufacturer',
    tileId: 'tile1',
    coalSources: [],
    ironSources: []
  })
});

// 3. Get updated game state
const stateResponse = await fetch(`http://localhost:3001/api/games/${game.gameId}`);
const updatedGame = await stateResponse.json();
```

---

## Rate Limits

Currently no rate limits enforced (development).

## Authentication

Currently no authentication required (development).

For production, add JWT authentication to all endpoints.
