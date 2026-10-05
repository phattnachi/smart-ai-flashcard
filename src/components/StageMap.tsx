'use client';

import React from 'react';
import { Star, Lock, Sparkles } from 'lucide-react';
import { Stage, StageProgress } from '../types/stage';

interface StageMapProps {
  stages: Stage[];
  progress: Record<number, StageProgress>;
  onSelectStage: (stage: Stage) => void;
}

export const StageMap: React.FC<StageMapProps> = ({
  stages,
  progress,
  onSelectStage,
}) => {
  // Calculate total stars earned
  const totalStarsEarned = Object.values(progress).reduce((acc, p) => acc + (p.stars || 0), 0);
  const maxPossibleStars = stages.length * 3;
  const progressPercent = Math.round((totalStarsEarned / maxPossibleStars) * 100);

  // Find the highest unlocked stage that hasn't achieved 3 stars (active target)
  const activeStageId =
    stages.find((s) => progress[s.id]?.isUnlocked && (progress[s.id]?.stars || 0) < 3)?.id ||
    stages.find((s) => progress[s.id]?.isUnlocked)?.id ||
    1;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Banner: Colorful Adventure Island for 5-6 Year Olds */}
      <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-500 border-3 border-amber-300 shadow-xl shadow-amber-100 text-white overflow-hidden">
        <div className="absolute top-2 right-4 text-4xl opacity-20 pointer-events-none select-none">
          🎈🌈⭐
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/25 text-white border border-white/40 backdrop-blur-xs">
              <span className="text-sm">🗺️</span>
              <span>แผนที่ผจญภัยล่าดาว • 3 ดาวหรรษา 🎈</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              5 ด่านคำศัพท์สุดสนุกของคนเก่ง 🌟
            </h2>
            <p className="text-xs sm:text-sm text-amber-50 max-w-md font-bold leading-relaxed">
              กดเลือกด่านเพื่อเริ่มเรียนรู้คำศัพท์ และเล่นตอบคำถามสะสมดาว 3 ดวงให้ครบทุกด่านนะจ๊ะ!
            </p>
          </div>

          {/* Star Counter Card */}
          <div className="flex items-center gap-3.5 bg-white/25 backdrop-blur-md px-5 py-3 rounded-2xl border-2 border-white/40 shadow-sm shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-300 flex items-center justify-center text-slate-900 shadow-md animate-bounce-gentle">
              <Star className="w-7 h-7 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <span className="text-[11px] font-black text-white uppercase tracking-wider block">
                ⭐ ดาวของคนเก่ง
              </span>
              <p className="text-2xl sm:text-3xl font-black text-yellow-200 drop-shadow-xs">
                {totalStarsEarned}{' '}
                <span className="text-xs font-bold text-white">/ {maxPossibleStars} ดวง</span>
              </p>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-5 space-y-1.5 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span>ความสำเร็จในการผจญภัย:</span>
            <span className="font-mono text-yellow-200 font-black text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full h-3.5 bg-black/15 rounded-full overflow-hidden p-0.5 border-2 border-white/30">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 via-amber-300 to-white rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stepping Path (5 Learning Units) */}
      <div className="relative py-6 px-4 flex flex-col items-center space-y-10 sm:space-y-12">
        {stages.map((stage, idx) => {
          const stgProg = progress[stage.id] || {
            stageId: stage.id,
            stars: 0,
            isUnlocked: stage.id === 1,
            highScore: 0,
          };

          const isUnlocked = stgProg.isUnlocked;
          const stars = stgProg.stars || 0;
          const isCurrentActive = stage.id === activeStageId && isUnlocked;

          // Gentle winding path offsets (subtle on mobile to prevent overflow)
          const offsetPositions = [
            'translate-x-0',
            '-translate-x-4 sm:-translate-x-14',
            'translate-x-0',
            'translate-x-4 sm:translate-x-14',
            'translate-x-0',
          ];
          const offsetClass = offsetPositions[idx % offsetPositions.length];

          return (
            <div
              key={stage.id}
              className={`relative flex flex-col items-center transition-all ${offsetClass}`}
            >
              {/* Unit Node Button */}
              <button
                disabled={!isUnlocked}
                onClick={() => onSelectStage(stage)}
                className={`relative flex flex-col items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-3 shadow-md transition-all duration-300 group ${
                  isUnlocked
                    ? 'bg-white border-amber-300 hover:border-amber-400 hover:scale-110 active:scale-95 cursor-pointer shadow-amber-100 hover:shadow-xl'
                    : 'bg-slate-100 border-slate-300 opacity-60 cursor-not-allowed shadow-none'
                } ${
                  isCurrentActive
                    ? 'ring-4 ring-amber-400/60 border-amber-400 scale-105 shadow-lg shadow-amber-200'
                    : ''
                }`}
              >
                {/* Unit Number Badge */}
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-black bg-amber-400 text-amber-950 border border-amber-300 shadow-2xs whitespace-nowrap">
                  ด่าน {stage.id}
                </span>

                {/* Icon or Lock */}
                {isUnlocked ? (
                  <span className="text-4xl sm:text-5xl group-hover:scale-115 group-hover:rotate-6 transition-transform">
                    {stage.icon}
                  </span>
                ) : (
                  <Lock className="w-8 h-8 text-slate-400" />
                )}
              </button>

              {/* 3-Star Rating Row */}
              <div className="flex items-center gap-1.5 mt-3 bg-white px-3 py-1 rounded-full border-2 border-amber-200 shadow-xs">
                {[1, 2, 3].map((starIndex) => (
                  <Star
                    key={starIndex}
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                      starIndex <= stars
                        ? 'text-amber-400 fill-amber-400 scale-110'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                ))}
              </div>

              {/* Title & Unit Status */}
              <div className="text-center mt-2 max-w-[240px]">
                <p className="text-sm sm:text-base font-black text-slate-800 line-clamp-1">
                  {stage.title}
                </p>
                <p className="text-xs font-bold text-amber-700 mt-0.5">
                  {isUnlocked
                    ? stars === 3
                      ? '⭐ คว้า 3 ดาวเต็ม เก่งที่สุด!'
                      : stars >= 2
                      ? `✨ ผ่านแล้ว (${stars}/3 ดาว)`
                      : stars === 1
                      ? '🎈 ได้ 1 ดาว (ต้องได้ 2 ดาวเพื่อปลดล็อกด่านถัดไป)'
                      : '👉 คลิกเพื่อเริ่มเล่นด่านนี้เลย!'
                    : '🔒 ต้องได้ 2 ดาวในด่านก่อนหน้าเพื่อปลดล็อก'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
