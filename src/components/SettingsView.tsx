'use client';

import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  Mic,
  RotateCcw,
  Sparkles,
  Check,
  Sliders,
  HelpCircle,
  Heart,
  AlertTriangle,
  Info,
  Award,
  BookOpen,
  Trash2,
  Star,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';

interface SettingsViewProps {
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  pronunciationThreshold: number;
  setPronunciationThreshold: (threshold: number) => void;
  showHints: boolean;
  setShowHints: (show: boolean) => void;
  onTestAudio: (text?: string) => void;
  isSpeaking: boolean;
  totalCards: number;
  masteredCount: number;
  spokenCount: number;
  totalStars: number;
  onResetStages: () => void;
  onResetMastered: () => void;
  onResetCards: () => void;
  voices?: SpeechSynthesisVoice[];
  selectedVoice?: SpeechSynthesisVoice | null;
  onSelectVoice?: (voice: SpeechSynthesisVoice | null) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  speechRate,
  setSpeechRate,
  pronunciationThreshold,
  setPronunciationThreshold,
  showHints,
  setShowHints,
  onTestAudio,
  isSpeaking,
  totalCards,
  masteredCount,
  spokenCount,
  totalStars,
  onResetStages,
  onResetMastered,
  onResetCards,
  voices = [],
  selectedVoice = null,
  onSelectVoice,
}) => {
  // Confirmation state for data reset to avoid accidental clicks
  const [confirmingAction, setConfirmingAction] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleConfirmResetStages = () => {
    onResetStages();
    setConfirmingAction(null);
    showNotice('🌟 รีเซ็ตดาวสะสมและความคืบหน้าของด่านผจญภัยเรียบร้อยแล้ว');
  };

  const handleConfirmResetMastered = () => {
    onResetMastered();
    setConfirmingAction(null);
    showNotice('🧠 ล้างรายการคำศัพท์ที่จำได้แล้ว เรียบร้อย');
  };

  const handleConfirmResetCards = () => {
    onResetCards();
    setConfirmingAction(null);
    showNotice('🗂️ คืนค่าคำศัพท์เป็นค่าเริ่มต้น 20 คำเรียบร้อยแล้ว');
  };

  const speedOptions = [
    {
      rate: 0.6,
      label: 'ช้าพิเศษ',
      sublabel: '0.6x ช้ามาก ฟังชัดทุกพยางค์',
      emoji: '🐢',
    },
    {
      rate: 0.75,
      label: 'ช้าๆ ชัดๆ',
      sublabel: '0.75x เหมาะสำหรับน้อง 5-6 ขวบ',
      emoji: '🎈',
      recommended: true,
    },
    {
      rate: 1.0,
      label: 'ระดับปกติ',
      sublabel: '1.0x ความเร็วเสียงธรรมชาติ',
      emoji: '🐰',
    },
    {
      rate: 1.25,
      label: 'รวดเร็ว',
      sublabel: '1.25x สำหรับน้องที่คุ้นเคยแล้ว',
      emoji: '🐆',
    },
  ];

  const thresholdOptions = [
    {
      threshold: 55,
      label: 'โหมดง่าย (55%)',
      sublabel: 'น้องเล็กเพิ่งเริ่มหัดพูด หรือไมค์เสียงเบา',
      emoji: '🌟',
      badge: 'ผ่อนปรน',
    },
    {
      threshold: 65,
      label: 'โหมดปานกลาง (65%)',
      sublabel: 'สมดุลกำลังดี สำหรับการเรียนรู้วัย 5-6 ขวบ',
      emoji: '⭐',
      badge: 'แนะนำ ⭐',
      recommended: true,
    },
    {
      threshold: 75,
      label: 'โหมดท้าทาย (75%)',
      sublabel: 'ต้องออกเสียงให้ชัดเป๊ะใกล้เคียงเจ้าของภาษา',
      emoji: '🏆',
      badge: 'ท้าทาย',
    },
  ];

  // Filter English voices
  const englishVoices = voices.filter(
    (v) => v.lang.startsWith('en') || v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-7 animate-in fade-in-50 duration-300 pb-12">
      {/* Top Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-500 border-3 border-amber-300 shadow-xl shadow-amber-200/50 text-white overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1 rounded-full bg-white/25 text-white border border-white/40 backdrop-blur-xs">
              <Settings className="w-3.5 h-3.5" />
              <span>หน้าตั้งค่าระบบ • สำหรับผู้ปกครองและน้องๆ</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs flex items-center gap-2">
              <span>⚙️ ตั้งค่าการเรียนรู้ของคนเก่ง</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/95 max-w-xl font-medium leading-relaxed">
              ปรับระดับความเร็วเสียง เกณฑ์ความแม่นยำของไมค์ และจัดการข้อมูลเพื่อประสบการณ์การเรียนรู้ที่ดีที่สุดสำหรับน้อง 5-6 ขวบ 🎈
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/30 text-white shadow-xs self-stretch md:self-auto justify-center">
            <Star className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce-gentle" />
            <div className="text-right">
              <div className="text-xs text-white/80 font-bold">ดาวสะสมปัจจุบัน</div>
              <div className="text-lg font-black">{totalStars} / 15 ดาว ⭐</div>
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Success Notification Toast */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 text-sm font-black flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. SPEECH / AUDIO SETTINGS */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-200 shadow-md shadow-amber-100/50 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-2xs">
              🔊
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                <span>ความเร็วเสียงอ่านของเจ้าของภาษา</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                เลือกความเร็วที่น้องฟังทันและสามารถออกเสียงตามได้ง่าย
              </p>
            </div>
          </div>

          {/* Test Audio Button */}
          <button
            onClick={() => onTestAudio('Hello! I love learning English with SmartAI Kids.')}
            disabled={isSpeaking}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black shadow-xs transition-all ${
              isSpeaking
                ? 'bg-amber-400 text-slate-900 animate-pulse cursor-wait'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 hover:scale-102 active:scale-95'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>{isSpeaking ? 'กำลังเล่นเสียงทดสอบ...' : '🔊 ทดลองฟังเสียงตัวอย่าง'}</span>
          </button>
        </div>

        {/* Speed Selector Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {speedOptions.map((opt) => {
            const isSelected = Math.abs(speechRate - opt.rate) < 0.05;
            return (
              <button
                key={opt.rate}
                onClick={() => setSpeechRate(opt.rate)}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-amber-50 border-amber-400 shadow-sm shadow-amber-200 ring-2 ring-amber-300'
                    : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-amber-300 text-slate-700'
                }`}
              >
                {opt.recommended && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-500 text-white shadow-xs">
                    แนะนำวัย 5-6 ขวบ ⭐
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{opt.emoji}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{opt.label}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{opt.sublabel}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Voice Selector (if browser supports multiple voices) */}
        {englishVoices.length > 1 && onSelectVoice && (
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <span>🗣️ สำเนียงเสียงอ่าน (Voice Accent):</span>
            </span>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = englishVoices.find((v) => v.name === e.target.value) || null;
                onSelectVoice(voice);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 max-w-xs"
            >
              {englishVoices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. PRONUNCIATION / MIC THRESHOLD SETTINGS */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-sky-200 shadow-md shadow-sky-100/50 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-sky-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-xl shadow-2xs">
            🎤
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
              <span>เกณฑ์ความแม่นยำในการออกเสียงไมค์ (Passing Score)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              คะแนนขั้นต่ำที่น้องต้องออกเสียงผ่าน เพื่อได้รับการ์ดผ่าน ✅ และได้รับดาวสะสม
            </p>
          </div>
        </div>

        {/* Threshold Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {thresholdOptions.map((opt) => {
            const isSelected = pronunciationThreshold === opt.threshold;
            return (
              <button
                key={opt.threshold}
                onClick={() => setPronunciationThreshold(opt.threshold)}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 shadow-sm shadow-sky-200 ring-2 ring-sky-300'
                    : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-sky-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{opt.emoji}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{opt.label}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{opt.sublabel}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs text-sky-900 flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">คำแนะนำสำหรับไมโครโฟน: </span>
            หากน้องออกเสียงคำศัพท์ถูกต้องแต่ระบบไมค์จับเสียงไม่ติด ให้ลองเลือก{' '}
            <span className="font-black text-sky-800">โหมดง่าย (55%)</span> หรือให้น้องขยับเข้าใกล้ไมโครโฟนในที่ที่ไม่มีเสียงรบกวนจ้า
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. QUIZ & STUDY HELPERS */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-pink-200 shadow-md shadow-pink-100/50 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-pink-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 border border-pink-300 flex items-center justify-center text-xl shadow-2xs">
            💡
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
              <span>ตัวช่วยและการแสดงคำใบ้ในเกมทายคำ</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              เปิดปุ่มคำใบ้เพื่อให้คำแนะนำที่มีประโยชน์กับน้องในเกมทายคำศัพท์
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-pink-50/60 border border-pink-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-200 text-pink-700 flex items-center justify-center text-lg font-bold">
              💡
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">
                แสดงปุ่มคำใบ้ (Show Hints) ในข้อสอบ
              </div>
              <div className="text-xs text-slate-600 font-medium">
                ช่วยอธิบายลักษณะ รูปร่าง หรือเสียงร้องน่ารักๆ เพื่อให้น้องคิดตามได้ง่ายขึ้น
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowHints(!showHints)}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              showHints ? 'bg-pink-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                showHints ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. PROGRESS & DATA MANAGEMENT */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-rose-200 shadow-md shadow-rose-100/50 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-rose-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-xl shadow-2xs">
            💾
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
              <span>จัดการข้อมูลและความก้าวหน้า (Data & Reset)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              ล้างคะแนนดาวเพื่อเริ่มเล่นการผจญภัยใหม่ หรือคืนค่าคำศัพท์ตั้งต้น
            </p>
          </div>
        </div>

        {/* Current Stats Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs text-amber-700 font-bold block">ดาวสะสม</span>
            <span className="text-xl font-black text-amber-900 mt-0.5 block">{totalStars} / 15 ⭐</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-700 font-bold block">ผ่านการพูดไมค์</span>
            <span className="text-xl font-black text-emerald-900 mt-0.5 block">{spokenCount} คำ 🎤</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-center">
            <span className="text-xs text-sky-700 font-bold block">จำได้ขึ้นใจ</span>
            <span className="text-xl font-black text-sky-900 mt-0.5 block">{masteredCount} คำ 🧠</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
            <span className="text-xs text-indigo-700 font-bold block">การ์ดทั้งหมด</span>
            <span className="text-xl font-black text-indigo-900 mt-0.5 block">{totalCards} คำ 🗂️</span>
          </div>
        </div>

        {/* Reset Actions Grid */}
        <div className="space-y-3 pt-2">
          {/* Action 1: Reset Stages & Stars */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
            <div>
              <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>🔄 รีเซ็ตดาวสะสม 5 ด่านผจญภัย</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                ล้างดาวสะสมและปลดล็อกด่านที่ 1 ใหม่ เพื่อให้น้องได้เริ่มผจญภัยเก็บ 3 ดาวอีกรอบ
              </div>
            </div>

            {confirmingAction === 'stages' ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleConfirmResetStages}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-600 text-white shadow-2xs transition-all"
                >
                  ยืนยันล้างดาว ⚠️
                </button>
                <button
                  onClick={() => setConfirmingAction(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingAction('stages')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 shadow-2xs hover:scale-102 active:scale-95 transition-all shrink-0"
              >
                เริ่มผจญภัยใหม่ 🌟
              </button>
            )}
          </div>

          {/* Action 2: Reset Mastered Cards */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
            <div>
              <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>🧠 ล้างคำศัพท์ที่จำได้ (Mastered)</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                ปลดเครื่องหมายจำได้ เพื่อให้น้องสามารถทบทวนคำศัพท์ทุกคำใหม่อีกครั้ง
              </div>
            </div>

            {confirmingAction === 'mastered' ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleConfirmResetMastered}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-600 text-white shadow-2xs transition-all"
                >
                  ยืนยันล้าง ⚠️
                </button>
                <button
                  onClick={() => setConfirmingAction(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingAction('mastered')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-sky-50 text-sky-700 border border-sky-300 shadow-2xs hover:scale-102 active:scale-95 transition-all shrink-0"
              >
                ล้างคำที่จำได้ 🧠
              </button>
            )}
          </div>

          {/* Action 3: Restore Default Mock Cards */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
            <div>
              <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>🗂️ คืนค่าคำศัพท์ตั้งต้น (20 คำมาตรฐาน)</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                ลบคำศัพท์ที่สร้างจาก AI และคืนค่าการ์ดคำศัพท์ 20 คำแรกสำหรับเด็ก 5-6 ขวบ
              </div>
            </div>

            {confirmingAction === 'cards' ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleConfirmResetCards}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-600 text-white shadow-2xs transition-all"
                >
                  ยืนยันคืนค่า ⚠️
                </button>
                <button
                  onClick={() => setConfirmingAction(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingAction('cards')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs hover:scale-102 active:scale-95 transition-all shrink-0"
              >
                คืนค่า 20 คำตั้งต้น 🗂️
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. PARENT'S CORNER & TIPS */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/60 rounded-3xl p-6 sm:p-7 border-2 border-indigo-200/80 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 border border-indigo-300 flex items-center justify-center text-xl shadow-2xs">
            👨‍👩‍👧
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              มุมคุณพ่อคุณแม่: เคล็ดลับการฝึกภาษาอังกฤษสำหรับเด็ก 5-6 ขวบ
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              ข้อแนะนำง่ายๆ เพื่อช่วยให้น้องสนุกและมีพัฒนาการทางภาษาที่ดีอย่างต่อเนื่อง
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="p-4 rounded-2xl bg-white/90 border border-indigo-100 shadow-2xs space-y-1">
            <div className="text-sm font-black text-indigo-900 flex items-center gap-1.5">
              <span>🎈 1. ชื่นชมและให้กำลังใจความพยายาม</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              วัย 5-6 ขวบชอบเสียงเชียร์ การได้ยินเสียงปรบมือและการได้ดาวจะทำให้น้องอยากฝึกพูดซ้ำๆ โดยไม่รู้สึกว่าเป็นการบ้าน
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-indigo-100 shadow-2xs space-y-1">
            <div className="text-sm font-black text-pink-900 flex items-center gap-1.5">
              <span>🐢 2. ฟังเสียงช้าๆ ชัดๆ ก่อนพูดตาม</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              การเปิดเสียงอ่านที่ 0.75x จะช่วยให้น้องจับพยางค์และตัวสะกดท้ายคำ (เช่น เสียง t, k, s) ได้แม่นยำขึ้นอย่างเห็นได้ชัด
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-indigo-100 shadow-2xs space-y-1">
            <div className="text-sm font-black text-amber-900 flex items-center gap-1.5">
              <span>🎤 3. ใช้ไมโครโฟนในที่เงียบสงบ</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              หากมีเสียงทีวีหรือพัดลมอยู่ใกล้ ไมโครโฟนอาจจับเสียงเพี้ยนได้ แนะนำให้น้องพูดใกล้ไมค์และเปล่งเสียงทีละคำอย่างมั่นใจ
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-indigo-100 shadow-2xs space-y-1">
            <div className="text-sm font-black text-emerald-900 flex items-center gap-1.5">
              <span>🌟 4. เล่นวันละ 10-15 นาทีก็เพียงพอ</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              การเรียนรู้สั้นๆ แต่สม่ำเสมอทุกวัน จะช่วยให้จดจำคำศัพท์ได้ดีกว่าการฝึกนานๆ จนเมื่อยล้า สนุกวันละนิด เก่งขึ้นวันละหน่อย!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
