'use client';

import { useCallback, useEffect } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEditorStore } from '@/store/useEditorStore';
import { PhoneFrame } from './PhoneFrame';
import { CanvasComponent } from './CanvasComponent';
import { PropertiesPanel } from './PropertiesPanel';
import { Palette } from '@/components/palette/Palette';
import type { PaletteItem } from '@/components/palette/palette-data';

interface PageEditorProps {
  screenId: string;
}

export function PageEditor({ screenId: _screenId }: PageEditorProps) {
  const screen = useEditorStore((s) => s.screen);
  const selectComponent = useEditorStore((s) => s.selectComponent);
  const selectedId = useEditorStore((s) => s.selectedComponentId);
  const addComponent = useEditorStore((s) => s.addComponent);
  const updateComp = useEditorStore((s) => s.updateComponent);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 3 } }));

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;
    const comp = screen?.components.find((c) => c.id === active.id);
    if (!comp) return;
    updateComp(comp.id, {
      position: {
        x: Math.max(0, comp.position.x + delta.x),
        y: Math.max(0, comp.position.y + delta.y),
      },
    });
  }, [screen, updateComp]);

  const handleAddFromPalette = useCallback((item: PaletteItem) => {
    addComponent(
      item.type,
      item.name,
      { x: 50, y: 100 + (screen?.components.length ?? 0) * 60 },
      item.defaultSize,
    );
  }, [addComponent, screen]);

  // Delete 키로 삭제
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
        e.preventDefault();
        useEditorStore.getState().removeComponent(selectedId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedId]);

  if (!screen) return <div className="flex-1 flex items-center justify-center text-gray-400">로딩 중...</div>;

  return (
    <div className="flex h-full">
      <Palette onAdd={handleAddFromPalette} />

      <div className="flex-1 bg-gray-50 flex items-center justify-center overflow-auto p-8">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <PhoneFrame
            width={screen.canvasSize?.width ?? 375}
            height={screen.canvasSize?.height ?? 812}
            backgroundColor={screen.backgroundColor}
            onClick={() => selectComponent(null)}
          >
            {screen.components.map((comp) => (
              <CanvasComponent
                key={comp.id}
                component={comp}
                selected={selectedId === comp.id}
                onSelect={() => selectComponent(comp.id)}
              />
            ))}
          </PhoneFrame>
        </DndContext>
      </div>

      {selectedId && <PropertiesPanel />}
    </div>
  );
}
