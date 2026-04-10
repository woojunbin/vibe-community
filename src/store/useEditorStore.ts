import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { AppComponent, Screen, ComponentType, Position, Size, ComponentProps } from '@/types/project';

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

  markClean: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  screen: null,
  selectedComponentId: null,
  isDirty: false,

  loadScreen: (screen) => set({ screen, selectedComponentId: null, isDirty: false }),
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
      behavior: '',
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

  markClean: () => set({ isDirty: false }),
}));
