import { useState, useCallback, useRef, useEffect } from 'react';
import type { Screen } from '@/types/project';
import { BlockRuntime, type ComponentState } from './block-runtime';

interface PreviewConnection {
  sourceBlockId: string;
  targetScreenId: string;
  targetBlockId?: string;
}

export function usePreview(
  screens: Screen[],
  connections: PreviewConnection[],
  initialScreenId: string,
) {
  const [, forceUpdate] = useState(0);
  const runtimeRef = useRef<BlockRuntime | null>(null);

  const rerender = useCallback(() => {
    forceUpdate(n => n + 1);
  }, []);

  useEffect(() => {
    runtimeRef.current = new BlockRuntime(screens, connections, initialScreenId, rerender);
    runtimeRef.current.triggerScreenLoad();
    rerender();
  }, [screens, connections, initialScreenId, rerender]);

  const trigger = useCallback((componentId: string, triggerType: string) => {
    runtimeRef.current?.trigger(componentId, triggerType);
  }, []);

  const runtime = runtimeRef.current;

  return {
    currentScreen: runtime?.getCurrentScreen() ?? null,
    modalScreen: runtime?.getModalScreen() ?? null,
    currentScreenId: runtime?.state.currentScreenId ?? initialScreenId,
    componentStates: runtime?.state.componentStates ?? new Map<string, ComponentState>(),
    globalState: runtime?.state.globalState ?? new Map<string, unknown>(),
    screenHistory: runtime?.state.screenHistory ?? [],
    trigger,
  };
}
