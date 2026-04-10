'use client';

import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { Button } from '@/components/ui/Button';
import { ActionBlockPanel } from '@/components/blocks/ActionBlockPanel';
import type { ActionBlock } from '@/types/action-block';

type Tab = 'props' | 'blocks' | 'style';

export function PropertiesPanel() {
  const [tab, setTab] = useState<Tab>('props');
  const screen = useEditorStore((s) => s.screen);
  const selectedId = useEditorStore((s) => s.selectedComponentId);
  const updateComponent = useEditorStore((s) => s.updateComponent);
  const removeComponent = useEditorStore((s) => s.removeComponent);
  const selectComponent = useEditorStore((s) => s.selectComponent);

  const component = screen?.components.find((c) => c.id === selectedId);
  if (!component) return null;

  const s = component.style as Record<string, string>;
  const p = component.props;
  const componentNames = screen?.components.map(c => c.name) ?? [];

  function updateProp(key: string, value: string) {
    updateComponent(component!.id, { props: { ...component!.props, [key]: value } });
  }

  function updateStyle(key: string, value: string) {
    updateComponent(component!.id, { style: { ...component!.style, [key]: value } });
  }

  // ActionBlocks는 behavior 필드에 JSON으로 저장 (기존 호환)
  const actionBlocks: ActionBlock[] = (() => {
    try {
      if (component.behavior && component.behavior.startsWith('[')) {
        return JSON.parse(component.behavior);
      }
    } catch { /* ignore */ }
    return [];
  })();

  function handleBlocksChange(blocks: ActionBlock[]) {
    updateComponent(component!.id, { behavior: JSON.stringify(blocks) });
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'props', label: '속성' },
    { key: 'blocks', label: '동작' },
    { key: 'style', label: '스타일' },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="font-semibold text-sm text-gray-900">{component.name}</h3>
        <button onClick={() => selectComponent(null)} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-gray-200 px-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
              ${tab === t.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'props' && (
          <div className="space-y-3">
            {component.type === 'text' && (
              <LabeledInput label="텍스트" value={p.content || ''} onChange={(v) => updateProp('content', v)} />
            )}
            {component.type === 'button' && (
              <LabeledInput label="라벨" value={p.label || ''} onChange={(v) => updateProp('label', v)} />
            )}
            {component.type === 'input' && (
              <LabeledInput label="플레이스홀더" value={p.placeholder || ''} onChange={(v) => updateProp('placeholder', v)} />
            )}
            {component.type === 'image' && (
              <LabeledInput label="이미지 URL" value={p.src || ''} onChange={(v) => updateProp('src', v)} />
            )}
            {component.type === 'icon' && (
              <LabeledInput label="아이콘" value={p.iconName || ''} onChange={(v) => updateProp('iconName', v)} />
            )}
            <LabeledInput label="이름" value={component.name} onChange={(v) => updateComponent(component.id, { name: v })} />
          </div>
        )}

        {tab === 'blocks' && (
          <ActionBlockPanel
            blocks={actionBlocks}
            onChange={handleBlocksChange}
            componentNames={componentNames}
            selectedComponentName={component.name}
          />
        )}

        {tab === 'style' && (
          <div className="space-y-3">
            <LabeledColor label="배경색" value={s.backgroundColor || ''} onChange={(v) => updateStyle('backgroundColor', v)} />
            <LabeledColor label="글자색" value={s.color || ''} onChange={(v) => updateStyle('color', v)} />
            <LabeledInput label="글자 크기" value={String(s.fontSize || '')} onChange={(v) => updateStyle('fontSize', v)} type="number" />
            <LabeledInput label="테두리 라운드" value={String(s.borderRadius || '')} onChange={(v) => updateStyle('borderRadius', v)} type="number" />
            <LabeledInput label="테두리 두께" value={String(s.borderWidth || '')} onChange={(v) => updateStyle('borderWidth', v)} type="number" />
            <LabeledColor label="테두리 색상" value={s.borderColor || ''} onChange={(v) => updateStyle('borderColor', v)} />
          </div>
        )}
      </div>

      {/* 삭제 */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="danger"
          size="sm"
          className="w-full"
          onClick={() => { removeComponent(component.id); selectComponent(null); }}
        >
          <Trash2 size={14} className="mr-1" /> 삭제
        </Button>
      </div>
    </div>
  );
}

function LabeledInput({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-gray-600 font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-0.5 px-2 py-1.5 text-sm border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </label>
  );
}

function LabeledColor({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="color"
        value={value || '#ffffff'}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 rounded cursor-pointer border border-gray-200"
      />
      <span className="text-xs text-gray-600 font-medium">{label}</span>
    </label>
  );
}
