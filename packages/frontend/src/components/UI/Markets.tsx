/**
 * Coal and Iron markets display
 */

import { ResourceMarket } from '@brass/shared';

interface MarketsProps {
  coalMarket: ResourceMarket;
  ironMarket: ResourceMarket;
}

export function Markets({ coalMarket, ironMarket }: MarketsProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border-2 border-gray-700">
      <h3 className="text-lg font-bold text-amber-500 mb-3">Markets</h3>

      {/* Coal Market */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span className="w-4 h-4 bg-black rounded"></span>
          Coal Market
        </h4>
        <div className="flex gap-1 flex-wrap">
          {coalMarket.spaces.map((space, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-600 rounded p-2 min-w-[60px]"
            >
              <div className="text-xs text-gray-400">£{space.price}</div>
              <div className="text-lg font-bold text-white">
                {space.count}
                <span className="text-xs text-gray-400">/{space.maxCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Iron Market */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span className="w-4 h-4 bg-orange-600 rounded"></span>
          Iron Market
        </h4>
        <div className="flex gap-1 flex-wrap">
          {ironMarket.spaces.map((space, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-600 rounded p-2 min-w-[60px]"
            >
              <div className="text-xs text-gray-400">£{space.price}</div>
              <div className="text-lg font-bold text-white">
                {space.count}
                <span className="text-xs text-gray-400">/{space.maxCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
