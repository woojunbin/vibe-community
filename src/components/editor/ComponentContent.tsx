'use client';

import type { AppComponent } from '@/types/project';

export function ComponentContent({ component }: { component: AppComponent }) {
  const s = component.style as Record<string, string>;
  const p = component.props;
  const textColor = s.color || '#111827';
  const fontSize = Number(s.fontSize) || 13;
  const textAlign = (s.textAlign || 'center') as 'left' | 'center' | 'right';
  const fontWeight = (s.fontWeight as 'normal' | 'bold') || undefined;

  switch (component.type) {
    case 'text':
      return (
        <span style={{ fontSize, color: textColor, fontWeight, textAlign, padding: '0 8px', wordBreak: 'break-word', width: '100%', display: 'block' }}>
          {p.content || component.name}
        </span>
      );
    case 'button':
      return (
        <span style={{ fontSize, color: textColor, fontWeight: fontWeight || 600, textAlign }}>
          {p.label || component.name}
        </span>
      );
    case 'input':
      return (
        <span style={{ fontSize, color: '#6b7280', padding: '0 8px' }}>
          {p.placeholder || 'placeholder...'}
        </span>
      );
    case 'image':
      return p.src
        ? <img src={p.src} alt="" style={{ width: '100%', height: '100%', objectFit: p.objectFit || 'cover', borderRadius: 'inherit', pointerEvents: 'none' }} />
        : <span className="text-xs text-gray-400">이미지 URL 없음</span>;
    case 'icon':
      return <span style={{ fontSize: 24, color: textColor }}>{p.iconName || '☆'}</span>;
    case 'list':
      return (
        <div style={{ width: '100%', padding: '4px 8px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded" style={{ height: (p.itemHeight ?? 40) * 0.3, marginBottom: 4 }} />
          ))}
        </div>
      );
    case 'video':
      return p.src
        ? <video src={p.src} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} muted />
        : <span className="text-xs text-gray-400">동영상 없음</span>;
    case 'table': {
      const headers = p.csvHeaders ?? [];
      const rows = p.csvRows ?? [];
      if (headers.length === 0) return <span className="text-xs text-gray-400">CSV 없음</span>;
      return (
        <div className="w-full h-full overflow-hidden">
          <table className="border-collapse w-full" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                {headers.slice(0, 5).map((h) => (
                  <th key={h} className="px-1 py-0.5 text-left font-semibold text-gray-700" style={{ fontSize: 9 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 4).map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {row.slice(0, 5).map((cell, j) => (
                    <td key={j} className="px-1 py-0.5 text-gray-500 truncate" style={{ fontSize: 9, maxWidth: 60 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    default:
      return <span className="text-xs text-gray-400">{component.name}</span>;
  }
}
