/**
 * Player hand component displaying cards
 */

import { GameCard } from '@brass/shared';
import { Card } from '../UI/Card';

interface PlayerHandProps {
  cards: GameCard[];
  selectedCard: GameCard | null;
  onSelectCard: (card: GameCard) => void;
  disabled?: boolean;
}

export function PlayerHand({ cards, selectedCard, onSelectCard, disabled }: PlayerHandProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border-2 border-gray-700">
      <h3 className="text-lg font-bold text-amber-500 mb-3">Your Hand ({cards.length} cards)</h3>

      <div className="flex gap-2 flex-wrap justify-center">
        {cards.length === 0 ? (
          <p className="text-gray-500 italic">No cards in hand</p>
        ) : (
          cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              selected={selectedCard?.id === card.id}
              onClick={() => onSelectCard(card)}
              disabled={disabled}
            />
          ))
        )}
      </div>

      {selectedCard && (
        <div className="mt-3 text-sm text-gray-400 text-center">
          Selected: {selectedCard.type}
        </div>
      )}
    </div>
  );
}
