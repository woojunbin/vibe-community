'use client';

import { Heart, Link2 } from 'lucide-react';
import { LevelBadge } from '@/components/level/LevelBadge';
import type { PublishedScreen } from '@/types/community';
import Link from 'next/link';
import { ScreenThumbnail } from './ScreenThumbnail';

interface ScreenCardProps {
  screen: PublishedScreen;
}

export function ScreenCard({ screen }: ScreenCardProps) {
  return (
    <Link href={`/screen/${screen.id}`} className="group block">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
        {/* 썸네일 */}
        <div className="aspect-[9/16] max-h-64 bg-gray-50 overflow-hidden">
          <ScreenThumbnail components={screen.components} backgroundColor={screen.background_color} />
        </div>

        {/* 정보 */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
            {screen.name}
          </h3>

          {screen.owner && (
            <Link
              href={`/workspace/${screen.owner_id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 mt-2 hover:bg-gray-50 rounded-md -mx-1 px-1 py-0.5 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                {screen.owner.display_name?.[0] || screen.owner.username[0]}
              </div>
              <span className="text-xs text-gray-500 truncate hover:text-blue-600">{screen.owner.display_name || screen.owner.username}</span>
              <LevelBadge level={screen.owner.level} xp={screen.owner.xp} />
            </Link>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Heart size={12} /> {screen.like_count}
            </span>
            <span className="flex items-center gap-1">
              <Link2 size={12} /> {screen.connection_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
