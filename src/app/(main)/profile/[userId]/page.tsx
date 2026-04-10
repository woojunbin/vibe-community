import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LevelBadge } from '@/components/level/LevelBadge';
import { ScreenCard } from '@/components/feed/ScreenCard';
import { FollowButton } from '@/components/social/FollowButton';

export default async function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) redirect('/feed');

  const { data: screens } = await supabase
    .from('screens')
    .select('*, owner:profiles!screens_owner_id_fkey(*)')
    .eq('owner_id', userId)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl text-blue-600 font-bold">
            {profile.display_name?.[0] || profile.username[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">{profile.display_name || profile.username}</h1>
              <FollowButton targetUserId={userId} />
            </div>
            <p className="text-sm text-gray-500">@{profile.username}</p>
            {profile.bio && <p className="text-sm text-gray-600 mt-2">{profile.bio}</p>}

            <div className="flex items-center gap-4 mt-3">
              <LevelBadge level={profile.level} xp={profile.xp} showXp size="md" />
              <div className="flex gap-3 text-sm text-gray-600">
                <span><strong className="text-gray-900">{profile.follower_count ?? 0}</strong> 팔로워</span>
                <span><strong className="text-gray-900">{profile.following_count ?? 0}</strong> 팔로잉</span>
              </div>
            </div>

            <div className="mt-3">
              <Link
                href={`/workspace/${userId}`}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                워크스페이스 구경하기
              </Link>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">공개된 페이지</h2>
      {(!screens || screens.length === 0) ? (
        <p className="text-sm text-gray-400">아직 공개된 페이지가 없어요</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {screens.map((screen) => (
            <ScreenCard key={screen.id} screen={screen} />
          ))}
        </div>
      )}
    </div>
  );
}
