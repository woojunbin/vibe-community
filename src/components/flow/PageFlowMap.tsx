'use client';

import { useCallback, useMemo, useState } from 'react';
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
import { createClient } from '@/lib/supabase/client';
import type { PublishedScreen, Connection } from '@/types/community';

interface PageFlowMapProps {
  screens: PublishedScreen[];
  connections: Connection[];
  userId: string;
}

export function PageFlowMap({ screens, connections: initialConnections, userId }: PageFlowMapProps) {
  const router = useRouter();
  const [showConnectModal, setShowConnectModal] = useState<{ source: string; target: string } | null>(null);

  const initialNodes: Node[] = useMemo(() =>
    screens.map((s, i) => ({
      id: s.id,
      data: {
        label: (
          <div className="text-center">
            <div className="text-xs font-medium text-gray-900 truncate max-w-[120px]">{s.name}</div>
            {s.owner && s.owner_id !== userId && (
              <div className="text-[10px] text-gray-500 mt-0.5">@{s.owner.username}</div>
            )}
            <div className={`mt-1 w-2 h-2 rounded-full mx-auto ${s.is_published ? 'bg-green-400' : 'bg-gray-300'}`} />
          </div>
        ),
      },
      position: { x: (i % 4) * 220 + 50, y: Math.floor(i / 4) * 180 + 50 },
      style: {
        background: '#fff',
        border: s.owner_id === userId ? '2px solid #2563EB' : '2px solid #d1d5db',
        borderRadius: 12,
        padding: '10px 16px',
        cursor: 'pointer',
        minWidth: 140,
      },
    })),
  [screens, userId]);

  const initialEdges: Edge[] = useMemo(() =>
    initialConnections.map((c) => ({
      id: c.id,
      source: c.source_screen_id,
      target: c.target_screen_id,
      label: c.label || undefined,
      animated: true,
      style: { stroke: '#2563EB', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#2563EB' },
      labelStyle: { fontSize: 10, fill: '#6b7280' },
    })),
  [initialConnections]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(async (connection: FlowConnection) => {
    if (!connection.source || !connection.target) return;

    // DB에 연결 저장
    const supabase = createClient();
    const { data, error } = await supabase
      .from('connections')
      .insert({
        source_screen_id: connection.source,
        target_screen_id: connection.target,
        created_by: userId,
        edge_type: 'solid',
      })
      .select()
      .single();

    if (error) {
      console.error('Connection error:', error);
      return;
    }

    setEdges((eds) => addEdge({
      ...connection,
      id: data.id,
      animated: true,
      style: { stroke: '#2563EB', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#2563EB' },
    }, eds));
  }, [setEdges, userId]);

  const onNodeDoubleClick: NodeMouseHandler = useCallback((_event, node) => {
    router.push(`/editor/${node.id}`);
  }, [router]);

  return (
    <div className="w-full h-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
        proOptions={{ hideAttribution: true }}
        connectionLineStyle={{ stroke: '#2563EB', strokeWidth: 2 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
