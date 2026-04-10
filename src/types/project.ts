import type { Block } from './action-block';

export interface Position { x: number; y: number }
export interface Size { width: number; height: number }

export type ComponentType =
  | 'button' | 'text' | 'image' | 'input'
  | 'container' | 'list' | 'icon' | 'video' | 'table';

export interface ComponentProps {
  content?: string;
  label?: string;
  placeholder?: string;
  inputType?: 'text' | 'password' | 'email' | 'number';
  src?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  dataSource?: string;
  itemHeight?: number;
  iconName?: string;
  csvHeaders?: string[];
  csvRows?: string[][];
}

export interface AppComponent {
  id: string;
  type: ComponentType;
  name: string;
  position: Position;
  size: Size;
  style: Record<string, unknown>;
  props: ComponentProps;
  blocks: Block[];
  /** @deprecated — behavior 문자열은 blocks 배열로 대체됨. 마이그레이션 호환용. */
  behavior?: string;
}

export interface Screen {
  id: string;
  name: string;
  components: AppComponent[];
  canvasSize?: { width: number; height: number };
  backgroundColor?: string;
}
