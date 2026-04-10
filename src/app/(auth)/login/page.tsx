'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from '@/lib/actions/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
          <p className="text-sm text-gray-500 mt-1">Vibe Community에 오신 걸 환영합니다</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <Input name="email" type="email" label="이메일" placeholder="email@example.com" required />
          <Input name="password" type="password" label="비밀번호" placeholder="••••••••" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>
            로그인
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
