'use client';

import React from 'react';
import { Star, BookOpen, Trophy, Sparkles, Map, Heart } from 'lucide-react';

export type TabType = 'stages' | 'flashcards' | 'quiz' | 'stats' | 'settings';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAIGenerator: () => void;
  cardCount: number;
  totalStars: number;
  speechRate?: number;
  setSpeechRate?: (rate: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAIGenerator,
  cardCount,
  totalStars,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-amber-100 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* ==================== 1. Brand Logo & Title (Left) ==================== */}
        <div
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0 group"
          onClick={() => setActiveTab('stages')}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-400 to-indigo-500 text-white shadow-md shadow-amber-200/60 group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
            <span className="text-xl">🌟</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
              SmartAI Kids
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">
              <span>🎈 5-6 ขวบ</span>
            </span>
          </div>
        </div>

        {/* ==================== 2. Mode Navigation Tabs (Desktop only) ==================== */}
        <nav className="hidden sm:flex items-center p-1 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm shrink-0 overflow-x-auto max-w-full">
          {/* 1. Learning Units / Stages */}
          <button
            onClick={() => setActiveTab('stages')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'stages'
                ? 'bg-amber-400 text-slate-900 shadow-sm shadow-amber-200 scale-102'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            <span className="text-sm">🗺️</span>
            <span>5 ด่านผจญภัย</span>
          </button>

          {/* 2. All Flashcards */}
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'flashcards'
                ? 'bg-sky-400 text-white shadow-sm shadow-sky-200 scale-102'
                : 'text-slate-600 hover:text-sky-700'
            }`}
          >
            <span className="text-sm">🗂️</span>
            <span>การ์ดคำศัพท์ ({cardCount})</span>
          </button>

          {/* 3. Quiz */}
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'quiz'
                ? 'bg-pink-400 text-white shadow-sm shadow-pink-200 scale-102'
                : 'text-slate-600 hover:text-pink-700'
            }`}
          >
            <span className="text-sm">🎯</span>
            <span>เกมทายคำ</span>
          </button>

          {/* 4. Stats */}
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'stats'
                ? 'bg-emerald-400 text-white shadow-sm shadow-emerald-200 scale-102'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <span className="text-sm">🏆</span>
            <span>ถ้วยรางวัลคนเก่ง</span>
          </button>

          {/* 5. Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'bg-purple-500 text-white shadow-sm shadow-purple-200 scale-102'
                : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            <span className="text-sm">⚙️</span>
            <span>ตั้งค่า</span>
          </button>
        </nav>

        {/* ==================== 3. Controls & Actions (Right) ==================== */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Star Counter Pill */}
          <div
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-900 border-2 border-amber-300 text-xs font-black whitespace-nowrap shadow-xs shrink-0 select-none hover:scale-105 transition-transform"
            title="ดาวสะสมรวมของคนเก่ง"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 animate-bounce-gentle" />
            <span className="font-mono text-sm sm:text-base">{totalStars}</span>
            <span className="text-[11px] text-amber-700 font-bold hidden sm:inline">/ 15 ดาว</span>
          </div>

          {/* Add Cards via AI Button */}
          <button
            onClick={onOpenAIGenerator}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-bold text-xs shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            title="เพิ่มคำศัพท์ด้วย AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">เพิ่มคำศัพท์ AI</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>
      </div>

      {/* ==================== Mobile Bottom Navigation Bar ==================== */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-amber-200 shadow-2xl px-1.5 py-1.5 pb-safe flex items-center justify-around">
        {/* 1. Stages */}
        <button
          onClick={() => setActiveTab('stages')}
          className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all select-none active:scale-95 ${
            activeTab === 'stages'
              ? 'bg-amber-100 text-amber-950 font-black border border-amber-300 shadow-2xs'
              : 'text-slate-500 hover:text-amber-800 font-bold'
          }`}
        >
          <span className="text-xl">🗺️</span>
          <span className="text-[11px] leading-tight">5 ด่าน</span>
        </button>

        {/* 2. Flashcards */}
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all select-none active:scale-95 ${
            activeTab === 'flashcards'
              ? 'bg-sky-100 text-sky-950 font-black border border-sky-300 shadow-2xs'
              : 'text-slate-500 hover:text-sky-800 font-bold'
          }`}
        >
          <span className="text-xl">🗂️</span>
          <span className="text-[11px] leading-tight">การ์ด ({cardCount})</span>
        </button>

        {/* 3. Quiz */}
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all select-none active:scale-95 ${
            activeTab === 'quiz'
              ? 'bg-pink-100 text-pink-950 font-black border border-pink-300 shadow-2xs'
              : 'text-slate-500 hover:text-pink-800 font-bold'
          }`}
        >
          <span className="text-xl">🎯</span>
          <span className="text-[11px] leading-tight">เกมทาย</span>
        </button>

        {/* 4. Stats */}
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all select-none active:scale-95 ${
            activeTab === 'stats'
              ? 'bg-emerald-100 text-emerald-950 font-black border border-emerald-300 shadow-2xs'
              : 'text-slate-500 hover:text-emerald-800 font-bold'
          }`}
        >
          <span className="text-xl">🏆</span>
          <span className="text-[11px] leading-tight">รางวัล</span>
        </button>

        {/* 5. Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all select-none active:scale-95 ${
            activeTab === 'settings'
              ? 'bg-purple-100 text-purple-950 font-black border border-purple-300 shadow-2xs'
              : 'text-slate-500 hover:text-purple-800 font-bold'
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span className="text-[11px] leading-tight">ตั้งค่า</span>
        </button>
      </nav>
    </header>
  );
};
