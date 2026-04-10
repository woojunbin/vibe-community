// Supabase가 설정되지 않으면 mock 모드로 동작
export const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url';
