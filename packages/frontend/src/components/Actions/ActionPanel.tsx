/**
 * Action selection panel
 */

import { ActionType } from '@brass/shared';
import clsx from 'clsx';

interface ActionPanelProps {
  availableActions: ActionType[];
  selectedAction: ActionType | null;
  onSelectAction: (action: ActionType) => void;
  disabled?: boolean;
}

const ACTION_INFO = {
  [ActionType.BUILD]: {
    name: 'Build',
    icon: '🏭',
    description: 'Place an industry tile',
    color: 'blue',
  },
  [ActionType.NETWORK]: {
    name: 'Network',
    icon: '🔗',
    description: 'Place link tiles',
    color: 'green',
  },
  [ActionType.SELL]: {
    name: 'Sell',
    icon: '💰',
    description: 'Sell goods to merchants',
    color: 'yellow',
  },
  [ActionType.DEVELOP]: {
    name: 'Develop',
    icon: '⚙️',
    description: 'Remove tiles from board',
    color: 'purple',
  },
  [ActionType.LOAN]: {
    name: 'Loan',
    icon: '💵',
    description: 'Take £30, lose income',
    color: 'red',
  },
  [ActionType.SCOUT]: {
    name: 'Scout',
    icon: '🔍',
    description: 'Get wild cards',
    color: 'indigo',
  },
  [ActionType.PASS]: {
    name: 'Pass',
    icon: '⏭️',
    description: 'End your turn',
    color: 'gray',
  },
};

export function ActionPanel({
  availableActions,
  selectedAction,
  onSelectAction,
  disabled,
}: ActionPanelProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border-2 border-gray-700">
      <h3 className="text-lg font-bold text-amber-500 mb-3">Choose Action</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {availableActions.map((action) => {
          const info = ACTION_INFO[action];
          const isSelected = selectedAction === action;

          return (
            <button
              key={action}
              onClick={() => onSelectAction(action)}
              disabled={disabled}
              className={clsx(
                'p-3 rounded-lg border-2 transition-all text-left',
                {
                  'border-amber-500 bg-amber-900': isSelected,
                  'border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-gray-500':
                    !isSelected,
                  'opacity-50 cursor-not-allowed': disabled,
                }
              )}
            >
              <div className="text-2xl mb-1">{info.icon}</div>
              <div className="font-bold text-white text-sm">{info.name}</div>
              <div className="text-xs text-gray-400">{info.description}</div>
            </button>
          );
        })}
      </div>

      {selectedAction && (
        <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-700">
          <div className="text-sm text-gray-300">
            Selected: <span className="font-bold text-amber-400">
              {ACTION_INFO[selectedAction].name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
