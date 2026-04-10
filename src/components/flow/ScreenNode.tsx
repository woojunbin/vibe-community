'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface BlockHandle {
  id: string;           // "block__{blockId}"
  label: string;        // "버튼.navigate" 등
  side: 'left' | 'right';  // left=입력(트리거), right=출력(액션)
  color: string;        // 카테고리별 색상
  componentName: string;
  triggerType?: string;
  actionType?: string;
}

interface ScreenNodeData {
  label: string;
  backgroundColor?: string;
  isOwn?: boolean;
  ownerName?: string;
  isPublished?: boolean;
  blockHandles?: BlockHandle[];
  onRename?: (newName: string) => void;
}

// 액션 카테고리별 색상
const ACTION_COLORS: Record<string, string> = {
  navigate: '#f97316', goBack: '#f97316', openModal: '#f97316', closeModal: '#f97316', openLink: '#f97316',
  show: '#8b5cf6', hide: '#8b5cf6', toggle: '#8b5cf6', fadeIn: '#8b5cf6', fadeOut: '#8b5cf6',
  setText: '#06b6d4', setImage: '#06b6d4', setValue: '#06b6d4', clear: '#06b6d4',
  changeColor: '#ec4899', changeBgColor: '#ec4899', changeBorder: '#ec4899',
  setState: '#10b981', getState: '#10b981', increment: '#10b981', decrement: '#10b981',
  bounce: '#eab308', shake: '#eab308', pulse: '#eab308', spin: '#eab308',
  delay: '#6b7280', interval: '#6b7280',
  validate: '#ef4444', submit: '#ef4444',
  default: '#3b82f6',
};

export function getBlockColor(action: string): string {
  return ACTION_COLORS[action] || ACTION_COLORS.default;
}

function ScreenNodeComponent({ data }: NodeProps) {
  const d = data as unknown as ScreenNodeData;
  const handles = d.blockHandles ?? [];
  const leftHandles = handles.filter(h => h.side === 'left');
  const rightHandles = handles.filter(h => h.side === 'right');
  const maxHandles = Math.max(leftHandles.length, rightHandles.length, 1);
  const contentHeight = Math.max(100, maxHandles * 26 + 20);

  return (
    <div className="group relative">
      {/* 좌측 핸들 (트리거 입력) */}
      {leftHandles.map((h, i) => (
        <Handle
          key={h.id}
          id={h.id}
          type="target"
          position={Position.Left}
          className="!w-2.5 !h-2.5 !border-2 !border-white"
          style={{ top: `${20 + i * 26}px`, backgroundColor: h.color }}
        />
      ))}

      {/* 우측 핸들 (액션 출력) */}
      {rightHandles.map((h, i) => (
        <Handle
          key={h.id}
          id={h.id}
          type="source"
          position={Position.Right}
          className="!w-2.5 !h-2.5 !border-2 !border-white"
          style={{ top: `${20 + i * 26}px`, backgroundColor: h.color }}
        />
      ))}

      {/* 핸들 없으면 기본 연결점 */}
      {handles.length === 0 && (
        <>
          <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-gray-400 !border-2 !border-white" />
          <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-gray-400 !border-2 !border-white" />
        </>
      )}

      {/* 카드 */}
      <div
        className={`w-[180px] rounded-xl border-2 overflow-hidden transition-shadow
          ${d.isOwn !== false ? 'border-gray-800 hover:shadow-xl' : 'border-gray-400 hover:shadow-lg'}
          bg-white cursor-pointer`}
      >
        {/* 블록 영역 */}
        <div
          className="w-full px-2 py-2 space-y-1"
          style={{ backgroundColor: d.backgroundColor || '#FAFAFA', minHeight: contentHeight }}
        >
          {handles.length === 0 && (
            <div className="flex items-center justify-center h-full text-[9px] text-gray-400">
              블록 없음
            </div>
          )}

          {/* 좌측 블록 라벨 */}
          {leftHandles.map(h => (
            <div key={h.id} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: h.color }} />
              <span className="text-[9px] text-gray-600 truncate">{h.label}</span>
            </div>
          ))}

          {/* 우측 블록 라벨 */}
          {rightHandles.map(h => (
            <div key={h.id} className="flex items-center gap-1 justify-end">
              <span className="text-[9px] text-gray-600 truncate">{h.label}</span>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: h.color }} />
            </div>
          ))}
        </div>

        {/* 이름 바 */}
        <div className="h-[32px] border-t border-gray-200 flex items-center justify-center px-2 bg-white">
          <span className="text-[11px] font-semibold text-gray-900 truncate">{d.label}</span>
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
