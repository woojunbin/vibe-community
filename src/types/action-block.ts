// ActionBlock 시스템 핵심 타입

export interface ActionBlock {
  id: string;
  trigger: Trigger;
  target: string;        // @컴포넌트명 또는 "_self"
  action: ActionType;
  params: Record<string, unknown>;
  order: number;
  enabled: boolean;
}

export type Trigger =
  | { type: 'onPress'; source: string }
  | { type: 'onLongPress'; source: string }
  | { type: 'onLoad' }
  | { type: 'onChange'; source: string }
  | { type: 'onSwipe'; source: string; direction: 'left' | 'right' | 'up' | 'down' }
  | { type: 'onSubmit'; source: string }
  | { type: 'onFocus'; source: string }
  | { type: 'onBlur'; source: string };

export type TriggerType = Trigger['type'];

export type ActionType =
  // Transform
  | 'rotate' | 'scale' | 'move' | 'resize' | 'flip'
  // Visibility
  | 'show' | 'hide' | 'toggle' | 'fadeIn' | 'fadeOut'
  // Style
  | 'changeColor' | 'changeBgColor' | 'changeBorder'
  | 'changeOpacity' | 'changeFontSize' | 'changeShadow'
  // Content
  | 'setText' | 'setImage' | 'setValue' | 'append' | 'clear' | 'setPlaceholder'
  // Navigation
  | 'navigate' | 'goBack' | 'openModal' | 'closeModal' | 'openLink'
  // Data
  | 'setState' | 'getState' | 'setLocal' | 'increment' | 'decrement'
  // Form
  | 'validate' | 'submit' | 'reset' | 'focus' | 'blur' | 'enable' | 'disable'
  // List
  | 'addItem' | 'removeItem' | 'sortBy' | 'filterBy' | 'scrollTo' | 'refresh'
  // Animation
  | 'bounce' | 'shake' | 'pulse' | 'slide' | 'spin' | 'typewriter'
  // Timer
  | 'delay' | 'interval' | 'countdown' | 'debounce';

export type ParamType =
  | 'number' | 'color' | 'string' | 'select'
  | 'toggle' | 'component_ref' | 'screen_ref' | 'url';

export interface ParamDef {
  key: string;
  label: string;
  type: ParamType;
  default: unknown;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[];
  placeholder?: string;
}

export interface ActionDef {
  action: ActionType;
  category: ActionCategory;
  label: string;
  params: ParamDef[];
  inlineParams: string[];
  isChaining?: boolean;
}

export type ActionCategory =
  | 'Transform' | 'Visibility' | 'Style' | 'Content'
  | 'Navigation' | 'Data' | 'Form' | 'List'
  | 'Animation' | 'Timer';

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  onPress: '누르면',
  onLongPress: '길게 누르면',
  onLoad: '화면 진입 시',
  onChange: '변경되면',
  onSwipe: '스와이프하면',
  onSubmit: '제출하면',
  onFocus: '포커스되면',
  onBlur: '포커스 해제되면',
};
