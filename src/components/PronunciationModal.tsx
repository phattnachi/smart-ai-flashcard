'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  CheckCircle2,
  AlertCircle,
  Activity,
  Keyboard,
} from 'lucide-react';
import { Flashcard, PronunciationResult } from '../types/flashcard';
import { evaluatePronunciation } from '../utils/speechSimilarity';
import confetti from 'canvas-confetti';

interface PronunciationModalProps {
  card: Flashcard;
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  result: PronunciationResult | null;
  audioLevel: number;
  hasPermission: boolean | null;
  onStartListening: () => void;
  onStopListening: () => void;
  onPlayTargetWord: () => void;
  onSuccess?: (card: Flashcard, score: number) => void;
  passingScore?: number;
}

export const PronunciationModal: React.FC<PronunciationModalProps> = ({
  card,
  isOpen,
  onClose,
  isListening,
  transcript,
  interimTranscript,
  error,
  result,
  audioLevel,
  hasPermission,
  onStartListening,
  onStopListening,
  onPlayTargetWord,
  onSuccess,
  passingScore = 65,
}) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualText, setManualText] = useState('');
  const [localResult, setLocalResult] = useState<PronunciationResult | null>(null);
  const hasCelebratedRef = useRef(false);

  useEffect(() => {
    setLocalResult(null);
    setManualText('');
    hasCelebratedRef.current = false;
  }, [card?.id, isOpen]);

  const activeResult = result || localResult;

  useEffect(() => {
    if (activeResult && activeResult.score >= passingScore && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      onSuccess?.(card, activeResult.score);

      // Light, subtle celebratory sparkle - small count so it never covers the screen!
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#fbbf24', '#f43f5e', '#38bdf8', '#34d399'],
        ticks: 120,
      });
    }
  }, [activeResult, card, onSuccess]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    hasCelebratedRef.current = false;
    onStartListening();
  };

  const handleManualEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    hasCelebratedRef.current = false;
    const res = evaluatePronunciation(manualText.trim(), card.word);
    setLocalResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border-t-4 sm:border-3 border-pink-300 rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 sm:p-7 text-slate-800 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-pink-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="p-2 sm:p-2.5 rounded-2xl bg-pink-100 text-pink-600 border border-pink-300 shrink-0">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-black text-slate-900 truncate">
                🎤 มาฝึกพูดกับพี่ AI กันเถอะ!
              </h3>
              <p className="text-[11px] sm:text-xs text-pink-800 font-bold truncate">พูดคำศัพท์ตามเสียง แล้วมาลุ้นคะแนนกันนะ</p>
            </div>
          </div>
          <button
            onClick={() => {
              confetti.reset();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-pink-50 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target word section */}
        <div className="my-3 sm:my-5 text-center space-y-1.5 sm:space-y-2">
          <span className="text-[10px] sm:text-xs font-black px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            🏷️ {card.category} • {card.partOfSpeech}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight drop-shadow-2xs">
            {card.word}
          </h2>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base font-mono font-bold text-sky-700 bg-sky-50 px-2.5 sm:px-3 py-0.5 rounded-xl border border-sky-200">
              {card.phonetic}
            </span>
            <button
              onClick={onPlayTargetWord}
              className="p-1.5 sm:p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 transition-colors border border-sky-300"
              title="ฟังเสียงต้นแบบพี่เจ้าของภาษา"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs sm:text-sm font-black text-amber-900">
            แปลว่า: {card.thaiMeaning}
          </p>
        </div>

        {/* Speech Recognition Controls */}
        <div className="my-5 flex flex-col items-center justify-center gap-4">
          {/* Mic Button */}
          <div className="relative flex items-center justify-center">
            {isListening && (
              <div
                className="absolute rounded-full bg-pink-500/20 transition-all duration-100 animate-ping"
                style={{
                  width: `${90 + audioLevel * 0.9}px`,
                  height: `${90 + audioLevel * 0.9}px`,
                }}
              />
            )}

            <button
              onClick={isListening ? onStopListening : handleStartListening}
              className={`relative z-10 flex items-center justify-center w-22 h-22 rounded-3xl transition-all duration-300 shadow-md cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white ring-4 ring-rose-200 shadow-rose-200 scale-105'
                  : 'bg-gradient-to-tr from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white shadow-pink-200 hover:scale-110 active:scale-95'
              }`}
            >
              {isListening ? (
                <MicOff className="w-9 h-9" />
              ) : (
                <Mic className="w-9 h-9" />
              )}
            </button>
          </div>

          {/* Status and Audio Level Meter */}
          <div className="text-center space-y-2 w-full max-w-xs">
            {isListening ? (
              <div className="space-y-2">
                <span className="text-xs font-black text-rose-500 flex items-center justify-center gap-1.5 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  พี่ AI กำลังฟังอยู่จ้า... พูดคำนี้ได้เลยนะคนเก่ง!
                </span>

                {/* Audio level meter */}
                <div className="flex items-center justify-center gap-2 h-5">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span className="text-xs text-slate-500 font-bold">ระดับเสียง:</span>
                  <div className="w-28 h-3 bg-pink-100 rounded-full overflow-hidden p-0.5 border border-pink-200">
                    <div
                      className="h-full bg-pink-500 transition-all duration-75 rounded-full"
                      style={{ width: `${Math.max(8, audioLevel)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {audioLevel}%
                  </span>
                </div>
              </div>
            ) : activeResult && activeResult.score >= passingScore ? (
              <div className="space-y-1 animate-in fade-in-50 duration-200">
                <div className="px-4 py-2 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>🎉 ว้าว! ออกเสียงถูกต้อง เก่งที่สุดเลย! (ผ่านแล้ว ✅)</span>
                </div>
                <span className="text-xs text-slate-500 font-bold block">
                  กดปิดหน้าต่างเพื่อไปคำถัดไป หรือซ้อมพูดใหม่อีกรอบได้นะจ๊ะ
                </span>
              </div>
            ) : activeResult && activeResult.score < passingScore ? (
              <div className="space-y-1 animate-in fade-in-50 duration-200">
                <div className="px-4 py-2 rounded-2xl bg-rose-100 border-2 border-rose-300 text-rose-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>🌱 ยังออกเสียงไม่ถูกต้องนะจ๊ะ (ได้ {activeResult.score}%)</span>
                </div>
                <span className="text-xs text-rose-700 font-bold block">
                  ⚠️ ต้องออกเสียงให้ได้ {passingScore}% ขึ้นไป ถึงจะผ่านคำนี้นะคนเก่ง!
                </span>
              </div>
            ) : (
              <div className="space-y-0.5">
                <span className="text-xs text-slate-700 font-black block">
                  👉 กดปุ่มไมค์เพื่อเริ่มทดสอบออกเสียง
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  (ระบบจะหยุดฟังอัตโนมัติเมื่อออกเสียงถูกต้อง)
                </span>
              </div>
            )}

            {/* Interim Live Transcript */}
            {interimTranscript && (
              <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-200">
                <p className="text-xs font-bold text-sky-800 italic">
                  พี่ AI ได้ยินว่า: &quot;{interimTranscript}&quot;
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs text-left max-w-sm font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <p>{error}</p>
                {hasPermission === false && (
                  <p className="text-[11px] text-rose-700 mt-0.5 font-normal">
                    กรุณากดไอคอนแม่กุญแจที่แถบ URL แล้วเลือก &quot;Allow Microphone&quot; นะจ๊ะ
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Evaluation Card */}
        {activeResult && (
          <div
            className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
              activeResult.accuracy === 'perfect'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : activeResult.accuracy === 'great'
                ? 'bg-sky-50 border-sky-300 text-sky-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 font-black text-xs sm:text-sm">
              <span>
                {activeResult.accuracy === 'perfect'
                  ? '🌟 ระดับยอดเยี่ยม: ชัดเป๊ะเหมือนเจ้าของภาษา!'
                  : activeResult.accuracy === 'great'
                  ? '🎉 ระดับดีมาก: ออกเสียงชัดเจนเก่งมากเลย'
                  : '🌱 ลองใหม่อีกนิดนะคนเก่ง สู้ๆ จ้า'}
              </span>
              <span className="font-mono text-sm">
                {activeResult.score}%
              </span>
            </div>

            <div className="w-full bg-white rounded-full h-3 overflow-hidden mb-2.5 border border-slate-200">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  activeResult.accuracy === 'perfect'
                    ? 'bg-emerald-500'
                    : activeResult.accuracy === 'great'
                    ? 'bg-sky-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${activeResult.score}%` }}
              />
            </div>

            <div className="space-y-0.5 text-xs font-bold">
              <p>
                <span className="text-slate-500">คำที่พี่ AI ได้ยิน: </span>
                <span className="font-mono font-black text-slate-900">
                  &quot;{activeResult.transcript}&quot;
                </span>
              </p>
              <p className="text-xs pt-0.5 text-slate-700 font-medium">{activeResult.feedback}</p>
            </div>
          </div>
        )}

        {/* Manual Fallback Input */}
        <div className="mt-3.5 pt-3 border-t-2 border-pink-100">
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[11px] text-pink-700 hover:text-pink-900 flex items-center gap-1 transition-colors font-bold"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{showManualInput ? 'ซ่อนโหมดพิมพ์ข้อความ' : 'ไมค์ไม่สะดวก? ลองพิมพ์คำตอบตรงนี้'}</span>
          </button>

          {showManualInput && (
            <form onSubmit={handleManualEvaluate} className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder={`พิมพ์คำว่า "${card.word}"...`}
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-amber-50 border-2 border-amber-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 font-bold"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 text-white text-xs font-black shadow-2xs hover:scale-105 transition-all"
              >
                ตรวจคำตอบ ✨
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3.5 pt-3 border-t-2 border-pink-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-black bg-pink-100 hover:bg-pink-200 text-pink-900 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
