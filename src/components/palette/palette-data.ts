import type { ComponentType } from '@/types/project';

export interface PaletteItem {
  type: ComponentType;
  name: string;
  icon: string;
  defaultSize: { width: number; height: number };
}

export interface PaletteCategory {
  label: string;
  items: PaletteItem[];
}

export const PALETTE_CATEGORIES: PaletteCategory[] = [
  {
    label: '기본 입력',
    items: [
      { type: 'button', name: 'Button', icon: '▣', defaultSize: { width: 160, height: 44 } },
      { type: 'text', name: 'Text', icon: 'T', defaultSize: { width: 200, height: 24 } },
      { type: 'input', name: 'Input', icon: '▭', defaultSize: { width: 280, height: 44 } },
    ],
  },
  {
    label: '미디어',
    items: [
      { type: 'image', name: 'Image', icon: '🖼', defaultSize: { width: 200, height: 150 } },
      { type: 'icon', name: 'Icon', icon: '☆', defaultSize: { width: 32, height: 32 } },
      { type: 'video', name: 'Video', icon: '▶', defaultSize: { width: 280, height: 200 } },
    ],
  },
  {
    label: '레이아웃',
    items: [
      { type: 'container', name: 'Container', icon: '□', defaultSize: { width: 320, height: 200 } },
      { type: 'list', name: 'List', icon: '≡', defaultSize: { width: 320, height: 300 } },
      { type: 'table', name: 'Table', icon: '⊞', defaultSize: { width: 320, height: 200 } },
    ],
  },
];
