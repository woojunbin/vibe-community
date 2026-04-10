'use server';

import { createClient } from '@/lib/supabase/server';
import type { AppComponent } from '@/types/project';

export async function createScreen(name?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('screens')
    .insert({ owner_id: user.id, name: name || '새 화면' })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function updateScreen(
  screenId: string,
  updates: {
    name?: string;
    components?: AppComponent[];
    canvas_width?: number;
    canvas_height?: number;
    background_color?: string;
    description?: string;
    tags?: string[];
  },
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('screens')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', screenId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function publishScreen(screenId: string, publish: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('screens')
    .update({
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', screenId);

  if (error) return { error: error.message };

  // 첫 퍼블리시 시 XP 부여
  if (publish) {
    await supabase.rpc('grant_xp', {
      p_user_id: user.id,
      p_event_type: 'publish_screen',
      p_xp: 50,
      p_ref_id: screenId,
    });
  }

  return { success: true };
}

export async function deleteScreen(screenId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('screens').delete().eq('id', screenId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getMyScreens() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [] };

  const { data, error } = await supabase
    .from('screens')
    .select('*')
    .eq('owner_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) return { data: [] };
  return { data: data ?? [] };
}

export async function getScreen(screenId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('screens')
    .select('*, owner:profiles!screens_owner_id_fkey(*)')
    .eq('id', screenId)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function getFeed(sort: 'latest' | 'popular' = 'latest', page = 0) {
  const supabase = await createClient();
  const limit = 20;
  const from = page * limit;

  let query = supabase
    .from('screens')
    .select('*, owner:profiles!screens_owner_id_fkey(*)')
    .eq('is_published', true)
    .range(from, from + limit - 1);

  if (sort === 'popular') {
    query = query.order('like_count', { ascending: false });
  } else {
    query = query.order('published_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) return { data: [] };
  return { data: data ?? [] };
}
