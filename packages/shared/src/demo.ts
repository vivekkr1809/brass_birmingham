/**
 * Demo script to test game engine
 * Run with: tsx packages/shared/src/demo.ts
 */

import { createGame, GameEngine } from './models';
import { PlayerCount, ActionType, BuildAction } from './types';

console.log('🎮 Brass Birmingham Game Engine Demo\n');

// Create a 2-player game
console.log('Creating a 2-player game...');
const game = createGame(
  { playerCount: PlayerCount.TWO },
  ['player1', 'player2']
);

console.log(`✅ Game created: ${game.gameId}`);
console.log(`   Era: ${game.currentEra}`);
console.log(`   Round: ${game.currentRound}/${game.maxRounds}`);
console.log(`   Players: ${game.players.length}`);
console.log();

// Show initial game state
console.log('📊 Initial Game State:');
game.players.forEach((player, index) => {
  console.log(`   Player ${index + 1} (${player.playerId}):`);
  console.log(`      Money: £${player.money}`);
  console.log(`      Income: ${player.income}`);
  console.log(`      VP: ${player.victoryPoints}`);
  console.log(`      Cards in hand: ${player.hand.length}`);
  console.log(`      Link tiles: ${player.linkTilesRemaining}`);
  console.log(`      Actions: ${player.actionsRemainingThisTurn}`);
  console.log();
});

// Show markets
console.log('🏪 Markets:');
console.log(`   Coal Market:`);
game.board.coalMarket.spaces.forEach((space) => {
  if (space.count > 0) {
    console.log(`      £${space.price}: ${space.count} coal`);
  }
});
console.log(`   Iron Market:`);
game.board.ironMarket.spaces.forEach((space) => {
  if (space.count > 0) {
    console.log(`      £${space.price}: ${space.count} iron`);
  }
});
console.log();

// Show player's hand
const currentPlayer = game.players[0];
console.log(`🃏 Player 1's hand:`);
currentPlayer.hand.forEach((card, index) => {
  console.log(`   ${index + 1}. ${card.type} - ${JSON.stringify(card).substring(0, 60)}...`);
});
console.log();

// Get available actions
const availableActions = GameEngine.getAvailableActions(game);
console.log(`⚡ Available actions for current player:`);
availableActions.forEach((action) => {
  console.log(`   - ${action}`);
});
console.log();

// Try to validate a build action
console.log('🔍 Testing action validation...');
const firstCard = currentPlayer.hand[0];

// Find a location where we can build
const testLocation = 'BIRMINGHAM'; // Birmingham has manufacturer slots

// Create a test build action
const buildAction: BuildAction = {
  type: ActionType.BUILD,
  playerId: currentPlayer.playerId,
  cardUsed: firstCard,
  location: testLocation as any,
  industryType: 'manufacturer' as any,
  tileId: currentPlayer.industryTiles.manufacturer[0]?.id || 'test-tile',
  coalSources: [],
  ironSources: [],
};

const validation = GameEngine.validateAction(game, buildAction);
console.log(`   Build action validation: ${validation.valid ? '✅ Valid' : '❌ Invalid'}`);
if (!validation.valid) {
  console.log(`   Errors:`);
  validation.errors.forEach((error) => {
    console.log(`      - ${error}`);
  });
}
console.log();

// Get game summary
const summary = GameEngine.getGameSummary(game);
console.log('📋 Game Summary:');
console.log(`   Game ID: ${summary.gameId}`);
console.log(`   Phase: ${summary.phase}`);
console.log(`   Era: ${summary.currentEra}`);
console.log(`   Round: ${summary.currentRound}/${summary.maxRounds}`);
console.log(`   Current Player: ${summary.currentPlayerId}`);
console.log(`   Total Players: ${summary.playerCount}`);
console.log();

console.log('✨ Demo complete! Game engine is working.\n');
