# Vibe Community - CLAUDE.md

커뮤니티 동반 앱개발 웹 서비스. 각 유저가 페이지를 만들고, 서로의 페이지를 네비게이션으로 연결하여 앱을 완성하는 시스템.
기존 VibeBuilder(데스크톱 Tauri 앱)와 나중에 합칠 예정.

---

## 기술 스택

| 역할 | 라이브러리 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) + TypeScript |
| 백엔드/DB | Supabase (Auth + PostgreSQL + Storage) |
| 상태 관리 | Zustand (에디터 로컬) |
| 서버 상태 | Server Actions + RSC |
| 드래그앤드롭 | @dnd-kit/core |
| 플로우 뷰 | @xyflow/react |
| 아이콘 | lucide-react |
| 스타일 | Tailwind CSS v4 |

---

## 핵심 컨셉

- **페이지가 최소 단위**: 각 유저는 자기 페이지(Screen)를 만든다
- **네비게이션 연결**: 내 페이지의 버튼 → 다른 사람의 페이지로 이동 (데이터 전달 없음)
- **레벨 시스템**: XP 획득 → 레벨업 → 새 컴포넌트 잠금해제
- **커뮤니티**: 피드, 탐색, 좋아요, 프로필

---

## DB 스키마

- `profiles` — 유저 프로필 + 레벨/XP
- `screens` — 페이지 (components를 JSONB로 저장)
- `connections` — 페이지 간 네비게이션 연결
- `level_definitions` — 레벨별 XP/잠금해제 정의
- `xp_events` — XP 활동 로그
- `likes` — 좋아요

마이그레이션: `supabase/migrations/001~004_*.sql`

---

## 기존 VibeBuilder와의 관계

- `types/project.ts` — AppComponent, Screen 등 공유 타입 (VibeBuilder에서 복사)
- `styles/theme.ts` — 색상 토큰 공유
- 에디터 컴포넌트 — PageEditor, PhoneFrame, CanvasComponent 이식
- Zone/Chunk 계층 제거 — Screen이 최상위 단위
