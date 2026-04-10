'use client';

import { useState } from 'react';
import { Heart, Link2, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ScreenThumbnail } from '@/components/feed/ScreenThumbnail';
import { LevelBadge } from '@/components/level/LevelBadge';
import { Button } from '@/components/ui/Button';
import { toggleLike } from '@/lib/actions/social';
import type { PublishedScreen, Connection } from '@/types/community';

interface ScreenDetailViewProps {
  screen: PublishedScreen;
  connections: Connection[];
}

export function ScreenDetailView({ screen, connections }: ScreenDetailViewProps) {
  const [liked, setLiked] = useState(screen.is_liked ?? false);
  const [likeCount, setLikeCount] = useState(screen.like_count);

  async function handleLike() {
    const result = await toggleLike(screen.id);
    if ('liked' in result && result.liked !== undefined) {
      setLiked(result.liked);
      setLikeCount((c) => result.liked ? c + 1 : c - 1);
    }
  }

  const outgoing = connections.filter((c) => c.source_screen_id === screen.id);
  const incoming = connections.filter((c) => c.target_screen_id === screen.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 프리뷰 */}
        <div className="aspect-[9/16] max-h-[600px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <ScreenThumbnail
            components={screen.components}
            backgroundColor={screen.background_color}
            width={screen.canvas_width}
            height={screen.canvas_height}
          />
        </div>

        {/* 정보 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{screen.name}</h1>

          {screen.owner && (
            <Link href={`/profile/${screen.owner.id}`} className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                {screen.owner.display_name?.[0] || screen.owner.username[0]}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-blue-600">
                {screen.owner.display_name || screen.owner.username}
              </span>
              <LevelBadge level={screen.owner.level} xp={screen.owner.xp} />
            </Link>
          )}

          {screen.description && (
            <p className="text-sm text-gray-500 mb-4">{screen.description}</p>
          )}

          {/* 통계 */}
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Eye size={14} /> {screen.view_count}</span>
            <span className="flex items-center gap-1"><Heart size={14} /> {likeCount}</span>
            <span className="flex items-center gap-1"><Link2 size={14} /> {screen.connection_count}</span>
          </div>

          {/* 액션 */}
          <div className="flex gap-2 mb-8">
            <Button variant={liked ? 'primary' : 'secondary'} onClick={handleLike}>
              <Heart size={14} className="mr-1" fill={liked ? 'currentColor' : 'none'} />
              {liked ? '좋아요 취소' : '좋아요'}
            </Button>
          </div>

          {/* 연결된 페이지 */}
          {outgoing.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">이 페이지에서 연결</h3>
              <div className="space-y-2">
                {outgoing.map((conn) => (
                  <Link
                    key={conn.id}
                    href={`/screen/${conn.target_screen_id}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <ArrowRight size={14} className="text-blue-500" />
                    <span className="text-gray-700">{(conn as unknown as { target_screen: { name: string } }).target_screen?.name ?? '화면'}</span>
                    {conn.label && <span className="text-gray-400">({conn.label})</span>}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {incoming.length > 0 && (
            <section>
              <h3 className="text-sm font-medium text-gray-700 mb-2">이 페이지로 연결됨</h3>
              <div className="space-y-2">
                {incoming.map((conn) => (
                  <Link
                    key={conn.id}
                    href={`/screen/${conn.source_screen_id}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <ArrowRight size={14} className="text-gray-400 rotate-180" />
                    <span className="text-gray-700">{(conn as unknown as { source_screen: { name: string } }).source_screen?.name ?? '화면'}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
