'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, Settings, Sparkles } from 'lucide-react';

export type TabType = 'stages' | 'flashcards' | 'quiz' | 'stats' | 'settings';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAIGenerator: () => void;
  cardCount?: number;
  totalStars: number;
  speechRate?: number;
  setSpeechRate?: (rate: number) => void;
}

interface NavTabItem {
  id: TabType;
  label: string;
  emoji: string;
  title: string;
  activeColor: string;
  inactiveColor: string;
}

const MAIN_TABS: NavTabItem[] = [
  {
    id: 'stages',
    label: 'แผนที่',
    emoji: '🗺️',
    title: 'แผนที่ด่านผจญภัย (Stage Map)',
    activeColor: 'bg-amber-400 text-amber-950 shadow-md shadow-amber-300/60 ring-2 ring-amber-300',
    inactiveColor: 'text-slate-600 hover:text-amber-800 hover:bg-amber-100/70',
  },
  {
    id: 'flashcards',
    label: 'การ์ดคำ',
    emoji: '🎴',
    title: 'คลังการ์ดคำศัพท์ (Flashcards)',
    activeColor: 'bg-sky-400 text-white shadow-md shadow-sky-300/60 ring-2 ring-sky-300',
    inactiveColor: 'text-slate-600 hover:text-sky-800 hover:bg-sky-100/70',
  },
  {
    id: 'stats',
    label: 'รางวัล',
    emoji: '🏆',
    title: 'ถ้วยรางวัลคนเก่ง (Trophy & Stars)',
    activeColor: 'bg-emerald-400 text-white shadow-md shadow-emerald-300/60 ring-2 ring-emerald-300',
    inactiveColor: 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-100/70',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAIGenerator,
  totalStars,
}) => {
  const [isParentMenuOpen, setIsParentMenuOpen] = useState(false);
  const parentMenuRef = useRef<HTMLDivElement>(null);
  const parentButtonRef = useRef<HTMLButtonElement>(null);

  // Close parent menu when clicking outside or pressing Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        parentMenuRef.current &&
        !parentMenuRef.current.contains(event.target as Node) &&
        parentButtonRef.current &&
        !parentButtonRef.current.contains(event.target as Node)
      ) {
        setIsParentMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsParentMenuOpen(false);
      }
    };

    if (isParentMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isParentMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-amber-100 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* ==================== 1. Brand Logo & Title (Left) ==================== */}
        <div
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink-0 group"
          onClick={() => setActiveTab('stages')}
          title="กลับสู่หน้าหลัก 5 ด่านผจญภัย"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-400 to-indigo-500 text-white shadow-md shadow-amber-200/60 group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
            <span className="text-xl">🌟</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
              SmartAI Kids
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">
              <span>🎈 5-6 ขวบ</span>
            </span>
          </div>
        </div>

        {/* ==================== 2. Mode Navigation Tabs: 3 Main Kid-Friendly Buttons (Desktop/Tablet) ==================== */}
        <nav
          className="hidden sm:flex items-center p-1.5 rounded-3xl bg-amber-50/90 border-2 border-amber-200/80 shadow-xs gap-2 shrink-0"
          aria-label="เมนูหลักสำหรับเด็ก"
        >
          {MAIN_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-2xl font-black text-sm sm:text-base tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? `${tab.activeColor} scale-105`
                    : `${tab.inactiveColor} active:scale-95`
                }`}
                title={tab.title}
              >
                <span className="text-xl sm:text-2xl leading-none select-none drop-shadow-xs">
                  {tab.emoji}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ==================== 3. Controls & Actions (Right) ==================== */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Star Counter Pill: Rewards visualization */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-900 border-2 border-amber-300 text-xs sm:text-sm font-black whitespace-nowrap shadow-xs select-none hover:scale-105 transition-transform"
            title="ดาวสะสมรวมของคนเก่ง"
          >
            <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 fill-amber-400 shrink-0 animate-bounce-gentle" />
            <span className="font-mono text-sm sm:text-base font-black">{totalStars}</span>
            <span className="text-[11px] text-amber-700 font-bold hidden md:inline">/ 15 ดาว</span>
          </div>

          {/* Parent Mode Compact Gear Icon ⚙️ (Adult / Admin Gate) */}
          <div className="relative">
            <button
              ref={parentButtonRef}
              onClick={() => setIsParentMenuOpen((prev) => !prev)}
              className={`flex items-center justify-center w-10 h-10 rounded-2xl border transition-all cursor-pointer ${
                isParentMenuOpen || activeTab === 'settings'
                  ? 'bg-purple-100 text-purple-800 border-purple-300 ring-2 ring-purple-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 border-slate-200 shadow-2xs hover:scale-105 active:scale-95'
              }`}
              title="โหมดผู้ปกครอง (ตั้งค่าระบบ / เพิ่มคำศัพท์ AI)"
              aria-label="โหมดผู้ปกครองและการตั้งค่า"
              aria-expanded={isParentMenuOpen}
            >
              <Settings
                className={`w-5 h-5 transition-transform duration-300 ${
                  isParentMenuOpen ? 'rotate-90 text-purple-700' : ''
                }`}
              />
            </button>

            {/* Parent Dropdown Popover */}
            {isParentMenuOpen && (
              <div
                ref={parentMenuRef}
                className="absolute right-0 top-full mt-2 w-72 p-3 bg-white rounded-3xl shadow-2xl border-2 border-slate-200/90 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">👨‍👩‍👧</span>
                    <span className="text-xs font-black text-slate-800">โหมดผู้ปกครอง</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    Parents
                  </span>
                </div>

                {/* Menu Options */}
                <div className="space-y-1.5">
                  {/* Option 1: AI Flashcard Generator */}
                  <button
                    onClick={() => {
                      setIsParentMenuOpen(false);
                      onOpenAIGenerator();
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-2xl hover:bg-amber-50 text-left border border-transparent hover:border-amber-200 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <span>เพิ่มคำศัพท์ด้วย AI</span>
                        <span className="text-[9px] bg-pink-100 text-pink-700 font-bold px-1.5 py-0.2 rounded-full">
                          AI
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                        สร้างชุดคำศัพท์ใหม่ตามต้องการ
                      </p>
                    </div>
                  </button>

                  {/* Option 2: System Settings */}
                  <button
                    onClick={() => {
                      setIsParentMenuOpen(false);
                      setActiveTab('settings');
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-2xl text-left border transition-all cursor-pointer group ${
                      activeTab === 'settings'
                        ? 'bg-purple-50 border-purple-300 text-purple-900'
                        : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center text-slate-600 group-hover:text-purple-700 shrink-0 transition-colors">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-slate-800">ตั้งค่าระบบ</div>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                        ความเร็วเสียง, เกณฑ์ออกเสียง, รีเซ็ตข้อมูล
                      </p>
                    </div>
                  </button>
                </div>

                {/* Quick Return Button when inside Settings */}
                {activeTab === 'settings' && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsParentMenuOpen(false);
                        setActiveTab('stages');
                      }}
                      className="w-full py-2 rounded-xl text-center text-xs font-black text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer"
                    >
                      🗺️ กลับสู่หน้าด่านเกมเด็ก
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== Mobile Bottom Navigation Bar: 3 Main Kid-Friendly Buttons ==================== */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-amber-200 shadow-2xl px-3 py-2 pb-safe"
        aria-label="เมนูหลักสำหรับเด็ก (มือถือ)"
      >
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {MAIN_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 select-none cursor-pointer ${
                  isActive
                    ? `${tab.activeColor} scale-102`
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 active:scale-95'
                }`}
                title={tab.title}
              >
                <span className="text-2xl sm:text-3xl leading-tight drop-shadow-xs">
                  {tab.emoji}
                </span>
                <span className={`text-xs mt-0.5 leading-tight ${isActive ? 'font-black' : 'font-bold'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
