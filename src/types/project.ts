// 기존 VibeBuilder에서 이식한 핵심 타입
// 나중에 데스크톱 앱과 합칠 때 공유 타입으로 사용

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
  behavior: string;
}

export interface Screen {
  id: string;
  name: string;
  components: AppComponent[];
  canvasSize?: { width: number; height: number };
  backgroundColor?: string;
}
