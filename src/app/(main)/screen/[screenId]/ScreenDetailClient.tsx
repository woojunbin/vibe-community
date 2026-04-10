'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Link2, Eye, Import, Layout } from 'lucide-react';
import { ScreenThumbnail } from '@/components/feed/ScreenThumbnail';
import { LevelBadge } from '@/components/level/LevelBadge';
import { Button } from '@/components/ui/Button';
import { FollowButton } from '@/components/social/FollowButton';
import { createClient } from '@/lib/supabase/client';
import type { PublishedScreen } from '@/types/community';

export function ScreenDetailClient({ screenId }: { screenId: string }) {
  const router = useRouter();
  const [screen, setScreen] = useState<PublishedScreen | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setMyUserId(user.id);

      const { data, error } = await supabase
        .from('screens')
        .select('*, owner:profiles!screens_owner_id_fkey(*)')
        .eq('id', screenId)
        .single();

      if (error || !data) { router.push('/feed'); return; }
      setScreen(data as PublishedScreen);
      setLikeCount(data.like_count);

      // 좋아요 여부 확인
      if (user) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('screen_id', screenId)
          .eq('user_id', user.id)
          .maybeSingle();
        setLiked(!!likeData);
      }

      // 조회수 증가
      await supabase
        .from('screens')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', screenId);
    }
    load();
  }, [screenId, router]);

  const handleLike = useCallback(async () => {
    if (!myUserId) return;
    const supabase = createClient();

    if (liked) {
      await supabase.from('likes').delete().eq('screen_id', screenId).eq('user_id', myUserId);
      setLikeCount(c => Math.max(0, c - 1));
    } else {
      await supabase.from('likes').insert({ screen_id: screenId, user_id: myUserId });
      setLikeCount(c => c + 1);
    }
    setLiked(!liked);
  }, [liked, myUserId, screenId]);

  const handleImport = useCallback(async () => {
    if (!myUserId || !screen) return;
    setImporting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('screens')
        .insert({
          owner_id: myUserId,
          name: `${screen.name} (from @${screen.owner?.username || '?'})`,
          components: screen.components ?? [],
          canvas_width: screen.canvas_width ?? 375,
          canvas_height: screen.canvas_height ?? 812,
          background_color: screen.background_color ?? '#FAFAFA',
        })
        .select()
        .single();

      if (error) {
        console.error('Import error:', error);
      } else {
        alert('내 워크스페이스에 가져왔습니다!');
      }
    } catch (e) {
      console.error(e);
    }
    setImporting(false);
  }, [myUserId, screen]);

  if (!screen) return <div className="flex-1 flex items-center justify-center text-gray-400">로딩 중...</div>;

  const isOwn = myUserId === screen.owner_id;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-[9/16] max-h-[600px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <ScreenThumbnail
            components={screen.components}
            backgroundColor={screen.background_color}
            width={screen.canvas_width}
            height={screen.canvas_height}
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{screen.name}</h1>

          {screen.owner && (
            <Link
              href={`/workspace/${screen.owner_id}`}
              className="flex items-center gap-2 mb-4 hover:bg-gray-50 rounded-lg p-1 -ml-1 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-blue-600 font-bold">
                {screen.owner.display_name?.[0] || screen.owner.username[0]}
              </div>
              <div>
                <span className="text-sm text-gray-700 group-hover:text-blue-600">{screen.owner.display_name || screen.owner.username}</span>
                <span className="text-xs text-gray-400 ml-1">@{screen.owner.username}</span>
              </div>
              <LevelBadge level={screen.owner.level} xp={screen.owner.xp} />
              <FollowButton targetUserId={screen.owner_id} size="sm" />
            </Link>
          )}

          {screen.description && (
            <p className="text-sm text-gray-500 mb-4">{screen.description}</p>
          )}

          <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Eye size={14} /> {screen.view_count}</span>
            <span className="flex items-center gap-1"><Heart size={14} /> {likeCount}</span>
            <span className="flex items-center gap-1"><Link2 size={14} /> {screen.connection_count}</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant={liked ? 'primary' : 'secondary'} onClick={handleLike}>
              <Heart size={14} className="mr-1" fill={liked ? 'currentColor' : 'none'} />
              {liked ? '좋아요 취소' : '좋아요'}
            </Button>

            {!isOwn && (
              <Button variant="secondary" onClick={handleImport} loading={importing}>
                <Import size={14} className="mr-1" />
                내 워크스페이스로 가져오기
              </Button>
            )}

            {screen.owner && (
              <Button variant="secondary" onClick={() => router.push(`/workspace/${screen.owner_id}`)}>
                <Layout size={14} className="mr-1" />
                워크스페이스 구경
              </Button>
            )}
          </div>

          {/* 컴포넌트 정보 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">구성</h3>
            <p className="text-sm text-gray-700">{screen.components?.length || 0}개 컴포넌트</p>
            <p className="text-sm text-gray-700">{screen.canvas_width || 375} × {screen.canvas_height || 812}px</p>
          </div>
        </div>
      </div>
    </div>
  );
}
