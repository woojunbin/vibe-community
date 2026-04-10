'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layout, User, LogOut } from 'lucide-react';
import { signOut } from '@/lib/actions/auth';

const navItems = [
  { href: '/editor', label: '워크스페이스', icon: Layout },
  { href: '/feed', label: '피드', icon: Home },
  { href: '/profile', label: '프로필', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20">
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/editor" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-gray-900">Vibe Community</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/editor' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 w-full transition-colors"
          >
            <LogOut size={18} />
            로그아웃
          </button>
        </form>
      </div>
    </aside>
  );
}
