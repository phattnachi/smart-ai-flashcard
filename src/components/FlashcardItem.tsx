'use client';

import React from 'react';
import {
  Volume2,
  Mic,
  RotateCw,
  Star,
  Sparkles,
} from 'lucide-react';
import { Flashcard } from '../types/flashcard';

interface FlashcardItemProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onPlayWordAudio: (word: string) => void;
  onPlayWordAudioSlow?: (word: string) => void;
  onPlaySentenceAudio: (sentence: string) => void;
  onOpenMic: () => void;
  isSpeaking: boolean;
  isMastered: boolean;
  onToggleMastered: () => void;
  isMicPracticed?: boolean;
}

export const FlashcardItem: React.FC<FlashcardItemProps> = ({
  card,
  isFlipped,
  onFlip,
  onPlayWordAudio,
  onPlayWordAudioSlow,
  onPlaySentenceAudio,
  onOpenMic,
  isSpeaking,
  isMastered,
  onToggleMastered,
  isMicPracticed = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto h-[450px] sm:h-[480px] perspective-1000 select-none">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onFlip}
      >
        {/* ==================== FRONT OF CARD ==================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-7 sm:p-9 flex flex-col justify-between bg-white border-3 border-amber-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all">
          {/* Card Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                🏷️ {card.category}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                {card.partOfSpeech}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMastered();
              }}
              className={`p-2.5 rounded-2xl transition-all shadow-xs ${
                isMastered
                  ? 'bg-amber-400 text-amber-950 scale-110 shadow-amber-200 border-2 border-amber-500'
                  : 'bg-amber-50 hover:bg-amber-100 text-slate-400 hover:text-amber-500 border-2 border-amber-200'
              }`}
              title={isMastered ? 'คนเก่งจำคำนี้ได้แล้ว ⭐' : 'บันทึกว่าจำได้แล้ว'}
            >
              <Star
                className={`w-5 h-5 sm:w-6 sm:h-6 ${isMastered ? 'fill-amber-950 text-amber-950' : ''}`}
              />
            </button>
          </div>

          {/* Card Center: Word, Phonetic, Speech Controls */}
          <div className="flex flex-col items-center justify-center my-auto text-center space-y-4">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-4 py-1 rounded-full border border-amber-200 shadow-2xs">
              ✨ แฟลชการ์ดคำศัพท์แสนสนุก ✨
            </span>

            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 drop-shadow-2xs">
              {card.word}
            </h1>

            <p className="text-base sm:text-lg font-mono text-sky-700 font-bold bg-sky-50 px-4 py-1 rounded-xl border border-sky-200">
              {card.phonetic}
            </p>

            {/* Quick Actions Bar for 5-6 year olds */}
            <div className="flex items-center gap-2 sm:gap-2.5 pt-2 flex-wrap justify-center">
              {/* Normal Speed Audio */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayWordAudio(card.word);
                }}
                disabled={isSpeaking}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-sm ${
                  isSpeaking
                    ? 'bg-sky-400 text-white animate-pulse'
                    : 'bg-sky-500 hover:bg-sky-600 text-white hover:scale-105 active:scale-95 shadow-sky-200'
                }`}
                title="ฟังเสียงอ่านพี่เจ้าของภาษา"
              >
                <Volume2 className="w-4 h-4" />
                <span>🔊 ฟังเสียง</span>
              </button>

              {/* Slow Audio Button */}
              {onPlayWordAudioSlow && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayWordAudioSlow(card.word);
                  }}
                  disabled={isSpeaking}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 transition-all hover:scale-105 active:scale-95 shadow-2xs"
                  title="ฟังเสียงพูดแบบช้าๆ ชัดๆ"
                >
                  <span>🐢 ช้าๆ ชัดๆ</span>
                </button>
              )}

              {/* Practice Speaking Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenMic();
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  isMicPracticed
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200 ring-2 ring-emerald-300'
                    : 'bg-pink-500 hover:bg-pink-600 text-white shadow-sm shadow-pink-200 hover:scale-105 active:scale-95 animate-bounce-gentle'
                }`}
                title="เปิดไมค์เพื่อลองพูดตาม"
              >
                <Mic className="w-4 h-4" />
                <span>{isMicPracticed ? '🎤 ออกเสียงถูกต้องแล้ว ✅' : '🎤 ลองพูดตามเลย!'}</span>
              </button>
            </div>
          </div>

          {/* Card Footer Hint */}
          <div className="flex items-center justify-between text-xs text-amber-800 pt-3 border-t-2 border-amber-100 font-bold">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-amber-500" />
              👉 แตะที่การ์ดเพื่อพลิกดูความหมายนะคนเก่ง ✨
            </span>
            <span className="hidden sm:inline bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px] text-amber-800">
              กด Space เพื่อพลิก
            </span>
          </div>
        </div>

        {/* ==================== BACK OF CARD ==================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-7 sm:p-9 flex flex-col justify-between bg-white border-3 border-pink-200 shadow-md hover:shadow-xl text-slate-800">
          {/* Back Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black px-3.5 py-1 rounded-full bg-pink-100 text-pink-900 border border-pink-300">
                {card.word} ({card.partOfSpeech})
              </span>
              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                {card.phonetic}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {onPlayWordAudioSlow && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayWordAudioSlow(card.word);
                  }}
                  className="px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all border border-amber-300 text-xs font-bold"
                  title="ฟังแบบช้าๆ ชัดๆ"
                >
                  🐢 0.75x
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayWordAudio(card.word);
                }}
                className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 transition-all border border-sky-300"
                title="ฟังเสียงคำศัพท์"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Back Center: Meanings & Sentence */}
          <div className="my-auto space-y-3">
            {/* Thai Meaning */}
            <div className="space-y-1 bg-amber-50/80 p-4 rounded-2xl border-2 border-amber-200 text-center">
              <span className="text-[11px] font-black tracking-wider text-amber-800 uppercase block">
                ⭐ แปลว่าอะไรนะ?
              </span>
              <p className="text-2xl sm:text-3xl font-black text-amber-950">
                {card.thaiMeaning}
              </p>
            </div>

            {/* Example Sentence */}
            <div className="space-y-1.5 bg-sky-50/80 p-3.5 rounded-2xl border border-sky-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-wider text-sky-800 uppercase">
                  💬 ประโยคตัวอย่างน่ารัก
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaySentenceAudio(card.exampleSentence);
                  }}
                  className="p-1 rounded-lg text-sky-600 hover:bg-sky-100 transition-colors"
                  title="ฟังเสียงประโยคตัวอย่าง"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-900 font-bold">
                {card.exampleSentence}
              </p>
              <p className="text-xs text-sky-900 font-medium">
                {card.exampleTranslation}
              </p>
            </div>
          </div>

          {/* Back Footer */}
          <div className="flex items-center justify-between text-xs pt-2 border-t-2 border-pink-100 font-bold">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenMic();
              }}
              className={`flex items-center gap-1.5 font-black text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isMicPracticed
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200 animate-bounce-gentle'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isMicPracticed ? '🎤 ออกเสียงถูกต้องแล้ว ✅' : '🎤 ลองฝึกพูดตามเลย!'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMastered();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                isMastered
                  ? 'bg-amber-400 text-amber-950 shadow-2xs font-black border border-amber-500'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
              }`}
            >
              <Star className={`w-4 h-4 ${isMastered ? 'fill-amber-950 text-amber-950' : 'text-amber-600'}`} />
              <span>{isMastered ? 'จำได้แล้ว ⭐' : 'บันทึกว่าจำได้'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
