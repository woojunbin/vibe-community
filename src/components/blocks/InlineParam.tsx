'use client';

import type { ParamDef } from '@/types/action-block';

interface InlineParamProps {
  paramDef: ParamDef;
  value: unknown;
  onChange: (value: unknown) => void;
  componentNames: string[];
}

export function InlineParam({ paramDef, value, onChange, componentNames }: InlineParamProps) {
  switch (paramDef.type) {
    case 'number':
      return (
        <span className="inline-flex items-center gap-0.5">
          <input
            type="number"
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            min={paramDef.min}
            max={paramDef.max}
            step={paramDef.step}
            className="w-14 px-1.5 py-0.5 text-xs border border-gray-200 rounded text-gray-900 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {paramDef.unit && <span className="text-[10px] text-gray-500">{paramDef.unit}</span>}
        </span>
      );

    case 'color':
      return (
        <input
          type="color"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-5 rounded cursor-pointer border border-gray-200"
        />
      );

    case 'string':
    case 'url':
      return (
        <input
          type="text"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={paramDef.placeholder}
          className="flex-1 min-w-0 px-1.5 py-0.5 text-xs border border-gray-200 rounded text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      );

    case 'select':
      return (
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="px-1.5 py-0.5 text-xs border border-gray-200 rounded text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {paramDef.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case 'toggle':
      return (
        <button
          onClick={() => onChange(!value)}
          className={`w-8 h-4 rounded-full relative transition-colors ${value ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      );

    case 'component_ref':
      return (
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="px-1.5 py-0.5 text-xs border border-gray-200 rounded text-blue-700 bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">컴포넌트 선택</option>
          {componentNames.map(name => (
            <option key={name} value={name}>@{name}</option>
          ))}
        </select>
      );

    case 'screen_ref':
      return (
        <input
          type="text"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder="화면 이름"
          className="w-20 px-1.5 py-0.5 text-xs border border-gray-200 rounded text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      );

    default:
      return null;
  }
}
