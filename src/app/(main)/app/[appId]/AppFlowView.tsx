'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface AppFlowViewProps {
  screens: { id: string; name: string; background_color: string }[];
  edges: { source: string; target: string; label?: string }[];
  rootId: string;
}

export function AppFlowView({ screens, edges: rawEdges, rootId }: AppFlowViewProps) {
  const router = useRouter();

  const nodes: Node[] = useMemo(() =>
    screens.map((s, i) => ({
      id: s.id,
      data: { label: s.name },
      position: { x: (i % 4) * 250, y: Math.floor(i / 4) * 200 },
      style: {
        background: s.id === rootId ? '#2563EB' : '#fff',
        color: s.id === rootId ? '#fff' : '#111827',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '12px 20px',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
      },
    })),
  [screens, rootId]);

  const edges: Edge[] = useMemo(() =>
    rawEdges.map((e, i) => ({
      id: `e-${i}`,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: true,
      style: { stroke: '#2563EB' },
    })),
  [rawEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    router.push(`/screen/${node.id}`);
  }, [router]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
