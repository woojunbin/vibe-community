'use client';

import Link from 'next/link';

export function FeedTabs({ current }: { current: 'latest' | 'popular' }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      <Link
        href="/feed?sort=latest"
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
          ${current === 'latest' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
      >
        최신
      </Link>
      <Link
        href="/feed?sort=popular"
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
          ${current === 'popular' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
      >
        인기
      </Link>
    </div>
  );
}
