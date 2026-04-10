'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface ScreenNodeData {
  label: string;
  backgroundColor?: string;
  isOwn?: boolean;
  ownerName?: string;
  isPublished?: boolean;
}

function ScreenNodeComponent({ data }: NodeProps) {
  const d = data as unknown as ScreenNodeData;

  return (
    <div className="group relative">
      {/* 연결 핸들 */}
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white" />
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white" />
      <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white" />

      {/* 폰 프레임 미니 */}
      <div
        className={`w-[140px] h-[180px] rounded-xl border-2 overflow-hidden transition-shadow
          ${d.isOwn ? 'border-gray-800 hover:shadow-xl' : 'border-gray-400 hover:shadow-lg'}
          bg-white cursor-pointer`}
      >
        {/* 화면 영역 */}
        <div
          className="w-full h-[148px]"
          style={{ backgroundColor: d.backgroundColor || '#FAFAFA' }}
        />

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
