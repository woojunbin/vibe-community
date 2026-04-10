import { NextResponse, type NextRequest } from 'next/server';

const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url';

export async function middleware(request: NextRequest) {
  // Mock 모드: 인증 체크 건너뛰기
  if (IS_MOCK) return NextResponse.next();

  const { updateSession } = await import('@/lib/supabase/middleware');
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
