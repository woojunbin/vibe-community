import type { PublishedScreen, UserProfile } from '@/types/community';
import type { AppComponent } from '@/types/project';
import { v4 as uuid } from 'uuid';

export const MOCK_USER: UserProfile = {
  id: 'mock-user-1',
  username: 'demo_builder',
  display_name: '데모 빌더',
  avatar_url: null,
  bio: 'Vibe Community 테스트 유저입니다',
  level: 1,
  xp: 0,
  follower_count: 0,
  following_count: 0,
  created_at: new Date().toISOString(),
};

const sampleComponents: AppComponent[] = [
  {
    id: uuid(), type: 'text', name: '제목',
    position: { x: 87, y: 80 }, size: { width: 200, height: 32 },
    style: { fontSize: '20', fontWeight: 'bold' },
    props: { content: '환영합니다!' }, behavior: '',
  },
  {
    id: uuid(), type: 'button', name: '시작 버튼',
    position: { x: 107, y: 400 }, size: { width: 160, height: 44 },
    style: { backgroundColor: '#2563EB', color: '#ffffff', borderRadius: '8' },
    props: { label: '시작하기' }, behavior: '',
  },
  {
    id: uuid(), type: 'input', name: '이메일 입력',
    position: { x: 47, y: 300 }, size: { width: 280, height: 44 },
    style: { borderWidth: '1', borderColor: '#d1d5db', borderRadius: '8' },
    props: { placeholder: '이메일을 입력하세요' }, behavior: '',
  },
];

export const MOCK_SCREENS: PublishedScreen[] = [
  {
    id: 'mock-screen-1', owner_id: MOCK_USER.id, name: '로그인 화면',
    components: sampleComponents,
    canvas_width: 375, canvas_height: 812, background_color: '#FAFAFA',
    is_published: true, published_at: new Date().toISOString(),
    thumbnail_url: null, description: '간단한 로그인 화면', tags: ['로그인', '인증'],
    view_count: 42, like_count: 12, connection_count: 3,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    owner: MOCK_USER,
  },
  {
    id: 'mock-screen-2', owner_id: MOCK_USER.id, name: '메인 화면',
    components: [
      {
        id: uuid(), type: 'text', name: '타이틀',
        position: { x: 87, y: 60 }, size: { width: 200, height: 32 },
        style: { fontSize: '18', fontWeight: 'bold' },
        props: { content: '메인 화면' }, behavior: '',
      },
      {
        id: uuid(), type: 'container', name: '카드',
        position: { x: 27, y: 120 }, size: { width: 320, height: 200 },
        style: { backgroundColor: '#f0f9ff', borderRadius: '12', borderWidth: '1', borderColor: '#bfdbfe' },
        props: {}, behavior: '',
      },
    ],
    canvas_width: 375, canvas_height: 812, background_color: '#ffffff',
    is_published: true, published_at: new Date().toISOString(),
    thumbnail_url: null, description: '앱 메인 화면', tags: ['메인'],
    view_count: 28, like_count: 8, connection_count: 1,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    owner: MOCK_USER,
  },
  {
    id: 'mock-screen-3', owner_id: MOCK_USER.id, name: '설정 화면',
    components: [
      {
        id: uuid(), type: 'text', name: '설정',
        position: { x: 137, y: 60 }, size: { width: 100, height: 28 },
        style: { fontSize: '16', fontWeight: 'bold' },
        props: { content: '설정' }, behavior: '',
      },
      {
        id: uuid(), type: 'list', name: '설정 목록',
        position: { x: 27, y: 120 }, size: { width: 320, height: 300 },
        style: {}, props: { itemHeight: 50 }, behavior: '',
      },
    ],
    canvas_width: 375, canvas_height: 812, background_color: '#FAFAFA',
    is_published: true, published_at: new Date().toISOString(),
    thumbnail_url: null, description: '앱 설정', tags: ['설정'],
    view_count: 15, like_count: 3, connection_count: 0,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    owner: MOCK_USER,
  },
];

// 로컬 스토리지 기반 mock DB
const STORAGE_KEY = 'vibe-community-mock';

interface MockDB {
  user: UserProfile;
  screens: PublishedScreen[];
  liked: string[]; // screen ids
}

export function getMockDB(): MockDB {
  if (typeof window === 'undefined') {
    return { user: MOCK_USER, screens: MOCK_SCREENS, liked: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const initial: MockDB = { user: MOCK_USER, screens: [...MOCK_SCREENS], liked: [] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function saveMockDB(db: MockDB) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}
