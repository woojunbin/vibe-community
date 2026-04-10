import { v4 as uuid } from 'uuid';
import type { Block } from '@/types/action-block';

export interface BlockPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'navigation' | 'form' | 'ui' | 'data' | 'animation';
  /** 생성할 블록들 (componentId는 적용 시 채움) */
  blocks: Omit<Block, 'id' | 'componentId'>[];
}

export const BLOCK_PRESETS: BlockPreset[] = [
  // ── Navigation ──
  {
    id: 'preset-navigate-forward',
    name: '다음 화면으로',
    description: '버튼 누르면 다음 화면으로 이동',
    icon: '→',
    category: 'navigation',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'navigate',
        params: { screen: '' },
        order: 0,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-go-back',
    name: '뒤로 가기',
    description: '버튼 누르면 이전 화면으로',
    icon: '←',
    category: 'navigation',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'goBack',
        params: {},
        order: 0,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-open-modal',
    name: '모달 열기',
    description: '버튼 누르면 모달 화면 표시',
    icon: '⬒',
    category: 'navigation',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'openModal',
        params: { screen: '' },
        order: 0,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-open-link',
    name: '외부 링크',
    description: '버튼 누르면 URL 열기',
    icon: '🔗',
    category: 'navigation',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'openLink',
        params: { url: 'https://' },
        order: 0,
        enabled: true,
      },
    ],
  },

  // ── Form ──
  {
    id: 'preset-login-flow',
    name: '로그인 흐름',
    description: '버튼 누르면 입력값 검증 → 화면 이동',
    icon: '🔐',
    category: 'form',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'validate',
        params: { rule: 'required' },
        order: 0,
        enabled: true,
      },
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'navigate',
        params: { screen: '' },
        order: 1,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-form-submit',
    name: '폼 제출',
    description: '제출 시 검증 → 상태 저장 → 알림',
    icon: '📋',
    category: 'form',
    blocks: [
      {
        trigger: { type: 'onSubmit', source: '_self' },
        target: '_self',
        action: 'validate',
        params: { rule: 'required' },
        order: 0,
        enabled: true,
      },
      {
        trigger: { type: 'onSubmit', source: '_self' },
        target: '_self',
        action: 'setState',
        params: { key: 'formData', value: '' },
        order: 1,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-input-clear',
    name: '입력 초기화',
    description: '버튼 누르면 입력 필드 비우기',
    icon: '✕',
    category: 'form',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'clear',
        params: {},
        order: 0,
        enabled: true,
      },
    ],
  },

  // ── UI ──
  {
    id: 'preset-toggle-visibility',
    name: '보이기/숨기기',
    description: '버튼 누르면 대상 컴포넌트 토글',
    icon: '👁',
    category: 'ui',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'toggle',
        params: {},
        order: 0,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-show-on-load',
    name: '화면 진입 시 표시',
    description: '페이지 로드되면 페이드인 등장',
    icon: '✨',
    category: 'ui',
    blocks: [
      {
        trigger: { type: 'onLoad' },
        target: '_self',
        action: 'fadeIn',
        params: { duration: 300 },
        order: 0,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-color-change',
    name: '색상 변경',
    description: '버튼 누르면 배경색 변경',
    icon: '🎨',
    category: 'ui',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'changeBgColor',
        params: { color: '#2563EB' },
        order: 0,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-set-text',
    name: '텍스트 변경',
    description: '버튼 누르면 대상 텍스트 변경',
    icon: '✏️',
    category: 'ui',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'setText',
        params: { text: '' },
        order: 0,
        enabled: true,
      },
    ],
  },

  // ── Data ──
  {
    id: 'preset-counter',
    name: '카운터',
    description: '버튼 누르면 숫자 증가',
    icon: '🔢',
    category: 'data',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'increment',
        params: { amount: 1 },
        order: 0,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-save-state',
    name: '상태 저장',
    description: '값을 전역 상태에 저장',
    icon: '💾',
    category: 'data',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'setState',
        params: { key: 'myData', value: '' },
        order: 0,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-load-state',
    name: '상태 불러오기',
    description: '화면 진입 시 전역 상태 표시',
    icon: '📥',
    category: 'data',
    blocks: [
      {
        trigger: { type: 'onLoad' },
        target: '_self',
        action: 'getState',
        params: { key: 'myData' },
        order: 0,
        enabled: true,
      },
    ],
  },

  // ── Animation ──
  {
    id: 'preset-bounce',
    name: '바운스 효과',
    description: '버튼 누르면 대상이 통통 튐',
    icon: '⬆',
    category: 'animation',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'bounce',
        params: { duration: 500 },
        order: 0,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-shake-error',
    name: '에러 흔들기',
    description: '검증 실패 시 흔들림 효과',
    icon: '↔',
    category: 'animation',
    blocks: [
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'validate',
        params: { rule: 'required' },
        order: 0,
        enabled: true,
      },
      {
        trigger: { type: 'onPress', source: '_self' },
        target: '_self',
        action: 'shake',
        params: { duration: 400 },
        order: 1,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-pulse-attention',
    name: '주목 효과',
    description: '화면 진입 시 펄스 애니메이션',
    icon: '💫',
    category: 'animation',
    blocks: [
      {
        trigger: { type: 'onLoad' },
        target: '_self',
        action: 'pulse',
        params: { duration: 600 },
        order: 0,
        enabled: true,
      },
    ],
  },
  {
    id: 'preset-delayed-navigate',
    name: '지연 이동',
    description: '2초 후 자동으로 다음 화면',
    icon: '⏱',
    category: 'animation',
    blocks: [
      {
        trigger: { type: 'onLoad' },
        target: '_self',
        action: 'delay',
        params: { ms: 2000 },
        order: 0,
        enabled: true,
      },
      {
        trigger: { type: 'onLoad' },
        target: '_self',
        action: 'navigate',
        params: { screen: '' },
        order: 1,
        enabled: true,
      },
    ],
  },
];

export const PRESET_CATEGORIES = [
  { key: 'navigation', label: '네비게이션', icon: '🧭' },
  { key: 'form', label: '폼/입력', icon: '📋' },
  { key: 'ui', label: 'UI 변경', icon: '🎨' },
  { key: 'data', label: '데이터', icon: '💾' },
  { key: 'animation', label: '애니메이션', icon: '✨' },
] as const;

/** 프리셋을 실제 Block[]로 변환 (componentId 채움) */
export function instantiatePreset(preset: BlockPreset, componentId: string): Block[] {
  return preset.blocks.map((b, i) => ({
    ...b,
    id: uuid(),
    componentId,
    order: i,
  }));
}
