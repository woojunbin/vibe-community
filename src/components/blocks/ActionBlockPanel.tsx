'use client';

import { useState, useRef, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import type { ActionBlock } from '@/types/action-block';
import { TRIGGER_LABELS } from '@/types/action-block';
import { ACTION_CATALOG, ACTION_CATEGORIES, CATEGORY_LABELS, getActionDef } from '@/utils/action-catalog';
import { BlockRow } from './BlockRow';

interface ActionBlockPanelProps {
  blocks: ActionBlock[];
  onChange: (blocks: ActionBlock[]) => void;
  componentNames: string[];
  selectedComponentName: string;
  selectedComponentId: string;
  screenNames?: string[];
}

export function ActionBlockPanel({ blocks, onChange, componentNames, selectedComponentName, selectedComponentId, screenNames = [] }: ActionBlockPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteFilter, setAutocompleteFilter] = useState('');
  const [newTriggerType, setNewTriggerType] = useState<string>('onPress');
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerGroups = useMemo(() => {
    const groups: Record<string, ActionBlock[]> = {};
    for (const b of blocks) {
      const key = b.trigger.type + ('source' in b.trigger ? '_' + b.trigger.source : '');
      if (!groups[key]) groups[key] = [];
      groups[key].push(b);
    }
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.order - b.order);
    }
    return groups;
  }, [blocks]);

  function handleInputChange(val: string) {
    setInputValue(val);
    if (val.startsWith('/')) {
      setAutocompleteFilter(val.slice(1).toLowerCase());
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  }

  function handleSelectAction(actionType: string) {
    const def = getActionDef(actionType);
    if (!def) return;

    const params: Record<string, unknown> = {};
    for (const p of def.params) {
      params[p.key] = p.default;
    }

    const atMatch = inputValue.match(/@(\S+)/);
    const target = atMatch ? atMatch[1] : selectedComponentName || '_self';

    const newBlock: ActionBlock = {
      id: uuid(),
      componentId: selectedComponentId,
      trigger: newTriggerType === 'onLoad'
        ? { type: 'onLoad' as const }
        : { type: newTriggerType as 'onPress', source: selectedComponentName || '_self' },
      target,
      action: actionType as ActionBlock['action'],
      params,
      order: blocks.length,
      enabled: true,
    };

    onChange([...blocks, newBlock]);
    setInputValue('');
    setShowAutocomplete(false);
  }

  function updateBlock(id: string, updates: Partial<ActionBlock>) {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  }

  function removeBlock(id: string) {
    onChange(blocks.filter(b => b.id !== id));
  }

  function duplicateBlock(id: string) {
    const original = blocks.find(b => b.id === id);
    if (!original) return;
    const dup: ActionBlock = { ...original, id: uuid(), order: original.order + 0.5 };
    const updated = [...blocks, dup].sort((a, b) => a.order - b.order).map((b, i) => ({ ...b, order: i }));
    onChange(updated);
  }

  const filteredActions = useMemo(() => {
    const all = autocompleteFilter
      ? ACTION_CATALOG.filter(a => a.action.toLowerCase().includes(autocompleteFilter) || a.label.includes(autocompleteFilter))
      : ACTION_CATALOG;
    return all.slice(0, 12);
  }, [autocompleteFilter]);

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(triggerGroups).map(([key, groupBlocks]) => {
        const first = groupBlocks[0];
        const triggerLabel = TRIGGER_LABELS[first.trigger.type];
        const source = 'source' in first.trigger ? first.trigger.source : '';

        return (
          <div key={key} className="space-y-1">
            <div className="flex items-center gap-1.5 px-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              {source && <span className="text-xs font-medium text-blue-700">@{source}</span>}
              <span className="text-xs text-gray-500">{triggerLabel}</span>
            </div>

            {groupBlocks.map(block => (
              <BlockRow
                key={block.id}
                block={block}
                onUpdate={updateBlock}
                onRemove={removeBlock}
                onDuplicate={duplicateBlock}
                componentNames={componentNames}
              />
            ))}
          </div>
        );
      })}

      {blocks.length === 0 && (
        <p className="text-xs text-gray-500 text-center py-3">동작 블록이 없습니다</p>
      )}

      <div className="flex items-center gap-1.5 mt-2">
        <select
          value={newTriggerType}
          onChange={(e) => setNewTriggerType(e.target.value)}
          className="px-1.5 py-2 text-xs border border-gray-200 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="onPress">누르면</option>
          <option value="onLoad">화면 진입 시</option>
          <option value="onChange">변경되면</option>
          <option value="onSubmit">제출하면</option>
          <option value="onFocus">포커스되면</option>
          <option value="onBlur">포커스 해제</option>
        </select>
      </div>

      <div className="relative mt-1">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setShowAutocomplete(false); setInputValue(''); }
          }}
          placeholder="/ 또는 자연어로 동작 추가..."
          className="w-full px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />

        {showAutocomplete && (
          <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
            {ACTION_CATEGORIES.map(cat => {
              const catActions = filteredActions.filter(a => a.category === cat);
              if (catActions.length === 0) return null;
              return (
                <div key={cat}>
                  <div className="px-3 py-1 text-[10px] font-medium text-gray-500 uppercase bg-gray-50">
                    {CATEGORY_LABELS[cat]}
                  </div>
                  {catActions.map(a => (
                    <button
                      key={a.action}
                      onClick={() => handleSelectAction(a.action)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-blue-50"
                    >
                      <span className="text-xs font-mono text-purple-600">/{a.action}</span>
                      <span className="text-xs text-gray-700">{a.label}</span>
                    </button>
                  ))}
                </div>
              );
            })}
            {filteredActions.length === 0 && (
              <div className="px-3 py-3 text-xs text-gray-500 text-center">일치하는 액션 없음</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
