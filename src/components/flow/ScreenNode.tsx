'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface BlockHandle {
  id: string;
  label: string;
  type: 'source' | 'target'; // source=네비게이션 블록(오른쪽), target=진입점(왼쪽)
  componentName: string;
  action?: string;
}

interface ScreenNodeData {
  label: string;
  backgroundColor?: string;
  isOwn?: boolean;
  ownerName?: string;
  isPublished?: boolean;
  blockHandles?: BlockHandle[];
}

function ScreenNodeComponent({ data }: NodeProps) {
  const d = data as unknown as ScreenNodeData;
  const handles = d.blockHandles ?? [];
  const sourceHandles = handles.filter(h => h.type === 'source');
  const targetHandles = handles.filter(h => h.type === 'target');

  return (
    <div className="group relative">
      {/* 기본 연결 핸들 (블록 없을 때 폴백) */}
      {handles.length === 0 && (
        <>
          <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white" />
          <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white" />
        </>
      )}

      {/* 타겟 블록 핸들 (왼쪽) — 진입점 */}
      {targetHandles.map((h, i) => (
        <Handle
          key={h.id}
          id={h.id}
          type="target"
          position={Position.Left}
          className="!w-2 !h-2 !bg-green-500 !border !border-white"
          style={{ top: `${30 + i * 24}px` }}
        />
      ))}

      {/* 소스 블록 핸들 (오른쪽) — 네비게이션 */}
      {sourceHandles.map((h, i) => (
        <Handle
          key={h.id}
          id={h.id}
          type="source"
          position={Position.Right}
          className="!w-2 !h-2 !bg-orange-500 !border !border-white"
          style={{ top: `${30 + i * 24}px` }}
        />
      ))}

      {/* 폰 프레임 미니 */}
      <div
        className={`w-[140px] rounded-xl border-2 overflow-hidden transition-shadow
          ${d.isOwn ? 'border-gray-800 hover:shadow-xl' : 'border-gray-400 hover:shadow-lg'}
          bg-white cursor-pointer`}
        style={{ minHeight: Math.max(180, 60 + Math.max(sourceHandles.length, targetHandles.length) * 24) }}
      >
        {/* 화면 영역 */}
        <div
          className="w-full"
          style={{
            backgroundColor: d.backgroundColor || '#FAFAFA',
            height: Math.max(120, 30 + Math.max(sourceHandles.length, targetHandles.length) * 24),
          }}
        >
          {/* 블록 라벨 */}
          <div className="px-2 pt-2 space-y-1">
            {targetHandles.map(h => (
              <div key={h.id} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-[8px] text-gray-500 truncate">{h.label}</span>
              </div>
            ))}
            {sourceHandles.map(h => (
              <div key={h.id} className="flex items-center gap-1 justify-end">
                <span className="text-[8px] text-gray-500 truncate">{h.label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* 이름 바 */}
        <div className="h-[32px] border-t border-gray-200 flex items-center justify-center px-2 bg-white">
          <span className="text-[11px] font-medium text-gray-900 truncate">{d.label}</span>
        </div>
      </div>

      {/* 소유자 표시 */}
      {d.ownerName && !d.isOwn && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 whitespace-nowrap">
          @{d.ownerName}
        </div>
      )}

      {/* 공개 상태 */}
      <div className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${d.isPublished ? 'bg-green-400' : 'bg-gray-300'}`} />
    </div>
  );
}

export const ScreenNode = memo(ScreenNodeComponent);
