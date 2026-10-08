'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Search,
  Volume2,
  Mic,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Flashcard } from '../types/flashcard';
import { CATEGORIES, WORD_EMOJIS } from '../data/mockCards';

interface FlashcardGridViewProps {
  cards: Flashcard[];
  allCards: Flashcard[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryCounts: Record<string, number>;
  masteredCount: number;
  onPlayWordAudio: (word: string) => void;
  onPlayWordAudioSlow?: (word: string) => void;
  onPlaySentenceAudio: (sentence: string) => void;
  onOpenMic: (card: Flashcard) => void;
  isSpeaking: boolean;
  masteredIds: Set<string>;
  onToggleMastered: (id: string) => void;
  onOpenAIGenerator: () => void;
}

// Map card to a friendly emoji for visual representation
export const getCardEmoji = (card: Flashcard): string => {
  if (WORD_EMOJIS[card.word]) return WORD_EMOJIS[card.word];

  // Check if meaning or word already contains an emoji
  const emojiRegex = /\p{Extended_Pictographic}/u;
  const matchThai = card.thaiMeaning?.match(emojiRegex);
  if (matchThai) return matchThai[0];

  const matchEng = card.englishMeaning?.match(emojiRegex);
  if (matchEng) return matchEng[0];

  // Category fallback
  switch (card.category) {
    case 'Animals':
      return '🐶';
    case 'School & Objects':
      return '🎒';
    case 'Fruits & Colors':
      return '🍎';
    case 'Nature':
      return '🌿';
    case 'Feelings & Daily':
      return '😊';
    default:
      return '🎴';
  }
};

// Category Pastel Styles for visual distinctiveness and toy-like feel
const CATEGORY_STYLES: Record<
  string,
  {
    bgGradient: string;
    imageBg: string;
    borderColor: string;
    badgeBg: string;
  }
> = {
  Animals: {
    bgGradient: 'from-amber-50/90 to-orange-50/60',
    imageBg: 'bg-gradient-to-tr from-amber-100 via-amber-50 to-orange-100 border-amber-200/90',
    borderColor: 'border-amber-300 hover:border-amber-400',
    badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
  },
  'School & Objects': {
    bgGradient: 'from-sky-50/90 to-blue-50/60',
    imageBg: 'bg-gradient-to-tr from-sky-100 via-sky-50 to-blue-100 border-sky-200/90',
    borderColor: 'border-sky-300 hover:border-sky-400',
    badgeBg: 'bg-sky-100 text-sky-950 border-sky-300',
  },
  'Fruits & Colors': {
    bgGradient: 'from-emerald-50/90 to-teal-50/60',
    imageBg: 'bg-gradient-to-tr from-emerald-100 via-emerald-50 to-teal-100 border-emerald-200/90',
    borderColor: 'border-emerald-300 hover:border-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
  },
  Nature: {
    bgGradient: 'from-teal-50/90 to-emerald-50/60',
    imageBg: 'bg-gradient-to-tr from-teal-100 via-teal-50 to-emerald-100 border-teal-200/90',
    borderColor: 'border-teal-300 hover:border-teal-400',
    badgeBg: 'bg-teal-100 text-teal-950 border-teal-300',
  },
  'Feelings & Daily': {
    bgGradient: 'from-pink-50/90 to-rose-50/60',
    imageBg: 'bg-gradient-to-tr from-pink-100 via-pink-50 to-rose-100 border-pink-200/90',
    borderColor: 'border-pink-300 hover:border-pink-400',
    badgeBg: 'bg-pink-100 text-pink-950 border-pink-300',
  },
};

const DEFAULT_STYLE = {
  bgGradient: 'from-purple-50/90 to-indigo-50/60',
  imageBg: 'bg-gradient-to-tr from-purple-100 via-purple-50 to-indigo-100 border-purple-200/90',
  borderColor: 'border-purple-300 hover:border-purple-400',
  badgeBg: 'bg-purple-100 text-purple-950 border-purple-300',
};

const kidCategoryIcons: Record<string, string> = {
  All: '🌟',
  Animals: '🐶',
  'School & Objects': '🎒',
  'Fruits & Colors': '🍎',
  Nature: '☀️',
  'Feelings & Daily': '😊',
};

export const FlashcardGridView: React.FC<FlashcardGridViewProps> = ({
  cards,
  allCards,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  categoryCounts,
  masteredCount,
  onPlayWordAudio,
  onPlayWordAudioSlow,
  onPlaySentenceAudio,
  onOpenMic,
  isSpeaking,
  masteredIds,
  onToggleMastered,
  onOpenAIGenerator,
}) => {
  // Modal state for enlarged card view
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);

