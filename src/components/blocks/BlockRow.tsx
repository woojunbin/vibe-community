'use client';

import { GripVertical, MoreHorizontal, X } from 'lucide-react';
import type { ActionBlock, ParamDef } from '@/types/action-block';
import { getActionDef } from '@/utils/action-catalog';
import { InlineParam } from './InlineParam';

interface BlockRowProps {
  block: ActionBlock;
  onUpdate: (id: string, updates: Partial<ActionBlock>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  componentNames: string[];
}

export function BlockRow({ block, onUpdate, onRemove, onDuplicate, componentNames }: BlockRowProps) {
  const def = getActionDef(block.action);
  if (!def) return null;

  const inlineDefs = def.params.filter(p => def.inlineParams.includes(p.key));

  function updateParam(key: string, value: unknown) {
    onUpdate(block.id, { params: { ...block.params, [key]: value } });
  }

  return (
    <div
      className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-all
        ${block.enabled
          ? 'border-gray-200 bg-white hover:border-gray-300'
          : 'border-gray-100 bg-gray-50 opacity-40'
        }`}
    >
      {/* 드래그 핸들 */}
      <button className="cursor-grab text-gray-300 hover:text-gray-500 shrink-0">
        <GripVertical size={14} />
      </button>

      {/* 타겟 */}
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 shrink-0">
        @{block.target === '_self' ? 'self' : block.target}
      </span>

      {/* 액션 */}
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 shrink-0">
        /{block.action}
      </span>

      {/* 인라인 파라미터 */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {inlineDefs.map((paramDef: ParamDef) => (
          <InlineParam
            key={paramDef.key}
            paramDef={paramDef}
            value={block.params[paramDef.key] ?? paramDef.default}
            onChange={(v) => updateParam(paramDef.key, v)}
            componentNames={componentNames}
          />
        ))}
      </div>

      {/* 더보기 */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 transition-opacity">
        <button
          onClick={() => onDuplicate(block.id)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          title="복제"
        >
          <MoreHorizontal size={12} />
        </button>
        <button
          onClick={() => onRemove(block.id)}
          className="p-1 text-gray-400 hover:text-red-500 rounded"
          title="삭제"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
