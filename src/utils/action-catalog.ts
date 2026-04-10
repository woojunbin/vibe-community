import type { ActionDef } from '@/types/action-block';

export const ACTION_CATALOG: ActionDef[] = [
  // ── Transform ──
  {
    action: 'rotate', category: 'Transform', label: '회전',
    params: [
      { key: 'degree', label: '각도', type: 'number', default: 90, min: 0, max: 360, step: 1, unit: 'deg' },
      { key: 'animated', label: '애니메이션', type: 'toggle', default: true },
      { key: 'duration', label: '시간', type: 'number', default: 300, min: 0, max: 3000, step: 50, unit: 'ms' },
    ],
    inlineParams: ['degree'],
  },
  {
    action: 'scale', category: 'Transform', label: '크기 변환',
    params: [
      { key: 'scaleX', label: '가로 배율', type: 'number', default: 1.5, min: 0.1, max: 5, step: 0.1, unit: '×' },
      { key: 'scaleY', label: '세로 배율', type: 'number', default: 1.5, min: 0.1, max: 5, step: 0.1, unit: '×' },
      { key: 'animated', label: '애니메이션', type: 'toggle', default: true },
      { key: 'duration', label: '시간', type: 'number', default: 300, min: 0, max: 3000, step: 50, unit: 'ms' },
    ],
    inlineParams: ['scaleX'],
  },
  {
    action: 'move', category: 'Transform', label: '위치 이동',
    params: [
      { key: 'x', label: 'X', type: 'number', default: 0, min: -999, max: 999, step: 1, unit: 'px' },
      { key: 'y', label: 'Y', type: 'number', default: 0, min: -999, max: 999, step: 1, unit: 'px' },
      { key: 'animated', label: '애니메이션', type: 'toggle', default: true },
      { key: 'duration', label: '시간', type: 'number', default: 300, min: 0, max: 3000, step: 50, unit: 'ms' },
    ],
    inlineParams: ['x', 'y'],
  },
  {
    action: 'resize', category: 'Transform', label: '크기 조절',
    params: [
      { key: 'width', label: '너비', type: 'number', default: 200, min: 0, max: 9999, step: 1, unit: 'px' },
      { key: 'height', label: '높이', type: 'number', default: 200, min: 0, max: 9999, step: 1, unit: 'px' },
      { key: 'animated', label: '애니메이션', type: 'toggle', default: true },
      { key: 'duration', label: '시간', type: 'number', default: 300, min: 0, max: 3000, step: 50, unit: 'ms' },
    ],
    inlineParams: ['width', 'height'],
  },
  {
    action: 'flip', category: 'Transform', label: '뒤집기',
    params: [
      { key: 'axis', label: '축', type: 'select', default: 'horizontal', options: ['horizontal', 'vertical'] },
      { key: 'animated', label: '애니메이션', type: 'toggle', default: true },
      { key: 'duration', label: '시간', type: 'number', default: 300, min: 0, max: 3000, step: 50, unit: 'ms' },
    ],
    inlineParams: ['axis'],
  },

  // ── Visibility ──
  { action: 'show', category: 'Visibility', label: '보이기', params: [
    { key: 'animated', label: '애니메이션', type: 'toggle', default: false },
    { key: 'duration', label: '시간', type: 'number', default: 200, min: 0, max: 3000, step: 50, unit: 'ms' },
  ], inlineParams: [] },
  { action: 'hide', category: 'Visibility', label: '숨기기', params: [
    { key: 'animated', label: '애니메이션', type: 'toggle', default: false },
    { key: 'duration', label: '시간', type: 'number', default: 200, min: 0, max: 3000, step: 50, unit: 'ms' },
  ], inlineParams: [] },
  { action: 'toggle', category: 'Visibility', label: '토글', params: [
    { key: 'animated', label: '애니메이션', type: 'toggle', default: false },
    { key: 'duration', label: '시간', type: 'number', default: 200, min: 0, max: 3000, step: 50, unit: 'ms' },
  ], inlineParams: [] },
  { action: 'fadeIn', category: 'Visibility', label: '페이드인', params: [
    { key: 'duration', label: '시간', type: 'number', default: 300, min: 0, max: 3000, step: 50, unit: 'ms' },
    { key: 'delay', label: '지연', type: 'number', default: 0, min: 0, max: 5000, step: 50, unit: 'ms' },
  ], inlineParams: ['duration'] },
  { action: 'fadeOut', category: 'Visibility', label: '페이드아웃', params: [
    { key: 'duration', label: '시간', type: 'number', default: 300, min: 0, max: 3000, step: 50, unit: 'ms' },
    { key: 'delay', label: '지연', type: 'number', default: 0, min: 0, max: 5000, step: 50, unit: 'ms' },
  ], inlineParams: ['duration'] },

  // ── Style ──
  { action: 'changeColor', category: 'Style', label: '텍스트 색상', params: [
    { key: 'color', label: '색상', type: 'color', default: '#000000' },
    { key: 'animated', label: '애니메이션', type: 'toggle', default: false },
    { key: 'duration', label: '시간', type: 'number', default: 200, min: 0, max: 3000, step: 50, unit: 'ms' },
  ], inlineParams: ['color'] },
  { action: 'changeBgColor', category: 'Style', label: '배경색', params: [
    { key: 'color', label: '배경색', type: 'color', default: '#FFFFFF' },
    { key: 'animated', label: '애니메이션', type: 'toggle', default: false },
    { key: 'duration', label: '시간', type: 'number', default: 200, min: 0, max: 3000, step: 50, unit: 'ms' },
  ], inlineParams: ['color'] },
  { action: 'changeBorder', category: 'Style', label: '테두리', params: [
    { key: 'width', label: '두께', type: 'number', default: 1, min: 0, max: 20, step: 1, unit: 'px' },
    { key: 'color', label: '색상', type: 'color', default: '#000000' },
    { key: 'style', label: '스타일', type: 'select', default: 'solid', options: ['solid', 'dashed', 'dotted'] },
    { key: 'radius', label: '모서리', type: 'number', default: 0, min: 0, max: 100, step: 1, unit: 'px' },
  ], inlineParams: ['color', 'width'] },
  { action: 'changeOpacity', category: 'Style', label: '투명도', params: [
    { key: 'opacity', label: '투명도', type: 'number', default: 1, min: 0, max: 1, step: 0.05 },
    { key: 'animated', label: '애니메이션', type: 'toggle', default: false },
    { key: 'duration', label: '시간', type: 'number', default: 200, min: 0, max: 3000, step: 50, unit: 'ms' },
  ], inlineParams: ['opacity'] },
  { action: 'changeFontSize', category: 'Style', label: '글꼴 크기', params: [
    { key: 'size', label: '크기', type: 'number', default: 16, min: 8, max: 120, step: 1, unit: 'px' },
  ], inlineParams: ['size'] },
  { action: 'changeShadow', category: 'Style', label: '그림자', params: [
    { key: 'offsetX', label: 'X', type: 'number', default: 0, min: -50, max: 50, step: 1, unit: 'px' },
    { key: 'offsetY', label: 'Y', type: 'number', default: 4, min: -50, max: 50, step: 1, unit: 'px' },
    { key: 'blur', label: '블러', type: 'number', default: 8, min: 0, max: 100, step: 1, unit: 'px' },
    { key: 'color', label: '색상', type: 'color', default: '#00000033' },
  ], inlineParams: ['blur', 'color'] },

  // ── Content ──
  { action: 'setText', category: 'Content', label: '텍스트 변경', params: [
    { key: 'text', label: '텍스트', type: 'string', default: '', placeholder: '표시할 텍스트' },
  ], inlineParams: ['text'] },
  { action: 'setImage', category: 'Content', label: '이미지 변경', params: [
    { key: 'src', label: '이미지 경로', type: 'url', default: '', placeholder: 'https://...' },
  ], inlineParams: ['src'] },
  { action: 'setValue', category: 'Content', label: '값 설정', params: [
    { key: 'value', label: '값', type: 'string', default: '', placeholder: '설정할 값' },
  ], inlineParams: ['value'] },
  { action: 'append', category: 'Content', label: '내용 추가', params: [
    { key: 'text', label: '추가 텍스트', type: 'string', default: '', placeholder: '추가할 텍스트' },
    { key: 'position', label: '위치', type: 'select', default: 'end', options: ['start', 'end'] },
  ], inlineParams: ['text'] },
  { action: 'clear', category: 'Content', label: '초기화', params: [], inlineParams: [] },
  { action: 'setPlaceholder', category: 'Content', label: '플레이스홀더', params: [
    { key: 'text', label: '플레이스홀더', type: 'string', default: '', placeholder: '안내 문구' },
  ], inlineParams: ['text'] },

  // ── Navigation ──
  { action: 'navigate', category: 'Navigation', label: '페이지 이동', params: [
    { key: 'screen', label: '대상 화면', type: 'screen_ref', default: '' },
    { key: 'transition', label: '전환 효과', type: 'select', default: 'push', options: ['push', 'modal', 'replace', 'fade'] },
  ], inlineParams: ['screen'] },
  { action: 'goBack', category: 'Navigation', label: '뒤로가기', params: [], inlineParams: [] },
  { action: 'openModal', category: 'Navigation', label: '모달 열기', params: [
    { key: 'screen', label: '모달 화면', type: 'screen_ref', default: '' },
    { key: 'backdrop', label: '배경 딤', type: 'toggle', default: true },
    { key: 'closable', label: '바깥 터치 닫기', type: 'toggle', default: true },
  ], inlineParams: ['screen'] },
  { action: 'closeModal', category: 'Navigation', label: '모달 닫기', params: [], inlineParams: [] },
  { action: 'openLink', category: 'Navigation', label: '외부 링크', params: [
    { key: 'url', label: 'URL', type: 'url', default: '', placeholder: 'https://...' },
    { key: 'external', label: '외부 브라우저', type: 'toggle', default: true },
  ], inlineParams: ['url'] },

  // ── Data ──
  { action: 'setState', category: 'Data', label: '전역 상태 저장', params: [
    { key: 'stateKey', label: '상태 키', type: 'string', default: '', placeholder: 'isLoggedIn' },
    { key: 'value', label: '값', type: 'string', default: '' },
  ], inlineParams: ['stateKey', 'value'] },
  { action: 'getState', category: 'Data', label: '전역 상태 읽기', params: [
    { key: 'stateKey', label: '상태 키', type: 'string', default: '' },
    { key: 'targetProp', label: '적용 속성', type: 'select', default: 'text', options: ['text', 'value', 'visible', 'src'] },
  ], inlineParams: ['stateKey'] },
  { action: 'setLocal', category: 'Data', label: '로컬 값 저장', params: [
    { key: 'value', label: '값', type: 'string', default: '' },
  ], inlineParams: ['value'] },
  { action: 'increment', category: 'Data', label: '값 증가', params: [
    { key: 'amount', label: '증가량', type: 'number', default: 1, min: 1, max: 9999, step: 1 },
  ], inlineParams: ['amount'] },
  { action: 'decrement', category: 'Data', label: '값 감소', params: [
    { key: 'amount', label: '감소량', type: 'number', default: 1, min: 1, max: 9999, step: 1 },
  ], inlineParams: ['amount'] },

  // ── Form ──
  { action: 'validate', category: 'Form', label: '유효성 검증', params: [
    { key: 'rule', label: '규칙', type: 'select', default: 'required', options: ['required', 'email', 'minLength', 'maxLength', 'pattern', 'number'] },
    { key: 'value', label: '규칙 값', type: 'string', default: '' },
    { key: 'errorMessage', label: '에러 메시지', type: 'string', default: '' },
  ], inlineParams: ['rule'] },
  { action: 'submit', category: 'Form', label: '폼 제출', params: [
    { key: 'fields', label: '제출 필드', type: 'string', default: '', placeholder: '@이름, @이메일' },
  ], inlineParams: ['fields'] },
  { action: 'reset', category: 'Form', label: '폼 초기화', params: [], inlineParams: [] },
  { action: 'focus', category: 'Form', label: '포커스', params: [], inlineParams: [] },
  { action: 'blur', category: 'Form', label: '포커스 해제', params: [], inlineParams: [] },
  { action: 'enable', category: 'Form', label: '활성화', params: [], inlineParams: [] },
  { action: 'disable', category: 'Form', label: '비활성화', params: [], inlineParams: [] },

  // ── List ──
  { action: 'addItem', category: 'List', label: '항목 추가', params: [
    { key: 'data', label: '데이터 소스', type: 'component_ref', default: '' },
    { key: 'position', label: '위치', type: 'select', default: 'end', options: ['start', 'end'] },
  ], inlineParams: ['data'] },
  { action: 'removeItem', category: 'List', label: '항목 제거', params: [
    { key: 'target', label: '대상', type: 'select', default: 'selected', options: ['selected', 'first', 'last', 'all'] },
  ], inlineParams: ['target'] },
  { action: 'sortBy', category: 'List', label: '정렬', params: [
    { key: 'field', label: '필드', type: 'string', default: '' },
    { key: 'direction', label: '방향', type: 'select', default: 'asc', options: ['asc', 'desc'] },
  ], inlineParams: ['field', 'direction'] },
  { action: 'filterBy', category: 'List', label: '필터링', params: [
    { key: 'field', label: '필터 필드', type: 'string', default: '' },
    { key: 'matchSource', label: '비교 소스', type: 'component_ref', default: '' },
  ], inlineParams: ['matchSource'] },
  { action: 'scrollTo', category: 'List', label: '스크롤', params: [
    { key: 'position', label: '위치', type: 'select', default: 'top', options: ['top', 'bottom', 'index'] },
    { key: 'index', label: '인덱스', type: 'number', default: 0, min: 0, max: 9999, step: 1 },
    { key: 'animated', label: '애니메이션', type: 'toggle', default: true },
  ], inlineParams: ['position'] },
  { action: 'refresh', category: 'List', label: '새로고침', params: [], inlineParams: [] },

  // ── Animation ──
  { action: 'bounce', category: 'Animation', label: '바운스', params: [
    { key: 'intensity', label: '강도', type: 'number', default: 1, min: 0.1, max: 3, step: 0.1, unit: '×' },
    { key: 'duration', label: '시간', type: 'number', default: 500, min: 100, max: 3000, step: 50, unit: 'ms' },
    { key: 'repeat', label: '반복', type: 'number', default: 1, min: 1, max: 10, step: 1, unit: '회' },
  ], inlineParams: ['intensity'] },
  { action: 'shake', category: 'Animation', label: '흔들기', params: [
    { key: 'intensity', label: '강도', type: 'number', default: 5, min: 1, max: 30, step: 1, unit: 'px' },
    { key: 'duration', label: '시간', type: 'number', default: 400, min: 100, max: 2000, step: 50, unit: 'ms' },
  ], inlineParams: ['intensity'] },
  { action: 'pulse', category: 'Animation', label: '펄스', params: [
    { key: 'scale', label: '확대율', type: 'number', default: 1.1, min: 1.01, max: 2, step: 0.05, unit: '×' },
    { key: 'duration', label: '시간', type: 'number', default: 600, min: 100, max: 3000, step: 50, unit: 'ms' },
  ], inlineParams: ['scale'] },
  { action: 'slide', category: 'Animation', label: '슬라이드', params: [
    { key: 'direction', label: '방향', type: 'select', default: 'right', options: ['left', 'right', 'up', 'down'] },
    { key: 'distance', label: '거리', type: 'number', default: 100, min: 1, max: 999, step: 1, unit: 'px' },
    { key: 'duration', label: '시간', type: 'number', default: 300, min: 100, max: 3000, step: 50, unit: 'ms' },
  ], inlineParams: ['direction', 'distance'] },
  { action: 'spin', category: 'Animation', label: '회전 애니메이션', params: [
    { key: 'duration', label: '1회전 시간', type: 'number', default: 1000, min: 200, max: 5000, step: 100, unit: 'ms' },
    { key: 'direction', label: '방향', type: 'select', default: 'clockwise', options: ['clockwise', 'counterclockwise'] },
  ], inlineParams: ['duration', 'direction'] },
  { action: 'typewriter', category: 'Animation', label: '타이핑 효과', params: [
    { key: 'speed', label: '속도', type: 'number', default: 50, min: 10, max: 500, step: 10, unit: 'ms/글자' },
    { key: 'cursor', label: '커서 표시', type: 'toggle', default: true },
  ], inlineParams: ['speed'] },

  // ── Timer ──
  { action: 'delay', category: 'Timer', label: '지연', params: [
    { key: 'duration', label: '대기 시간', type: 'number', default: 1000, min: 100, max: 30000, step: 100, unit: 'ms' },
  ], inlineParams: ['duration'], isChaining: true },
  { action: 'interval', category: 'Timer', label: '반복 실행', params: [
    { key: 'intervalMs', label: '간격', type: 'number', default: 1000, min: 100, max: 60000, step: 100, unit: 'ms' },
    { key: 'maxCount', label: '최대 반복', type: 'number', default: 0, min: 0, max: 999, step: 1, unit: '회' },
  ], inlineParams: ['intervalMs'] },
  { action: 'countdown', category: 'Timer', label: '카운트다운', params: [
    { key: 'from', label: '시작 값', type: 'number', default: 10, min: 1, max: 9999, step: 1 },
    { key: 'intervalMs', label: '간격', type: 'number', default: 1000, min: 100, max: 60000, step: 100, unit: 'ms' },
  ], inlineParams: ['from'] },
  { action: 'debounce', category: 'Timer', label: '디바운스', params: [
    { key: 'wait', label: '대기 시간', type: 'number', default: 300, min: 50, max: 5000, step: 50, unit: 'ms' },
  ], inlineParams: ['wait'], isChaining: true },
];

export function getActionDef(action: string): ActionDef | undefined {
  return ACTION_CATALOG.find(a => a.action === action);
}

export function getActionsByCategory(category: string): ActionDef[] {
  return ACTION_CATALOG.filter(a => a.category === category);
}

export const ACTION_CATEGORIES = [
  'Transform', 'Visibility', 'Style', 'Content',
  'Navigation', 'Data', 'Form', 'List', 'Animation', 'Timer',
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  Transform: '변환', Visibility: '표시', Style: '스타일', Content: '콘텐츠',
  Navigation: '내비게이션', Data: '데이터', Form: '폼', List: '리스트',
  Animation: '애니메이션', Timer: '타이머',
};
