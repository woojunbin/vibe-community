'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Import, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ScreenNode } from '@/components/flow/ScreenNode';
import { LevelBadge } from '@/components/level/LevelBadge';
import { FollowButton } from '@/components/social/FollowButton';
import { Button } from '@/components/ui/Button';
import type { PublishedScreen, UserProfile, Connection } from '@/types/community';

const nodeTypes = { screenNode: ScreenNode };

export function WorkspaceViewClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [screens, setScreens] = useState<PublishedScreen[]>([]);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [importing, setImporting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // 내 ID 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setMyUserId(user.id);

      // 대상 유저 프로필
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (prof) setProfile(prof as UserProfile);

      // 해당 유저의 공개 화면
      const { data: pubScreens } = await supabase
        .from('screens')
        .select('*, owner:profiles!screens_owner_id_fkey(*)')
        .eq('owner_id', userId)
        .eq('is_published', true)
        .order('created_at', { ascending: true });

      const allScreens = (pubScreens as PublishedScreen[]) ?? [];
      setScreens(allScreens);

      // 노드 배치 (3열 그리드)
      const newNodes: Node[] = allScreens.map((s, i) => ({
        id: s.id,
        type: 'screenNode',
        data: {
          label: s.name,
          backgroundColor: s.background_color,
          isOwn: false,
          ownerName: null,
          isPublished: true,
        },
        position: { x: (i % 4) * 220 + 60, y: Math.floor(i / 4) * 260 + 60 },
      }));
      setNodes(newNodes);

      // 해당 유저 화면 간 연결선
      if (allScreens.length > 0) {
        const ids = allScreens.map(s => s.id);
        const { data: conns } = await supabase
          .from('connections')
          .select('*')
          .or(ids.map(id => `source_screen_id.eq.${id}`).join(','));

        if (conns) {
          const idSet = new Set(ids);
          const newEdges: Edge[] = (conns as Connection[])
            .filter(c => idSet.has(c.source_screen_id) && idSet.has(c.target_screen_id))
            .map(c => ({
              id: c.id,
              source: c.source_screen_id,
              target: c.target_screen_id,
              label: c.label || undefined,
              animated: false,
              style: {
                stroke: '#1e2d45',
                strokeWidth: 2,
                strokeDasharray: c.edge_type === 'dashed' ? '8 4' : undefined,
              },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#1e2d45', width: 16, height: 16 },
            }));
          setEdges(newEdges);
        }
      }

      setLoading(false);
    }
    load();
  }, [userId, setNodes, setEdges]);

  // 노드 클릭 → 화면 상세 보기
  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    router.push(`/screen/${node.id}`);
  }, [router]);

  // 페이지 가져오기
  const handleImport = useCallback(async (screen: PublishedScreen) => {
    setImporting(screen.id);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setImporting(null); return; }

      const { data: fullScreen } = await supabase
        .from('screens')
        .select('*')
        .eq('id', screen.id)
        .single();

      const { error } = await supabase
        .from('screens')
        .insert({
          owner_id: user.id,
          name: `${screen.name} (from @${screen.owner?.username || '?'})`,
          components: fullScreen?.components ?? screen.components ?? [],
          canvas_width: fullScreen?.canvas_width ?? screen.canvas_width ?? 375,
          canvas_height: fullScreen?.canvas_height ?? screen.canvas_height ?? 812,
          background_color: fullScreen?.background_color ?? screen.background_color ?? '#FAFAFA',
        })
        .select()
        .single();

      if (error) {
        console.error('Import error:', error);
      } else {
        alert('내 워크스페이스에 가져왔습니다!');
      }
    } catch (e) {
      console.error('Import exception:', e);
    }
    setImporting(null);
  }, []);

  const isOwnWorkspace = myUserId === userId;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-sm text-gray-500">워크스페이스 로딩 중...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-sm text-gray-500">유저를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col">
      {/* 헤더 */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-5 gap-4 shrink-0 z-10">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-blue-600 font-bold">
            {profile.display_name?.[0] || profile.username[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                {profile.display_name || profile.username}
              </span>
              <LevelBadge level={profile.level} xp={profile.xp} size="sm" />
            </div>
            <p className="text-[11px] text-gray-500">
              @{profile.username}
              <span className="ml-2 text-gray-400">
                {profile.follower_count ?? 0} 팔로워 · {profile.following_count ?? 0} 팔로잉
              </span>
            </p>
          </div>
        </div>

        {!isOwnWorkspace && <FollowButton targetUserId={userId} />}

        <div className="flex-1" />

        <span className="text-xs text-gray-400">
          공개 페이지 {screens.length}개
        </span>

        {isOwnWorkspace && (
          <Button variant="primary" size="sm" onClick={() => router.push('/editor')}>
            내 워크스페이스로
          </Button>
        )}

        <Button variant="secondary" size="sm" onClick={() => router.push(`/profile/${userId}`)}>
          <User size={14} className="mr-1" /> 프로필
        </Button>
      </header>

      {/* FlowMap (읽기 전용) */}
      <div className="flex-1 relative">
        {screens.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">아직 공개된 페이지가 없어요</p>
              <p className="text-gray-300 text-sm">이 빌더가 페이지를 퍼블리시하면 여기에 나타납니다</p>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={20} size={1} color="#e5e7eb" />
            <Controls showInteractive={false} style={{ bottom: 16, left: 16 }} />
          </ReactFlow>
        )}

        {/* 우측 하단 가져오기 패널 */}
        {!isOwnWorkspace && screens.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-white rounded-xl border border-gray-200 shadow-lg p-4 w-72 z-20">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">페이지 가져오기</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {screens.map(s => (
                <div key={s.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-900 truncate flex-1 mr-2">{s.name}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleImport(s)}
                    loading={importing === s.id}
                    disabled={!!importing}
                  >
                    <Import size={12} />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              가져온 페이지는 내 워크스페이스에 복사됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
