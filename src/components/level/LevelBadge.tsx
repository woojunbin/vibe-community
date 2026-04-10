'use client';

import { getLevelForXp, getNextLevel } from '@/utils/level-config';

interface LevelBadgeProps {
  level: number;
  xp: number;
  showXp?: boolean;
  size?: 'sm' | 'md';
}

const levelColors: Record<number, string> = {
  1: 'bg-gray-100 text-gray-600',
  2: 'bg-green-100 text-green-700',
  3: 'bg-blue-100 text-blue-700',
  4: 'bg-purple-100 text-purple-700',
  5: 'bg-orange-100 text-orange-700',
  6: 'bg-red-100 text-red-700',
  7: 'bg-yellow-100 text-yellow-700',
};

export function LevelBadge({ level, xp, showXp = false, size = 'sm' }: LevelBadgeProps) {
  const config = getLevelForXp(xp);
  const next = getNextLevel(level);
  const colorClass = levelColors[level] || levelColors[1];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`rounded-full font-medium ${colorClass} ${sizeClass}`}>
        Lv.{level} {config.title}
      </span>
      {showXp && next && (
        <div className="flex items-center gap-1">
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, ((xp - config.requiredXp) / (next.requiredXp - config.requiredXp)) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">{xp}/{next.requiredXp}</span>
        </div>
      )}
    </div>
  );
}
