'use client';

import type { AppComponent } from '@/types/project';

interface ScreenThumbnailProps {
  components: AppComponent[];
  backgroundColor?: string;
  width?: number;
  height?: number;
}

export function ScreenThumbnail({
  components,
  backgroundColor = '#FAFAFA',
  width = 375,
  height = 812,
}: ScreenThumbnailProps) {
  const scale = 0.3;

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div
        style={{
          width: width * scale,
          height: height * scale,
          backgroundColor,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
        }}
      >
        {components.map((comp) => (
          <div
            key={comp.id}
            style={{
              position: 'absolute',
              left: comp.position.x * scale,
              top: comp.position.y * scale,
              width: comp.size.width * scale,
              height: comp.size.height * scale,
              backgroundColor: comp.type === 'button' ? '#2563EB' :
                comp.type === 'input' ? '#f3f4f6' :
                comp.type === 'image' ? '#d1d5db' :
                comp.type === 'container' ? '#f9fafb' : 'transparent',
              borderRadius: 2,
              border: comp.type === 'input' ? '1px solid #d1d5db' : undefined,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {comp.type === 'text' && (
              <span style={{ fontSize: 4, color: '#374151' }}>
                {comp.props.content || comp.name}
              </span>
            )}
            {comp.type === 'button' && (
              <span style={{ fontSize: 3, color: '#fff' }}>
                {comp.props.label || comp.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
