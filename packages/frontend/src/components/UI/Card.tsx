/**
 * Card component for displaying game cards
 */

import { GameCard, isLocationCard, isIndustryCard, isWildCard } from '@brass/shared';
import clsx from 'clsx';

interface CardProps {
  card: GameCard;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function Card({ card, selected, onClick, disabled, size = 'medium' }: CardProps) {
  const isLocation = isLocationCard(card);
  const isIndustry = isIndustryCard(card);
  const isWild = isWildCard(card);

  const sizeClasses = {
    small: 'w-16 h-24 text-xs',
    medium: 'w-24 h-36 text-sm',
    large: 'w-32 h-48 text-base',
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={clsx(
        'rounded-lg border-2 p-2 flex flex-col justify-between transition-all cursor-pointer',
        sizeClasses[size],
        {
          'border-amber-500 bg-amber-50 shadow-lg scale-105': selected,
          'border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-gray-500': !selected,
          'opacity-50 cursor-not-allowed': disabled,
        }
      )}
    >
      {/* Card type indicator */}
      <div className="text-center font-bold">
        {isWild && <span className="text-amber-400">★ WILD ★</span>}
        {isLocation && <span className="text-blue-400">LOCATION</span>}
        {isIndustry && <span className="text-green-400">INDUSTRY</span>}
      </div>

      {/* Card content */}
      <div className="flex-1 flex items-center justify-center text-center">
        {isLocation && (
          <div>
            <div className="font-semibold text-white">
              {card.location.replace(/_/g, ' ')}
            </div>
          </div>
        )}

        {isIndustry && (
          <div>
            <div className="font-semibold text-white capitalize">
              {card.industryType.replace(/_/g, ' ')}
            </div>
          </div>
        )}

        {isWild && (
          <div className="text-2xl">
            {card.type === 'wild_location' ? '📍' : '🏭'}
          </div>
        )}
      </div>

      {/* Player count indicator */}
      {!isWild && 'minPlayerCount' in card && card.minPlayerCount > 2 && (
        <div className="text-xs text-center text-gray-400">
          {card.minPlayerCount}+ players
        </div>
      )}
    </div>
  );
}