  // Active bouncing card indicator for instant Click-to-Speak feedback
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);

  // Compute current index in the active cards list
  const currentCardIndex = useMemo(() => {
    if (!selectedCard) return -1;
    return cards.findIndex((c) => c.id === selectedCard.id);
  }, [cards, selectedCard]);

  // Click-to-Speak handler: Instant audio pronunciation on card tap
  const handleCardClick = (card: Flashcard) => {
    setSpeakingCardId(card.id);
    onPlayWordAudio(card.word);
    setTimeout(() => {
      setSpeakingCardId((prev) => (prev === card.id ? null : prev));
    }, 1100);
  };

  // Navigate next card in modal
  const handleNextCard = useCallback(() => {
    if (cards.length === 0 || currentCardIndex === -1) return;
    const nextIndex = (currentCardIndex + 1) % cards.length;
    setSelectedCard(cards[nextIndex]);
  }, [cards, currentCardIndex]);

  // Navigate prev card in modal
  const handlePrevCard = useCallback(() => {
    if (cards.length === 0 || currentCardIndex === -1) return;
    const prevIndex = (currentCardIndex - 1 + cards.length) % cards.length;
    setSelectedCard(cards[prevIndex]);
  }, [cards, currentCardIndex]);

  // Keyboard navigation for enlarged modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCard) return;
      if (e.key === 'Escape') {
        setSelectedCard(null);
      } else if (e.key === 'ArrowRight') {
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCard, handleNextCard, handlePrevCard]);

  // Merge predefined categories with any custom AI categories
  const allCategoryList = useMemo(() => {
    const predefinedIds = new Set(CATEGORIES.map((c) => c.id));
    const extraCategories: Array<{ id: string; label: string; iconEmoji: string }> = [];

    allCards.forEach((c) => {
      if (c.category && !predefinedIds.has(c.category)) {
        if (!extraCategories.some((ec) => ec.id === c.category)) {
          extraCategories.push({
            id: c.category,
            label: c.category,
            iconEmoji: '✨',
          });
        }
      }
    });

    return [
      ...CATEGORIES.map((c) => ({
        id: c.id,
        label: c.label.replace(/\s*\(.*?\)/g, ''), // Keep short Thai label for kids
        iconEmoji: kidCategoryIcons[c.id] || '🎈',
      })),
      ...extraCategories,
    ];
  }, [allCards]);

  return (
    <div className="w-full space-y-5">
      {/* ======================================================== */}
      {/* 1. TOP ACTION BAR (แถบเครื่องมือด้านบนสุด) */}
      {/* ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-sm space-y-3.5">
        {/* Row 1: Header Title & Big "Add Word" Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl select-none">🎴</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  คลังการ์ดคำศัพท์
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black border border-amber-300">
                  {allCards.length} คำ
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-bold">
                แตะที่การ์ดเพื่อฟังเสียงอ่านทันที 🔊
              </p>
            </div>
          </div>

          {/* Prominent "Add Word" Button */}
          <button
            onClick={onOpenAIGenerator}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-500 hover:from-amber-500 hover:to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/50 shrink-0 select-none group"
            title="เพิ่มคำศัพท์ใหม่ด้วย AI"
          >
            <Sparkles className="w-4 h-4 text-yellow-200 group-hover:rotate-12 transition-transform" />
            <span>✨ เพิ่มคำศัพท์ใหม่ (Add Word)</span>
          </button>
        </div>

        {/* Row 2: Category Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Category Pills (Horizontal Scrollable) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar flex-1">
            {allCategoryList.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === 'All' ? allCards.length : categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 border-2 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-amber-400 text-amber-950 border-amber-400 shadow-sm shadow-amber-200 scale-102'
                      : 'bg-amber-50/60 hover:bg-amber-100/80 text-slate-700 border-amber-200/70 hover:border-amber-300'
                  }`}
                >
                  <span className="text-sm">{cat.iconEmoji}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected
                        ? 'bg-amber-200 text-amber-950'
                        : 'bg-white text-slate-600 border border-amber-200'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box & Mastered Stats */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500" />
              <input
                type="text"
                placeholder="🔍 ค้นหาคำศัพท์ (Cat, Dog)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-7 py-2 rounded-2xl text-xs bg-amber-50/50 border-2 border-amber-200 text-slate-800 placeholder-slate-400 font-bold focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-200 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/60"
                  title="ล้างข้อความค้นหา"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Star Bookmark Pill */}
            <div
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100/90 border-2 border-amber-300 text-amber-950 text-xs font-black shadow-2xs shrink-0 select-none"
              title="จำนวนคำที่บันทึกว่าจำได้แล้ว"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>
                จำได้ {masteredCount}/{allCards.length} คำ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. IMAGE-FIRST CARDS GRID (เน้นรูปภาพขนาดใหญ่ 60-70% ข้อความ 2 บรรทัด) */}
      {/* ======================================================== */}
      {cards.length === 0 ? (
        /* Empty State */
        <div className="bg-white/90 rounded-3xl p-10 text-center border-2 border-dashed border-amber-300 space-y-3.5 max-w-md mx-auto shadow-xs">
          <div className="text-5xl animate-bounce-gentle select-none">🎈</div>
          <h3 className="text-base sm:text-lg font-black text-slate-800">
            ไม่พบคำศัพท์ที่ค้นหา
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            ลองเลือกหมวดหมู่อื่นดูนะคนเก่ง 🌟
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => {
                onSearchChange('');
                onSelectCategory('All');
              }}
              className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-2xs transition-all cursor-pointer"
            >
              🌟 ดูคำศัพท์ทั้งหมด
            </button>
          </div>
        </div>
      ) : (
        /* Responsive Grid: 2 columns on mobile, 3-4 columns on tablet/desktop */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {cards.map((card) => {
            const isMastered = masteredIds.has(card.id);
            const emoji = getCardEmoji(card);
            const style = CATEGORY_STYLES[card.category] || DEFAULT_STYLE;
            const isSpeakingThis = speakingCardId === card.id;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`group relative rounded-[2rem] p-3 sm:p-4 border-3 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                  style.borderColor
                } bg-gradient-to-b ${style.bgGradient} ${
                  isSpeakingThis
                    ? 'scale-105 shadow-xl ring-4 ring-amber-400 -translate-y-1.5'
                    : 'shadow-md hover:shadow-xl hover:-translate-y-1.5 active:scale-95'
                }`}
                title="แตะที่การ์ดเพื่อฟังเสียงอ่านทันที 🔊"
              >
                {/* Top Corner Controls (Star Bookmark on Left, Audio / Practice on Right) */}
                <div className="flex items-center justify-between gap-1 w-full z-10">
                  {/* Star Bookmark */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMastered(card.id);
                    }}
                    className={`p-1.5 rounded-2xl transition-all cursor-pointer ${
                      isMastered
                        ? 'bg-amber-200/90 text-amber-500 scale-110 shadow-xs'
                        : 'bg-white/80 text-slate-300 hover:text-amber-400 hover:bg-white shadow-2xs'
                    }`}
                    title={isMastered ? 'คนเก่งจำคำนี้ได้แล้ว ⭐' : 'บันทึกว่าจำได้แล้ว'}
                  >
                    <Star
                      className={`w-4 h-4 ${isMastered ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                  </button>

                  {/* Corner Badges: Speaker sound indicator & Practice/Detail modal button */}
                  <div className="flex items-center gap-1">
                    {/* Quick Speaker Indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isSpeakingThis
                          ? 'bg-amber-400 text-slate-900 scale-110 shadow-md animate-bounce-gentle'
                          : 'bg-white/80 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-800 shadow-2xs'
                      }`}
                      title="กดฟังเสียง 🔊"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Speech Practice & Detail Modal Trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCard(card);
                      }}
                      className="w-7 h-7 rounded-full bg-white/80 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer hover:scale-110"
                      title="ฝึกพูดกับ AI และดูรายละเอียด 🎙️"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* CENTER: EXTRA LARGE PICTURE / CARTOON (60-70% OF CARD) */}
                {/* ======================================================== */}
                <div className="my-2.5 flex-1 flex items-center justify-center">
                  <div
                    className={`w-full aspect-square max-w-[170px] sm:max-w-[190px] rounded-[1.75rem] ${style.imageBg} border-2 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300`}
                  >
                    <span className="text-6xl sm:text-7xl lg:text-8xl select-none filter drop-shadow-md">
                      {emoji}
                    </span>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* BOTTOM: MINIMALIST TEXT (ONLY 2 MAIN LINES!) */}
                {/* ======================================================== */}
                <div className="text-center pt-1 pb-1 space-y-1 z-10">
                  {/* Line 1: Big Bold English Word (e.g. Dog, Cat) */}
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight group-hover:scale-105 transition-transform">
                    {card.word}
                  </h3>

                  {/* Line 2: Short Thai Reading (e.g. ด็อก, แคท) */}
                  <div className="inline-flex items-center justify-center">
                    <span
                      className={`text-xs sm:text-sm font-black px-3 py-0.5 rounded-full border shadow-2xs ${style.badgeBg}`}
                    >
                      {card.thaiReading || card.phonetic}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ENLARGED PRACTICE MODAL (หน้าต่างฝึกพูดกับ AI & ดูตัวอย่าง) */}
      {/* ======================================================== */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-amber-300 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-amber-100 pb-3">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                🏷️ {selectedCard.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleMastered(selectedCard.id)}
                  className={`p-2 rounded-2xl transition-all cursor-pointer ${
                    masteredIds.has(selectedCard.id)
                      ? 'bg-amber-100 text-amber-500 scale-105'
                      : 'bg-slate-100 text-slate-400 hover:text-amber-500'
                  }`}
                  title={
                    masteredIds.has(selectedCard.id)
                      ? 'คนเก่งจำคำนี้ได้แล้ว ⭐'
                      : 'บันทึกว่าจำได้แล้ว'
                  }
                >
                  <Star
                    className={`w-5 h-5 ${
                      masteredIds.has(selectedCard.id)
                        ? 'fill-amber-400 text-amber-400'
                        : ''
                    }`}
                  />
                </button>

                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  title="ปิดหน้าต่าง"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="text-center space-y-4">
              {/* Giant Emoji Illustration */}
              <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-100 via-pink-100 to-indigo-100 border-2 border-amber-200 flex items-center justify-center text-7xl shadow-md">
                {getCardEmoji(selectedCard)}
              </div>

              {/* Big Word & Reading */}
              <div className="space-y-1">
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {selectedCard.word}
                </h2>
                <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 font-black text-base sm:text-lg">
                  <span>อ่านว่า:</span>
                  <span>{selectedCard.thaiReading || selectedCard.phonetic}</span>
                </div>
              </div>

              {/* Meaning */}
              <div className="text-lg sm:text-xl font-black text-slate-700">
                {selectedCard.thaiMeaning}
              </div>

              {/* Example Sentence Box */}
              {selectedCard.exampleSentence && (
                <div className="bg-sky-50/80 rounded-2xl p-3.5 border border-sky-200 text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-sky-800 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                      <span>ตัวอย่างประโยค</span>
                    </span>
                    <button
                      onClick={() => onPlaySentenceAudio(selectedCard.exampleSentence)}
                      className="inline-flex items-center gap-1 text-[11px] font-black text-sky-700 hover:text-sky-900 bg-sky-100 hover:bg-sky-200 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                      title="ฟังประโยคตัวอย่าง"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>ฟังเสียง</span>
                    </button>
                  </div>
                  <p className="text-sm font-bold text-slate-800 italic">
                    &ldquo;{selectedCard.exampleSentence}&rdquo;
                  </p>
                  {selectedCard.exampleTranslation && (
                    <p className="text-xs text-slate-600 font-medium">
                      แปลว่า: {selectedCard.exampleTranslation}
                    </p>
                  )}
                </div>
              )}

              {/* Audio & Speech Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => onPlayWordAudio(selectedCard.word)}
                  disabled={isSpeaking}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs sm:text-sm shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>🔊 ฟังเสียงปกติ</span>
                </button>

                {onPlayWordAudioSlow && (
                  <button
                    onClick={() => onPlayWordAudioSlow(selectedCard.word)}
                    disabled={isSpeaking}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs sm:text-sm border border-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>🐢 ช้าๆ ชัดๆ</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onOpenMic(selectedCard);
                    setSelectedCard(null);
                  }}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-white" />
                  <span>🎙️ ฝึกออกเสียงกับ AI</span>
                </button>
              </div>
            </div>

            {/* Modal Footer: Prev / Next Navigation */}
            <div className="flex items-center justify-between border-t border-amber-100 pt-3">
              <button
                onClick={handlePrevCard}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>คำก่อนหน้า</span>
              </button>

              <span className="text-xs font-bold text-slate-400">
                {currentCardIndex >= 0 ? `${currentCardIndex + 1} / ${cards.length}` : ''}
              </span>

              <button
                onClick={handleNextCard}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 transition-colors cursor-pointer"
              >
                <span>คำถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
