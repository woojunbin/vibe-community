'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection as FlowConnection,
  type NodeMouseHandler,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Users, Search, X, Import } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ScreenNode } from '@/components/flow/ScreenNode';
import { Button } from '@/components/ui/Button';
import type { PublishedScreen, Connection } from '@/types/community';

const nodeTypes = { screenNode: ScreenNode };

export function WorkspaceClient() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const supabaseRef = useRef(createClient());

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  // 데이터 로드
  useEffect(() => {
    async function load() {
      const supabase = supabaseRef.current;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: myScreens } = await supabase
        .from('screens')
        .select('*, owner:profiles!screens_owner_id_fkey(*)')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true });

      const allScreens = (myScreens as PublishedScreen[]) ?? [];

      const newNodes: Node[] = allScreens.map((s, i) => ({
        id: s.id,
        type: 'screenNode',
        data: {
          label: s.name,
          backgroundColor: s.background_color,
          isOwn: true,
          ownerName: null,
          isPublished: s.is_published,
        },
        position: { x: (i % 3) * 250 + 80, y: Math.floor(i / 3) * 260 + 80 },
      }));
      setNodes(newNodes);

      if (allScreens.length > 0) {
        const ids = allScreens.map(s => s.id);
        const { data: conns } = await supabase
          .from('connections')
          .select('*')
          .or(ids.map(id => `source_screen_id.eq.${id}`).join(','));

        if (conns) {
          const newEdges: Edge[] = conns.map((c: Connection) => ({
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
    }
    load();
  }, [setNodes, setEdges]);

  // 노드 연결
  const onConnect = useCallback(async (connection: FlowConnection) => {
    if (!connection.source || !connection.target) return;
    const supabase = supabaseRef.current;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('connections')
      .insert({
        source_screen_id: connection.source,
        target_screen_id: connection.target,
        created_by: user.id,
        edge_type: 'solid',
      })
      .select()
      .single();

    if (error) { console.error(error); return; }

    setEdges((eds) => addEdge({
      ...connection,
      id: data.id,
      animated: false,
      style: { stroke: '#1e2d45', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#1e2d45', width: 16, height: 16 },
    }, eds));
  }, [setEdges]);

  // 노드 클릭 → 에디터
  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    router.push(`/editor/${node.id}`);
  }, [router]);

  // 새 화면 추가
  const handleAddScreen = useCallback(async () => {
    setCreating(true);
    const supabase = supabaseRef.current;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCreating(false); return; }

    const { data, error } = await supabase
      .from('screens')
      .insert({ owner_id: user.id, name: '빈 화면' })
      .select()
      .single();

    if (!error && data) {
      const newNode: Node = {
        id: data.id,
        type: 'screenNode',
        data: {
          label: data.name,
          backgroundColor: data.background_color,
          isOwn: true,
          isPublished: false,
        },
        position: { x: 80 + nodes.length * 250, y: 80 },
      };
      setNodes((nds) => [...nds, newNode]);
    }
    setCreating(false);
  }, [nodes.length, setNodes]);

  // 커뮤니티에서 페이지 가져오기
  const [importing, setImporting] = useState<string | null>(null);
  const handleImportScreen = useCallback(async (screen: PublishedScreen) => {
    setImporting(screen.id);
    try {
      const supabase = supabaseRef.current;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setImporting(null); return; }

      // 원본 페이지 상세 조회 (components 포함 보장)
      const { data: fullScreen } = await supabase
        .from('screens')
        .select('*')
        .eq('id', screen.id)
        .single();

      const sourceComponents = fullScreen?.components ?? screen.components ?? [];
      const sourceWidth = fullScreen?.canvas_width ?? screen.canvas_width ?? 375;
      const sourceHeight = fullScreen?.canvas_height ?? screen.canvas_height ?? 812;
      const sourceBg = fullScreen?.background_color ?? screen.background_color ?? '#FAFAFA';

      const { data, error } = await supabase
        .from('screens')
        .insert({
          owner_id: user.id,
          name: `${screen.name} (from @${screen.owner?.username || '?'})`,
          components: sourceComponents,
          canvas_width: sourceWidth,
          canvas_height: sourceHeight,
          background_color: sourceBg,
        })
        .select()
        .single();

      if (error) {
        console.error('Import error:', error);
        setImporting(null);
        return;
      }

      if (data) {
        const newNode: Node = {
          id: data.id,
          type: 'screenNode',
          data: {
            label: data.name,
            backgroundColor: data.background_color,
            isOwn: true,
            ownerName: null,
            isPublished: false,
          },
          position: { x: 80 + nodes.length * 250, y: 80 },
        };
        setNodes((nds) => [...nds, newNode]);
        setShowCommunity(false);
      }
    } catch (e) {
      console.error('Import exception:', e);
    }
    setImporting(null);
  }, [nodes.length, setNodes]);

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0 z-10">
        <h1 className="text-sm font-bold text-gray-900">My App</h1>
        <span className="text-xs text-gray-500 hidden md:block">
          노드 클릭으로 편집 · 핸들 드래그로 연결
        </span>
        <div className="flex-1" />
        <Button variant="secondary" size="sm" onClick={() => setShowCommunity(true)}>
          <Import size={14} className="mr-1" /> 페이지 가져오기
        </Button>
        <Button variant="secondary" size="sm" onClick={() => router.push('/feed')}>
          <Users size={14} className="mr-1" /> 커뮤니티
        </Button>
        <Button variant="primary" size="sm" onClick={handleAddScreen} loading={creating}>
          <Plus size={14} className="mr-1" /> 화면 추가
        </Button>
      </header>

      {/* FlowMap */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          connectionLineStyle={{ stroke: '#1e2d45', strokeWidth: 2, strokeDasharray: '8 4' }}
          defaultEdgeOptions={{
            style: { stroke: '#1e2d45', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#1e2d45' },
          }}
        >
          <Background gap={20} size={1} color="#e5e7eb" />
          <Controls showInteractive={false} style={{ bottom: 16, left: 16 }} />
        </ReactFlow>

        {/* 커뮤니티 페이지 가져오기 패널 */}
        {showCommunity && (
          <CommunityImportPanel
            onImport={handleImportScreen}
            onClose={() => setShowCommunity(false)}
            importingId={importing}
          />
        )}
      </div>
    </div>
  );
}

