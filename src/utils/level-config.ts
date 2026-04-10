export interface LevelConfig {
  level: number;
  requiredXp: number;
  title: string;
}

export const LEVELS: LevelConfig[] = [
  { level: 1, requiredXp: 0,    title: '새싹 빌더' },
  { level: 2, requiredXp: 50,   title: '호기심 빌더' },
  { level: 3, requiredXp: 150,  title: '성장 빌더' },
  { level: 4, requiredXp: 350,  title: '실력 빌더' },
  { level: 5, requiredXp: 600,  title: '베테랑 빌더' },
  { level: 6, requiredXp: 1000, title: '엘리트 빌더' },
  { level: 7, requiredXp: 1500, title: '마스터 빌더' },
];

export const XP_REWARDS = {
  publish_screen: 50,
  receive_like: 5,
  receive_connection: 20,
  create_connection: 10,
  receive_follow: 10,
  first_component: 10,
  daily_login: 5,
} as const;

export function getLevelForXp(xp: number): LevelConfig {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].requiredXp) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(level: number): LevelConfig | null {
  return LEVELS.find(l => l.level === level + 1) ?? null;
}
