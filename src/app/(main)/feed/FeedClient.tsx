'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ScreenCard } from '@/components/feed/ScreenCard';
import type { PublishedScreen } from '@/types/community';
import { createClient } from '@/lib/supabase/client';

type FeedTab = 'all' | 'following' | 'popular';

export function FeedClient() {
  const [tab, setTab] = useState<FeedTab>('all');
  const [query, setQuery] = useState('');
  const [screens, setScreens] = useState<PublishedScreen[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 팔로잉 목록 로드
  useEffect(() => {
    async function loadFollowings() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);
      setFollowingIds((data ?? []).map(f => f.following_id));
    }
    loadFollowings();
  }, []);

  // 피드 로드
  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();

      let q = supabase
        .from('screens')
        .select('*, owner:profiles!screens_owner_id_fkey(*)')
        .eq('is_published', true);

      if (tab === 'popular') {
        q = q.order('like_count', { ascending: false });
      } else {
        q = q.order('published_at', { ascending: false });
      }

      const { data } = await q.limit(40);
      setScreens((data as PublishedScreen[]) ?? []);
      setLoading(false);
    }
    load();
  }, [tab]);

  // 검색 + 팔로잉 필터
  const filtered = useMemo(() => {
    let result = screens;

    // 팔로잉 탭: 팔로잉 유저의 페이지만
    if (tab === 'following') {
      result = result.filter(s => followingIds.includes(s.owner_id));
    }

    // 검색어 필터
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.owner?.username?.toLowerCase().includes(q) ||
        s.owner?.display_name?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [screens, tab, followingIds, query]);

  const tabs: { key: FeedTab; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'following', label: '팔로잉' },
    { key: 'popular', label: '인기' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">피드</h1>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
              {t.key === 'following' && followingIds.length > 0 && (
                <span className="ml-1 text-xs text-blue-500">{followingIds.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 */}
      <div className="relative max-w-md mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="페이지 또는 빌더 이름으로 검색..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 결과 */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-sm">로딩 중...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          {tab === 'following' && followingIds.length === 0 ? (
            <>
              <p className="text-lg mb-2">아직 팔로우한 빌더가 없어요</p>
              <p className="text-sm">다른 빌더를 팔로우하면 여기에 페이지가 나타납니다</p>
            </>
          ) : query ? (
            <p className="text-lg">&ldquo;{query}&rdquo;에 대한 결과가 없습니다</p>
          ) : (
            <>
              <p className="text-lg mb-2">아직 공유된 페이지가 없어요</p>
              <p className="text-sm">첫 번째 페이지를 만들어보세요!</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((screen) => (
            <ScreenCard key={screen.id} screen={screen} />
          ))}
        </div>
      )}
    </div>
  );
}
