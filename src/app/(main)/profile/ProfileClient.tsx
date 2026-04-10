'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LevelBadge } from '@/components/level/LevelBadge';
import { ScreenThumbnail } from '@/components/feed/ScreenThumbnail';
import { getNextLevel, LEVELS } from '@/utils/level-config';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types/community';

export function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [screens, setScreens] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      if (profile) setUser(profile as unknown as UserProfile);

      const { data: myScreens } = await supabase
        .from('screens')
        .select('*')
        .eq('owner_id', authUser.id)
        .order('updated_at', { ascending: false });
      setScreens(myScreens ?? []);
    }
    load();
  }, [router]);

  if (!user) return <div className="flex-1 flex items-center justify-center text-gray-400">로딩 중...</div>;

  const publishedScreens = screens.filter(s => s.is_published);
  const next = getNextLevel(user.level);
  const currentLevelXp = LEVELS.find(l => l.level === user.level)?.requiredXp ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl text-blue-600 font-bold">
            {user.display_name?.[0] || user.username[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{user.display_name || user.username}</h1>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <div className="mt-3">
              <LevelBadge level={user.level} xp={user.xp} showXp size="md" />
            </div>
          </div>
        </div>

        {next && (
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>다음 레벨까지</span>
              <span>{next.requiredXp - user.xp} XP</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, ((user.xp - currentLevelXp) / (next.requiredXp - currentLevelXp)) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-3 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-lg font-bold text-gray-900">{screens.length}</div>
            <div className="text-xs text-gray-500">총 페이지</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-lg font-bold text-gray-900">{publishedScreens.length}</div>
            <div className="text-xs text-gray-500">공개</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-lg font-bold text-gray-900">{user.follower_count ?? 0}</div>
            <div className="text-xs text-gray-500">팔로워</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-lg font-bold text-gray-900">{user.following_count ?? 0}</div>
            <div className="text-xs text-gray-500">팔로잉</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-lg font-bold text-gray-900">{user.xp}</div>
            <div className="text-xs text-gray-500">XP</div>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">공개된 페이지</h2>
      {publishedScreens.length === 0 ? (
        <p className="text-sm text-gray-400">아직 공개된 페이지가 없어요</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {publishedScreens.map((screen) => (
            <Link key={screen.id as string} href={`/screen/${screen.id}`} className="block group">
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
                <div className="aspect-[9/16] max-h-40 overflow-hidden">
                  <ScreenThumbnail components={(screen.components ?? []) as never} backgroundColor={screen.background_color as string} />
                </div>
                <div className="p-2">
                  <h3 className="text-xs font-medium text-gray-900 truncate group-hover:text-blue-600">{screen.name as string}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
