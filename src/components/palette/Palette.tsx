'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { PALETTE_CATEGORIES, type PaletteItem } from './palette-data';

interface PaletteProps {
  onAdd: (item: PaletteItem) => void;
}

export function Palette({ onAdd }: PaletteProps) {
  const [search, setSearch] = useState('');

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full overflow-y-auto p-3">
      <div className="relative mb-3">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="컴포넌트 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {PALETTE_CATEGORIES.map((cat) => {
        const filtered = cat.items.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        );
        if (filtered.length === 0) return null;

        return (
          <div key={cat.label} className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">{cat.label}</h4>
            <div className="space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.type}
                  onClick={() => onAdd(item)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors hover:bg-blue-50 hover:text-blue-600 text-gray-700"
                >
                  <span className="w-5 h-5 rounded flex items-center justify-center text-xs bg-gray-100">
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