// ── 커뮤니티 가져오기 패널 ──

function CommunityImportPanel({
  onImport,
  onClose,
  importingId,
}: {
  onImport: (screen: PublishedScreen) => void;
  onClose: () => void;
  importingId?: string | null;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublishedScreen[]>([]);
  const [loading, setLoading] = useState(false);

  // 초기 로드: 인기 공개 페이지
  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      let q = supabase
        .from('screens')
        .select('*, owner:profiles!screens_owner_id_fkey(*)')
        .eq('is_published', true)
        .order('like_count', { ascending: false })
        .limit(20);
      if (user) q = q.neq('owner_id', user.id);
      const { data } = await q;
      setResults((data as PublishedScreen[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let q = supabase
      .from('screens')
      .select('*, owner:profiles!screens_owner_id_fkey(*)')
      .eq('is_published', true)
      .ilike('name', `%${query}%`)
      .limit(20);
    if (user) q = q.neq('owner_id', user.id);
    const { data } = await q;
    setResults((data as PublishedScreen[]) ?? []);
    setLoading(false);
  }

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-xl z-20 flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">커뮤니티에서 가져오기</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      {/* 검색 */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="페이지 검색..."
              className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button size="sm" onClick={handleSearch}>검색</Button>
        </div>
      </div>

      {/* 결과 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <p className="text-xs text-gray-500 text-center py-8">로딩 중...</p>
        ) : results.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-8">검색 결과가 없습니다</p>
        ) : (
          results.map((screen) => (
            <div
              key={screen.id}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{screen.name}</h4>
                  {screen.owner && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      @{screen.owner.username}
                      <span className="ml-1 text-gray-400">Lv.{screen.owner.level}</span>
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>♥ {screen.like_count}</span>
                    <span>⟷ {screen.connection_count}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onImport(screen)}
                  loading={importingId === screen.id}
                  disabled={!!importingId}
                >
                  <Import size={12} className="mr-1" /> 가져오기
                </Button>
              </div>

              {/* 미니 프리뷰 */}
              <div
                className="mt-2 h-20 rounded border border-gray-100 overflow-hidden"
                style={{ backgroundColor: screen.background_color || '#FAFAFA' }}
              >
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                  {screen.components.length}개 컴포넌트
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 안내 */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-[11px] text-gray-500">
          다른 빌더의 공개 페이지를 내 워크스페이스로 복사합니다.
          가져온 페이지는 자유롭게 수정하고 연결할 수 있어요.
        </p>
      </div>
    </div>
  );
}
