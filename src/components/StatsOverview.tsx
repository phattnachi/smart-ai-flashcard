'use client';

import React from 'react';
import {
  Trophy,
  Star,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Flashcard } from '../types/flashcard';

interface StatsOverviewProps {
  cards: Flashcard[];
  masteredIds: Set<string>;
  onClearMastered: () => void;
  onGoToDeck: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  cards,
  masteredIds,
  onClearMastered,
  onGoToDeck,
}) => {
  const totalCards = cards.length;
  const masteredCount = masteredIds.size;
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  const categoriesMap: Record<string, { total: number; mastered: number }> = {};
  cards.forEach((c) => {
    if (!categoriesMap[c.category]) {
      categoriesMap[c.category] = { total: 0, mastered: 0 };
    }
    categoriesMap[c.category].total += 1;
    if (masteredIds.has(c.id)) {
      categoriesMap[c.category].mastered += 1;
    }
  });

  const getRankBadge = (pct: number) => {
    if (pct >= 85) return '🌟 สุดยอดคนเก่งตัวน้อย (Super Star)';
    if (pct >= 60) return '🚀 คนเก่งความจำเลิศ (Brilliant Kid)';
    if (pct >= 30) return '🌱 หนูน้อยคนขยัน (Active Explorer)';
    return '🎈 หนูน้อยเริ่มต้นผจญภัย (Starter Buddy)';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Banner: Colorful Kids Trophy Room */}
      <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-500 border-3 border-amber-300 shadow-xl shadow-amber-100 text-white overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <span className="text-xs font-black px-3.5 py-1 rounded-full bg-white/25 text-white border border-white/40 backdrop-blur-xs">
              🏆 ตู้สะสมรางวัลคนเก่ง 5-6 ขวบ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              เหรียญรางวัลและความสำเร็จของหนูน้อย 🌟
            </h2>
            <p className="text-xs sm:text-sm text-amber-50 max-w-lg font-bold leading-relaxed">
              มาดูดาวสะสมและคำศัพท์ที่คนเก่งจำได้กันเถอะ ยิ่งทบทวนยิ่งเก่งขึ้นทุกวันนะจ๊ะ! 🎈
            </p>
          </div>

          <button
            onClick={onGoToDeck}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-indigo-700 font-black text-xs sm:text-sm shadow-md hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <span className="text-base">🗺️</span>
            <span>ไปผจญภัย 5 ด่านเลย!</span>
          </button>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-white border-2 border-amber-200 shadow-xs space-y-1 text-center">
          <div className="flex items-center justify-center text-amber-500 mb-0.5">
            <Star className="w-6 h-6 fill-amber-400 animate-bounce-gentle" />
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">{masteredCount}</p>
          <p className="text-xs font-bold text-amber-800">⭐ คำที่จำได้แล้ว</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border-2 border-sky-200 shadow-xs space-y-1 text-center">
          <div className="flex items-center justify-center text-sky-500 mb-0.5">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">{totalCards}</p>
          <p className="text-xs font-bold text-sky-800">🗂️ คำศัพท์ในคลัง</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border-2 border-emerald-200 shadow-xs space-y-1 text-center">
          <div className="flex items-center justify-center text-emerald-500 mb-0.5">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-3xl font-black text-emerald-600 font-mono">
            {masteryPercentage}%
          </p>
          <p className="text-xs font-bold text-emerald-800">🎯 จำได้แล้ว</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border-2 border-pink-200 shadow-xs space-y-1 text-center">
          <div className="flex items-center justify-center text-pink-500 mb-0.5">
            <Trophy className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-black text-pink-700 pt-1 line-clamp-1">
            {getRankBadge(masteryPercentage)}
          </p>
          <p className="text-xs font-bold text-pink-800 pt-0.5">ฉายาคนเก่ง</p>
        </div>
      </div>

      {/* Category Progress Breakdown */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-amber-200 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
          <span>🎨 ความก้าวหน้าในแต่ละหมวดหมู่</span>
        </h3>

        <div className="space-y-4">
          {Object.entries(categoriesMap).map(([category, data]) => {
            const pct = Math.round((data.mastered / data.total) * 100);
            return (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-black">
                  <span className="text-slate-800">{category}</span>
                  <span className="text-amber-800 text-xs">
                    จำได้ {data.mastered} จาก {data.total} คำ ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-amber-100 h-3 rounded-full overflow-hidden p-0.5 border border-amber-200">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {masteredCount > 0 && (
          <div className="pt-3 border-t-2 border-amber-100 flex justify-end">
            <button
              onClick={onClearMastered}
              className="text-xs text-slate-400 hover:text-rose-500 font-bold transition-colors"
            >
              เริ่มเก็บคำศัพท์ใหม่อีกครั้ง ↺
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
