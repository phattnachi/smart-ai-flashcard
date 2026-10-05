'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Flashcard, DifficultyLevel } from '../types/flashcard';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardsGenerated: (newCards: Flashcard[]) => void;
}

const PRESET_TOPICS = [
  '🐾 สัตว์เลี้ยงแสนรัก (Cute Pets & Animals)',
  '🍎 ผลไม้แสนอร่อย (Sweet Fruits)',
  '🎨 สีสันรอบตัว (Colors & Shapes)',
  '🚗 ยานพาหนะเที่ยวสนุก (Cars & Vehicles)',
  '🧸 ของเล่นชิ้นโปรด (Toys & Games)',
  '👨‍👩‍👧 ครอบครัวสุขสันต์ (Family & Home)',
];

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onCardsGenerated,
}) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [cardCount, setCardCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('กรุณาเลือกหรือพิมพ์เรื่องที่ต้องการให้พี่ AI สร้างคำศัพท์นะจ๊ะ');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          difficulty,
          count: cardCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate flashcards');
      }

      if (data.cards && Array.isArray(data.cards) && data.cards.length > 0) {
        onCardsGenerated(data.cards);
        onClose();
      } else {
        throw new Error('ไม่ได้รับข้อมูลการ์ดที่สมบูรณ์จากระบบ');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'เกิดข้อผิดพลาดในการสร้างคำศัพท์ โปรดลองอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border-3 border-amber-300 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                <span>✨ สร้างการ์ดคำศัพท์ใหม่กับพี่ AI</span>
              </h3>
              <p className="text-xs text-amber-800 font-bold">
                อยากเรียนรู้คำศัพท์เรื่องอะไร เลือกหรือพิมพ์บอกพี่ AI ได้เลยนะจ๊ะ! 🎈
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-amber-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="mt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 text-xs flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Topics */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">
              🌟 หมวดหมู่ยอดนิยมสำหรับเด็ก 5-6 ขวบ:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TOPICS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTopic(p.split(' ')[1] || p)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition-colors text-left shadow-2xs hover:scale-102"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1">
              พิมพ์เรื่องที่อยากเรียนรู้ (Topic):
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="เช่น Animals, Fruits, Toys, School..."
              className="w-full px-4 py-2.5 rounded-2xl bg-amber-50/50 border-2 border-amber-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 font-bold shadow-2xs"
            />
          </div>

          {/* Options: Difficulty and Count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                ระดับความง่าย:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/50 border-2 border-amber-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-amber-400 font-bold"
              >
                <option value="Beginner">👶 ง่ายจัง (วัย 5-6 ขวบ)</option>
                <option value="Intermediate">🚀 ปานกลาง (ป.1 - ป.2)</option>
                <option value="Advanced">⭐ ท้าทายคนเก่ง</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                จำนวนการ์ด:
              </label>
              <select
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/50 border-2 border-amber-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-amber-400 font-bold"
              >
                <option value={3}>3 คำ</option>
                <option value={5}>5 คำ (แนะนำ)</option>
                <option value={8}>8 คำ</option>
              </select>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white shadow-md transition-all disabled:opacity-60 cursor-pointer hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>พี่ AI กำลังสร้างคำศัพท์จ้า...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>✨ สร้างคำศัพท์เลย!</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
