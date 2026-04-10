'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ScreenCard } from '@/components/feed/ScreenCard';
import { createClient } from '@/lib/supabase/client';
import type { PublishedScreen } from '@/types/community';

export function ExploreClient() {
  const [query, setQuery] = useState('');
  const [screens, setScreens] = useState<PublishedScreen[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('screens')
        .select('*, owner:profiles!screens_owner_id_fkey(*)')
        .eq('is_published', true)
        .order('like_count', { ascending: false })
        .limit(40);
      setScreens((data as PublishedScreen[]) ?? []);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return screens;
    return screens.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
  }, [screens, query]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">탐색</h1>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="페이지 이름으로 검색..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {filtered.map((screen) => (
          <ScreenCard key={screen.id} screen={screen} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          {query ? `"${query}"에 대한 결과가 없습니다` : '공유된 페이지를 탐색해보세요'}
        </div>
      )}
    </div>
  );
}
