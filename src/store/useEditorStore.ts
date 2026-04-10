import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { AppComponent, Screen, ComponentType, Position, Size, ComponentProps } from '@/types/project';
import type { Block } from '@/types/action-block';

/** behavior 문자열 → blocks 배열 마이그레이션 */
function migrateComponent(comp: AppComponent): AppComponent {
  if (comp.blocks && Array.isArray(comp.blocks)) return comp;
  let blocks: Block[] = [];
  if (comp.behavior && typeof comp.behavior === 'string' && comp.behavior.startsWith('[')) {
    try {
      const parsed = JSON.parse(comp.behavior) as Block[];
      blocks = parsed.map(b => ({
        ...b,
        componentId: b.componentId || comp.id,
      }));
    } catch { /* ignore */ }
  }
  return { ...comp, blocks, behavior: undefined };
}

function migrateScreen(screen: Screen): Screen {
  return {
    ...screen,
    components: screen.components.map(migrateComponent),
  };
}

interface EditorState {
  screen: Screen | null;
  selectedComponentId: string | null;
  isDirty: boolean;

  loadScreen: (screen: Screen) => void;
  reset: () => void;

  selectComponent: (id: string | null) => void;
  setScreenName: (name: string) => void;
  setBackground: (color: string) => void;
  setCanvasSize: (w: number, h: number) => void;

  addComponent: (type: ComponentType, name: string, position: Position, size: Size, props?: ComponentProps) => string;
  updateComponent: (compId: string, updates: Partial<AppComponent>) => void;
  removeComponent: (compId: string) => void;

  // 블록 CRUD
  addBlock: (compId: string, block: Block) => void;
  updateBlock: (compId: string, blockId: string, updates: Partial<Block>) => void;
  removeBlock: (compId: string, blockId: string) => void;
  setBlocks: (compId: string, blocks: Block[]) => void;

  markClean: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  screen: null,
  selectedComponentId: null,
  isDirty: false,

  loadScreen: (screen) => set({ screen: migrateScreen(screen), selectedComponentId: null, isDirty: false }),
  reset: () => set({ screen: null, selectedComponentId: null, isDirty: false }),

  selectComponent: (id) => set({ selectedComponentId: id }),
  setScreenName: (name) => set((s) => {
    if (!s.screen) return s;
    return { screen: { ...s.screen, name }, isDirty: true };
  }),
  setBackground: (color) => set((s) => {
    if (!s.screen) return s;
    return { screen: { ...s.screen, backgroundColor: color }, isDirty: true };
  }),
  setCanvasSize: (w, h) => set((s) => {
    if (!s.screen) return s;
    return { screen: { ...s.screen, canvasSize: { width: w, height: h } }, isDirty: true };
  }),

  addComponent: (type, name, position, size, props) => {
    const id = uuid();
    const comp: AppComponent = {
      id, type, name, position, size,
      style: {},
      props: props ?? {},
      blocks: [],
    };
    set((s) => {
      if (!s.screen) return s;
      return {
        screen: { ...s.screen, components: [...s.screen.components, comp] },
        isDirty: true,
        selectedComponentId: id,
      };
    });
    return id;
  },

  updateComponent: (compId, updates) => set((s) => {
    if (!s.screen) return s;
    return {
      screen: {
        ...s.screen,
        components: s.screen.components.map(c =>
          c.id === compId ? { ...c, ...updates } : c,
        ),
      },
      isDirty: true,
    };
  }),

  removeComponent: (compId) => set((s) => {
    if (!s.screen) return s;
    return {
      screen: {
        ...s.screen,
        components: s.screen.components.filter(c => c.id !== compId),
      },
      selectedComponentId: s.selectedComponentId === compId ? null : s.selectedComponentId,
      isDirty: true,
    };
  }),

  // 블록 CRUD
  addBlock: (compId, block) => set((s) => {
    if (!s.screen) return s;
    return {
      screen: {
        ...s.screen,
        components: s.screen.components.map(c =>
          c.id === compId ? { ...c, blocks: [...c.blocks, { ...block, componentId: compId }] } : c,
        ),
      },
      isDirty: true,
    };
  }),

  updateBlock: (compId, blockId, updates) => set((s) => {
    if (!s.screen) return s;
    return {
      screen: {
        ...s.screen,
        components: s.screen.components.map(c =>
          c.id === compId
            ? { ...c, blocks: c.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b) }
            : c,
        ),
      },
      isDirty: true,
    };
  }),

  removeBlock: (compId, blockId) => set((s) => {
    if (!s.screen) return s;
    return {
      screen: {
        ...s.screen,
        components: s.screen.components.map(c =>
          c.id === compId
            ? { ...c, blocks: c.blocks.filter(b => b.id !== blockId) }
            : c,
        ),
      },
      isDirty: true,
    };
  }),

  setBlocks: (compId, blocks) => set((s) => {
    if (!s.screen) return s;
    return {
      screen: {
        ...s.screen,
        components: s.screen.components.map(c =>
          c.id === compId ? { ...c, blocks } : c,
        ),
      },
      isDirty: true,
    };
  }),

  markClean: () => set({ isDirty: false }),
}));
