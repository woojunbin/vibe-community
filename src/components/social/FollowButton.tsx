'use client';

import { useState, useEffect } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface FollowButtonProps {
  targetUserId: string;
  size?: 'sm' | 'md';
}

export function FollowButton({ targetUserId, size = 'sm' }: FollowButtonProps) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setMyId(user.id);

      const { data } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();
      setFollowing(!!data);
    }
    check();
  }, [targetUserId]);

  async function handleToggle() {
    if (!myId || myId === targetUserId) return;
    setLoading(true);
    const supabase = createClient();

    if (following) {
      await supabase.from('follows').delete()
        .eq('follower_id', myId)
        .eq('following_id', targetUserId);
      setFollowing(false);
    } else {
      await supabase.from('follows').insert({
        follower_id: myId,
        following_id: targetUserId,
      });
      setFollowing(true);
    }
    setLoading(false);
  }

  // 자기 자신이면 표시 안함
  if (myId === targetUserId) return null;

  return (
    <Button
      variant={following ? 'secondary' : 'primary'}
      size={size}
      onClick={handleToggle}
      loading={loading}
    >
      {following ? (
        <><UserCheck size={14} className="mr-1" /> 팔로잉</>
      ) : (
        <><UserPlus size={14} className="mr-1" /> 팔로우</>
      )}
    </Button>
  );
}
