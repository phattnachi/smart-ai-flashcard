'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, Lock, Sparkles, ChevronRight, X, AlertCircle } from 'lucide-react';
import { Stage, StageProgress } from '../types/stage';

interface StageMapProps {
  stages: Stage[];
  progress: Record<number, StageProgress>;
  onSelectStage: (stage: Stage) => void;
}

interface LockedFeedback {
  stageId: number;
  message: string;
  prevStageId: number;
}

/**
 * Synthesizes a soft, gentle notification chime via Web Audio API.
 * Follows HCI Multimodal Feedback principles: non-startling, friendly sound.
 */
function playGentleWarningSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Gentle warm two-tone melodic chime (330Hz -> 260Hz)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine'; // Smooth pure tone
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.22);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  } catch {
    // Graceful fallback if audio is not permitted yet
  }
}

/**
 * Synthesizes a bright, cheerful click sound for unlocked stages.
 */
function playStageClickSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  } catch {
    // Graceful fallback
  }
}

export const StageMap: React.FC<StageMapProps> = ({
  stages,
  progress,
  onSelectStage,
}) => {
  // Feedback state for locked nodes
  const [shakingStageId, setShakingStageId] = useState<number | null>(null);
  const [lockedFeedback, setLockedFeedback] = useState<LockedFeedback | null>(null);
  const shakeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total stars earned
  const totalStarsEarned = Object.values(progress).reduce((acc, p) => acc + (p.stars || 0), 0);
  const maxPossibleStars = stages.length * 3;
  const progressPercent = Math.round((totalStarsEarned / maxPossibleStars) * 100);

  // Find the current active stage target (highest unlocked stage with < 3 stars, or highest unlocked)
  const activeStageId =
    stages.find((s) => progress[s.id]?.isUnlocked && (progress[s.id]?.stars || 0) < 3)?.id ||
    stages.find((s) => progress[s.id]?.isUnlocked)?.id ||
    1;

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Handle stage node click with HCI System Feedback & Error Prevention
  const handleStageClick = (stage: Stage, isUnlocked: boolean) => {
    if (isUnlocked) {
      playStageClickSound();
      setLockedFeedback(null);
      onSelectStage(stage);
    } else {
      // 1. Play gentle audio warning
      playGentleWarningSound();

      // 2. Micro-interaction: Shake/Wiggle animation
      setShakingStageId(stage.id);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => {
        setShakingStageId(null);
      }, 600);

      // 3. Informative, friendly Toast feedback
      const prevStage = stages.find((s) => s.id === stage.id - 1);
      const prevTitle = prevStage ? `ด่านที่ ${prevStage.id}` : 'ด่านก่อนหน้า';

      setLockedFeedback({
        stageId: stage.id,
        message: `ต้องสะสมดาวให้ผ่าน${prevTitle}อย่างน้อย 2 ดาวก่อนนะจ๊ะคนเก่ง! ⭐`,
        prevStageId: stage.id - 1,
      });

      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setLockedFeedback(null);
      }, 5000);
    }
  };

  // Navigate directly to previous stage to resolve error (HCI Error Recovery)
  const handleGoToPrevStage = (prevId: number) => {
    const target = stages.find((s) => s.id === prevId);
    if (target) {
      setLockedFeedback(null);
      playStageClickSound();
      onSelectStage(target);
    }
  };

  // Winding Path horizontal offsets (Winding S-Curve Path)
  // Stage 1 (Start): Left
  // Stage 2: Center-Right
  // Stage 3: Far Right
  // Stage 4: Center-Left
  // Stage 5: Center Top (Peak / Summit)
  const windingOffsets: Record<number, string> = {
    1: '-translate-x-12 sm:-translate-x-28',
    2: 'translate-x-8 sm:translate-x-18',
    3: 'translate-x-16 sm:translate-x-32',
    4: '-translate-x-10 sm:-translate-x-22',
    5: 'translate-x-0',
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300 relative">
      {/* Top Banner: Adventure Island Progress Bar */}
      <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-500 border-3 border-amber-300 shadow-xl shadow-amber-100 text-white overflow-hidden">
        <div className="absolute top-2 right-4 text-4xl opacity-20 pointer-events-none select-none">
          🎈🌈⭐
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/25 text-white border border-white/40 backdrop-blur-xs">
              <span className="text-sm">🗺️</span>
              <span>แผนที่ผจญภัยเกาะมหาสมบัติ • 5 ด่าน 3 ดาว 🎈</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              เส้นทางผจญภัยล่าดาวคนเก่ง 🌟
            </h2>
            <p className="text-xs sm:text-sm text-amber-50 max-w-md font-bold leading-relaxed">
              เดินตามเส้นทางคดเคี้ยว สะสมดาวให้ครบ 3 ดวงเพื่อพิชิตยอดเขานะจ๊ะ!
            </p>
          </div>

          {/* Star Counter Card */}
          <div className="flex items-center gap-3 bg-white/25 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl border-2 border-white/40 shadow-sm shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-300 flex items-center justify-center text-slate-900 shadow-md animate-bounce-gentle">
              <Star className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <span className="text-[11px] font-black text-white uppercase tracking-wider block">
                ⭐ ดาวสะสม
              </span>
              <p className="text-2xl sm:text-3xl font-black text-yellow-200 drop-shadow-xs">
                {totalStarsEarned}{' '}
                <span className="text-xs font-bold text-white">/ {maxPossibleStars} ดวง</span>
              </p>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-4 space-y-1 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span>ความก้าวหน้าการผจญภัย:</span>
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

      {/* ========================================================================= */}
      {/* Winding Adventure Path (Stepping Stones with Connecting Trails) */}
      {/* ========================================================================= */}
      <div className="relative py-6 sm:py-10 px-4 flex flex-col items-center">
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
          const isShaking = shakingStageId === stage.id;
          const isShowingNodeTooltip = lockedFeedback?.stageId === stage.id;
          const isSummit = stage.id === 5;

          const offsetClass = windingOffsets[stage.id] || 'translate-x-0';

          return (
            <React.Fragment key={stage.id}>
              {/* Stepping Connector Trail (between stages) */}
              {idx > 0 && (
                <div className="my-3 sm:my-4 flex flex-col items-center justify-center pointer-events-none select-none relative z-0">
                  {/* Stepping Stone Dots along the curved path */}
                  <div className="flex flex-col items-center gap-2">
                    {[1, 2, 3].map((dot) => {
                      const isPathUnlocked = isUnlocked;
                      return (
                        <div
                          key={dot}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-300 shadow-2xs ${
                            isPathUnlocked
                              ? 'bg-amber-300 border-amber-400 scale-100 shadow-amber-200'
                              : 'bg-slate-200 border-dashed border-slate-300 scale-90 opacity-60'
                          }`}
                          style={{
                            transform: `scale(${0.9 + dot * 0.05})`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stage Node Container */}
              <div
                className={`relative flex flex-col items-center transition-all duration-300 ${offsetClass} ${
                  isShaking ? 'animate-shake-stage' : ''
                }`}
              >
                {/* Active Stage Pointer Indicator (Visual Hierarchy) */}
                {isCurrentActive && (
                  <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs font-black shadow-lg shadow-amber-300/60 animate-bounce whitespace-nowrap border-2 border-white">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>ด่านปัจจุบัน! ⚡</span>
                  </div>
                )}

                {/* Summit Special Crown Indicator for Stage 5 */}
                {isSummit && isUnlocked && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 text-2xl select-none animate-bounce-gentle">
                    👑
                  </div>
                )}

                {/* Inline Cute Tooltip on Locked Click (Point 4: HCI Immediate Feedback) */}
                {isShowingNodeTooltip && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-40 w-64 p-2.5 bg-slate-900/95 text-white text-xs font-bold rounded-2xl shadow-2xl text-center border-2 border-amber-300 animate-in fade-in zoom-in-90 duration-200">
                    <p className="flex items-center justify-center gap-1 text-amber-300">
                      <span>🔒 ด่านนี้ยังล็อกอยู่จ้า!</span>
                    </p>
                    <p className="text-[11px] text-slate-200 font-medium mt-0.5">
                      ต้องสะสมดาวในด่านที่ {stage.id - 1} ให้ได้ 2 ดาวก่อนนะจ๊ะ ⭐
                    </p>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 rotate-45 border-r-2 border-b-2 border-amber-300" />
                  </div>
                )}

                {/* Radar Ping Ripple for Current Active Stage */}
                {isCurrentActive && (
                  <span className="absolute -inset-2 rounded-3xl sm:rounded-4xl bg-amber-400/35 animate-ping pointer-events-none" />
                )}

                {/* Stage Node Button */}
                <button
                  type="button"
                  aria-label={`ด่านที่ ${stage.id}: ${stage.title} (${isUnlocked ? 'ปลดล็อกแล้ว' : 'ยังล็อกอยู่'})`}
                  onClick={() => handleStageClick(stage, isUnlocked)}
                  className={`relative flex flex-col items-center justify-center w-22 h-22 sm:w-28 sm:h-28 rounded-3xl border-3 shadow-md transition-all duration-300 group cursor-pointer select-none ${
                    isUnlocked
                      ? 'bg-white border-amber-300 hover:border-amber-400 hover:scale-110 active:scale-95 shadow-amber-100 hover:shadow-xl'
                      : 'bg-slate-100 border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:scale-95 shadow-2xs opacity-85'
                  } ${
                    isCurrentActive
                      ? 'animate-pulse-glow ring-4 ring-amber-400/80 border-amber-400 scale-108 shadow-2xl shadow-amber-300/80'
                      : ''
                  }`}
                >
                  {/* Unit Number Badge */}
                  <span
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-black border shadow-2xs whitespace-nowrap transition-colors ${
                      isUnlocked
                        ? 'bg-amber-400 text-amber-950 border-amber-300'
                        : 'bg-slate-300 text-slate-700 border-slate-400'
                    }`}
                  >
                    ด่าน {stage.id}
                  </span>

                  {/* Stage Icon or Lock */}
                  {isUnlocked ? (
                    <span className="text-4xl sm:text-5xl group-hover:scale-115 group-hover:rotate-6 transition-transform">
                      {stage.icon}
                    </span>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors">
                      <Lock className="w-8 h-8 sm:w-9 sm:h-9" />
                      <span className="text-[10px] font-black mt-0.5 text-slate-500">แตะเพื่อดู</span>
                    </div>
                  )}

                  {/* 3-Star Golden Badge for Complete Unit */}
                  {stars === 3 && (
                    <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 p-1 rounded-full border-2 border-white shadow-md text-xs">
                      ⭐
                    </div>
                  )}
                </button>

                {/* 3-Star Rating Display */}
                <div className="flex items-center gap-1.5 mt-3 bg-white px-3 py-1 rounded-full border-2 border-amber-200 shadow-xs">
                  {[1, 2, 3].map((starIndex) => (
                    <Star
                      key={starIndex}
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                        starIndex <= stars
                          ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-2xs'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  ))}
                </div>

                {/* Title & Status Caption */}
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
                        ? '🎈 ได้ 1 ดาว (ต้องสะสม 2 ดาวเพื่อปลดล็อกด่านถัดไป)'
                        : isCurrentActive
                        ? '👉 แตะเพื่อเริ่มเล่นด่านนี้เลย!'
                        : '👉 พร้อมให้เล่นแล้ว!'
                      : `🔒 แตะเพื่อดูเงื่อนไขปลดล็อก`}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* Point 4: Floating Toast with Actionable Recovery (HCI Heuristic #5 & #9) */}
      {/* ========================================================================= */}
      {lockedFeedback && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md p-4 rounded-3xl bg-white border-3 border-amber-400 shadow-2xl shadow-amber-300/40 text-slate-800 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 text-xl animate-wiggle">
              🔒
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span>ด่านที่ {lockedFeedback.stageId} ยังล็อกอยู่จ้า!</span>
                </h4>
                <button
                  type="button"
                  aria-label="ปิดแจ้งเตือน"
                  onClick={() => setLockedFeedback(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-amber-900 font-bold leading-relaxed">
                {lockedFeedback.message}
              </p>

              {/* Actionable Recovery Button */}
              {lockedFeedback.prevStageId >= 1 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleGoToPrevStage(lockedFeedback.prevStageId)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-900 text-xs font-black shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>👉 ไปเล่นด่านที่ {lockedFeedback.prevStageId} เพื่อสะสมดาว</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
