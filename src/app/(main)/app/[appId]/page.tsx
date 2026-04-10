import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AppFlowView } from './AppFlowView';

export default async function AppFlowPage({ params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;
  const supabase = await createClient();

  // BFS로 연결된 모든 화면 수집
  const visited = new Set<string>();
  const queue = [appId];
  const screens: Record<string, { id: string; name: string; background_color: string }> = {};
  const edges: { source: string; target: string; label?: string }[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const { data: screen } = await supabase
      .from('screens')
      .select('id, name, background_color')
      .eq('id', current)
      .single();

    if (!screen) continue;
    screens[screen.id] = screen;

    const { data: connections } = await supabase
      .from('connections')
      .select('target_screen_id, label')
      .eq('source_screen_id', current);

    for (const conn of connections ?? []) {
      edges.push({ source: current, target: conn.target_screen_id, label: conn.label ?? undefined });
      if (!visited.has(conn.target_screen_id)) queue.push(conn.target_screen_id);
    }
  }

  if (Object.keys(screens).length === 0) redirect('/feed');

  return (
    <div className="h-screen -ml-60">
      <AppFlowView
        screens={Object.values(screens)}
        edges={edges}
        rootId={appId}
      />
    </div>
  );
}
