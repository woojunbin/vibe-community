'use server';

import { createClient } from '@/lib/supabase/server';

export async function toggleLike(screenId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // 이미 좋아요 했는지 확인
  const { data: existing } = await supabase
    .from('likes')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('screen_id', screenId)
    .single();

  if (existing) {
    await supabase.from('likes').delete().eq('user_id', user.id).eq('screen_id', screenId);
    return { liked: false };
  } else {
    await supabase.from('likes').insert({ user_id: user.id, screen_id: screenId });
    return { liked: true };
  }
}

export async function checkLiked(screenId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { liked: false };

  const { data } = await supabase
    .from('likes')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('screen_id', screenId)
    .single();

  return { liked: !!data };
}

// ── 팔로우 ──

export async function toggleFollow(targetUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  if (user.id === targetUserId) return { error: 'Cannot follow yourself' };

  const { data: existing } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .single();

  if (existing) {
    await supabase.from('follows').delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId);
    return { following: false };
  } else {
    await supabase.from('follows').insert({
      follower_id: user.id,
      following_id: targetUserId,
    });
    return { following: true };
  }
}

export async function checkFollowing(targetUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { following: false };

  const { data } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .single();

  return { following: !!data };
}

export async function getFollowingIds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ids: [] };

  const { data } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id);

  return { ids: (data ?? []).map(f => f.following_id) };
}
