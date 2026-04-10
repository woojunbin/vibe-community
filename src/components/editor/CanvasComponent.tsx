'use client';

import { useDraggable } from '@dnd-kit/core';
import type { AppComponent } from '@/types/project';
import { ComponentContent } from './ComponentContent';

interface CanvasComponentProps {
  component: AppComponent;
  selected: boolean;
  onSelect: () => void;
}

export function CanvasComponent({ component, selected, onSelect }: CanvasComponentProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: component.id,
    data: { type: 'canvas-component', component },
  });

  const s = component.style as Record<string, string>;
  const tx = transform?.x ?? 0;
  const ty = transform?.y ?? 0;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        left: component.position.x + tx,
        top: component.position.y + ty,
        width: component.size.width,
        height: component.size.height,
        backgroundColor: s.backgroundColor || 'transparent',
        borderRadius: Number(s.borderRadius) || 0,
        border: s.borderWidth ? `${s.borderWidth}px solid ${s.borderColor || '#000'}` : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: selected ? '2px solid #2563EB' : '1px solid transparent',
        outlineOffset: 1,
        transition: 'outline 100ms',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <ComponentContent component={component} />
    </div>
  );
}
