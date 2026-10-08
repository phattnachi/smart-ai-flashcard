'use client';

import React from 'react';
import {
  Search,
  Star,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockCards';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryCounts: Record<string, number>;
  masteredCount: number;
  totalCards: number;
}

const kidCategoryIcons: Record<string, string> = {
  All: '🌟',
  Animals: '🐶',
  'School & Objects': '🎒',
  'Fruits & Colors': '🍎',
  Nature: '☀️',
  'Feelings & Daily': '😊',
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  categoryCounts,
  masteredCount,
  totalCards,
}) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category horizontal scroll / chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'All' ? totalCards : categoryCounts[cat.id] || 0;
            const emoji = kidCategoryIcons[cat.id] || '🎈';

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 border-2 shadow-2xs ${
                  isSelected
                    ? 'bg-amber-400 text-amber-950 border-amber-400 shadow-sm shadow-amber-200 scale-102'
                    : 'bg-white hover:bg-amber-50 text-slate-700 border-amber-200 hover:border-amber-300'
                }`}
              >
                <span className="text-base">{emoji}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                    isSelected
                      ? 'bg-amber-200 text-amber-950'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search bar & Mastered count */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
            <input
              type="text"
              placeholder="🔍 ค้นหาคำศัพท์น่ารัก..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-white border-2 border-amber-200 text-slate-800 placeholder-slate-400 font-bold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all shadow-2xs"
            />
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-950 text-xs font-black shadow-2xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>จำได้แล้ว: {masteredCount}/{totalCards} คำ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
