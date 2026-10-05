'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCw,
  Play,
  Pause,
  BookOpen,
} from 'lucide-react';
import { Flashcard } from '../types/flashcard';
import { FlashcardItem } from './FlashcardItem';

interface FlashcardDeckProps {
  cards: Flashcard[];
  onPlayWordAudio: (word: string) => void;
  onPlayWordAudioSlow?: (word: string) => void;
  onPlaySentenceAudio: (sentence: string) => void;
  onOpenMic: (card: Flashcard) => void;
  isSpeaking: boolean;
  masteredIds: Set<string>;
  onToggleMastered: (id: string) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  onPlayWordAudio,
  onPlayWordAudioSlow,
  onPlaySentenceAudio,
  onOpenMic,
  isSpeaking,
  masteredIds,
  onToggleMastered,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards.length]);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = useCallback(() => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * cards.length);
    setCurrentIndex(randomIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev]);

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlay && cards.length > 0) {
      timer = setInterval(() => {
        setIsFlipped((prev) => {
          if (!prev) {
            return true;
          } else {
            handleNext();
            return false;
          }
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlay, cards.length, handleNext]);

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-72 rounded-3xl bg-white border-2 border-dashed border-amber-300 text-center p-8 shadow-xs">
        <span className="text-5xl mb-2">🧸</span>
        <h3 className="text-xl font-black text-slate-800">ยังไม่มีคำศัพท์ในหมวดนี้จ้า</h3>
        <p className="text-xs font-bold text-slate-500 mt-1">
          เลือกหมวดหมู่อื่น หรือกดปุ่ม &quot;เพิ่มคำศัพท์ AI&quot; ได้เลยนะคนเก่ง!
        </p>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="w-full flex flex-col items-center space-y-5">
      {/* Progress Bar & Counter */}
      <div className="w-full max-w-xl flex items-center justify-between gap-4 text-xs font-black text-slate-700 bg-white px-5 py-2.5 rounded-2xl border-2 border-amber-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-800">
            ⭐ การ์ดที่ {currentIndex + 1}
          </span>
          <span>/</span>
          <span>{cards.length} ใบ</span>
        </div>

        <div className="flex-1 max-w-xs h-3 bg-amber-100 rounded-full overflow-hidden p-0.5 border border-amber-200">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="font-mono text-pink-600 font-black text-xs">
          {progressPercent}%
        </span>
      </div>

      {/* 3D Flashcard Display */}
      <FlashcardItem
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        onPlayWordAudio={onPlayWordAudio}
        onPlayWordAudioSlow={onPlayWordAudioSlow}
        onPlaySentenceAudio={onPlaySentenceAudio}
        onOpenMic={() => onOpenMic(currentCard)}
        isSpeaking={isSpeaking}
        isMastered={masteredIds.has(currentCard.id)}
        onToggleMastered={() => onToggleMastered(currentCard.id)}
      />

      {/* Control Buttons Bar */}
      <div className="w-full max-w-xl flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white border-2 border-amber-200 shadow-md">
        {/* Shuffle Button */}
        <button
          onClick={handleShuffle}
          className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors border border-amber-300 font-bold"
          title="สุ่มคำศัพท์ (Shuffle)"
        >
          <Shuffle className="w-4 h-4" />
        </button>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-black text-xs border border-sky-300 transition-colors"
          title="การ์ดก่อนหน้า"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">ก่อนหน้า</span>
        </button>

        {/* Flip Button */}
        <button
          onClick={handleFlip}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-black text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <RotateCw className="w-4 h-4" />
          <span>{isFlipped ? 'ดูหน้าการ์ด' : 'พลิกดูคำแปล ✨'}</span>
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-black text-xs border border-sky-300 transition-colors"
          title="การ์ดถัดไป"
        >
          <span className="hidden sm:inline">ถัดไป</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Auto Play Slideshow Toggle */}
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`p-3 rounded-2xl transition-colors border font-bold ${
            isAutoPlay
              ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
          }`}
          title={isAutoPlay ? 'หยุดเล่นอัตโนมัติ' : 'เล่นการ์ดวนอัตโนมัติ (Auto-play)'}
        >
          {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="text-center text-xs text-amber-900 space-x-2 hidden sm:block font-bold">
        <span>คีย์ลัด:</span>
        <kbd className="px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-300 font-mono text-amber-900 text-[11px]">
          Space
        </kbd>{' '}
        <span>พลิกการ์ด</span>
        <kbd className="px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-300 font-mono text-amber-900 text-[11px]">
          ←
        </kbd>{' '}
        <span>ย้อนกลับ</span>
        <kbd className="px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-300 font-mono text-amber-900 text-[11px]">
          →
        </kbd>{' '}
        <span>ถัดไป</span>
      </div>
    </div>
  );
};
