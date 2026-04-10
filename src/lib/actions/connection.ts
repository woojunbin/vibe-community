'use server';

import { createClient } from '@/lib/supabase/server';

export async function createConnection(
  sourceScreenId: string,
  targetScreenId: string,
  label?: string,
  edgeType: 'solid' | 'dashed' = 'solid',
  sourceComponentId?: string,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('connections')
    .insert({
      source_screen_id: sourceScreenId,
      target_screen_id: targetScreenId,
      created_by: user.id,
      label: label || null,
      edge_type: edgeType,
      source_component_id: sourceComponentId || null,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // target screen의 connection_count 증가
  await supabase.rpc('grant_xp', {
    p_user_id: user.id, p_event_type: 'create_connection', p_xp: 10, p_ref_id: targetScreenId,
  });

  // target screen 소유자에게 XP
  const { data: target } = await supabase.from('screens').select('owner_id').eq('id', targetScreenId).single();
  if (target && target.owner_id !== user.id) {
    await supabase.rpc('grant_xp', {
      p_user_id: target.owner_id, p_event_type: 'receive_connection', p_xp: 20, p_ref_id: targetScreenId,
    });
  }

  // connection_count 증가
  const { data: targetScreen } = await supabase
    .from('screens')
    .select('connection_count')
    .eq('id', targetScreenId)
    .single();
  if (targetScreen) {
    await supabase
      .from('screens')
      .update({ connection_count: (targetScreen.connection_count ?? 0) + 1 })
      .eq('id', targetScreenId);
  }

  return { data };
}

export async function deleteConnection(connectionId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('connections').delete().eq('id', connectionId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getScreenConnections(screenId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('connections')
    .select('*, source_screen:screens!source_screen_id(id, name, owner:profiles!screens_owner_id_fkey(*)), target_screen:screens!target_screen_id(id, name, owner:profiles!screens_owner_id_fkey(*))')
    .or(`source_screen_id.eq.${screenId},target_screen_id.eq.${screenId}`);

  if (error) return { data: [] };
  return { data: data ?? [] };
}
