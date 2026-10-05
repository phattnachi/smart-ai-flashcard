'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  BookOpen,
  Volume2,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  Lightbulb,
  Mic,
} from 'lucide-react';
import { Stage, StageProgress } from '../types/stage';
import { Flashcard } from '../types/flashcard';
import { FlashcardItem } from './FlashcardItem';
import confetti from 'canvas-confetti';

interface StagePlayModalProps {
  stage: Stage | null;
  isOpen: boolean;
  onClose: () => void;
  currentStars: number;
  stageProgress?: StageProgress;
  onPlayWordAudio: (word: string) => void;
  onPlayWordAudioSlow?: (word: string) => void;
  onPlaySentenceAudio: (sentence: string) => void;
  onOpenMic: (card: Flashcard) => void;
  isSpeaking: boolean;
  masteredIds: Set<string>;
  onToggleMastered: (id: string) => void;
  onCompleteStage: (stageId: number, starsEarned: number, type?: 'cards' | 'quiz') => void;
  onGoToNextStage: () => void;
  hasNextStage: boolean;
  spokenCardIds: Set<string>;
}

export const StagePlayModal: React.FC<StagePlayModalProps> = ({
  stage,
  isOpen,
  onClose,
  currentStars,
  stageProgress,
  onPlayWordAudio,
  onPlayWordAudioSlow,
  onPlaySentenceAudio,
  onOpenMic,
  isSpeaking,
  masteredIds,
  onToggleMastered,
  onCompleteStage,
  onGoToNextStage,
  hasNextStage,
  spokenCardIds,
}) => {
  const [activeMode, setActiveMode] = useState<'learn' | 'quiz'>('learn');

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCardsFinished, setIsCardsFinished] = useState(false);
  const [cardsStarsEarned, setCardsStarsEarned] = useState(0);
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [audioPlayedIndices, setAudioPlayedIndices] = useState<Set<number>>(new Set());

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Reset states whenever the stage changes
  useEffect(() => {
    if (stage) {
      setCardIndex(0);
      setIsFlipped(false);
      setIsCardsFinished(false);
      setCardsStarsEarned(0);
      setFlippedIndices(new Set());
      setAudioPlayedIndices(new Set());
      setActiveMode('learn');
      setIsQuizFinished(false);
      setQuizIndex(0);
      setQuizScore(0);
      setShowHint(false);
    }
  }, [stage?.id]);

  if (!isOpen || !stage) return null;

  const currentCard = stage.cards[cardIndex] || stage.cards[0];
  const questions = stage.quizQuestions;
  const currentQ = questions[quizIndex];

  // Check how many cards in this stage have been pronounced correctly
  const spokenCardsCount = stage.cards.filter((c) => spokenCardIds.has(c.id)).length;
  const allCardsSpoken = stage.cards.length > 0 && spokenCardsCount >= stage.cards.length;
  const isCurrentCardSpoken = currentCard ? spokenCardIds.has(currentCard.id) : false;

  // Completion statuses: Flashcards = 2 stars, Quiz = 1 star
  const isCardsStageDone = stageProgress?.cardsCompleted || cardsStarsEarned >= 2 || allCardsSpoken;
  const isQuizStageDone = stageProgress?.quizCompleted || earnedStars >= 1;

  const handleFinishFlashcards = () => {
    if (!allCardsSpoken) {
      const firstUnspokenIdx = stage.cards.findIndex((c) => !spokenCardIds.has(c.id));
      if (firstUnspokenIdx !== -1) {
        setIsFlipped(false);
        setCardIndex(firstUnspokenIdx);
        onOpenMic(stage.cards[firstUnspokenIdx]);
      }
      return;
    }

    setIsCardsFinished(true);

    // Requirement: Flashcards awards 2 stars!
    const starsEarned = 2;
    setCardsStarsEarned(starsEarned);
    onCompleteStage(stage.id, starsEarned, 'cards');

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f43f5e', '#38bdf8', '#34d399', '#a855f7'],
    });
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
    setFlippedIndices((prev) => new Set([...prev, cardIndex]));
  };

  const handlePlayWordAudioWrapper = (word: string) => {
    setAudioPlayedIndices((prev) => new Set([...prev, cardIndex]));
    onPlayWordAudio(word);
  };

  const handlePlayWordAudioSlowWrapper = (word: string) => {
    setAudioPlayedIndices((prev) => new Set([...prev, cardIndex]));
    if (onPlayWordAudioSlow) {
      onPlayWordAudioSlow(word);
    }
  };

  const handleOpenMicWrapper = (card: Flashcard) => {
    // Only opens the mic modal. Card is ONLY marked spoken when pronunciation evaluation is correct!
    onOpenMic(card);
  };

  const handleToggleMasteredWrapper = (id: string) => {
    onToggleMastered(id);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#f43f5e'],
    });
  };

  // ==================== QUIZ HANDLERS ====================
  const handleStartQuiz = () => {
    setActiveMode('quiz');
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setQuizScore(0);
    setIsQuizFinished(false);
    setEarnedStars(0);
  };

  const handleSelectQuizOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < questions.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      // Quiz passing condition: at least 50% correct (Quiz awards 1 star!)
      const finalScore = quizScore;
      const totalQ = questions.length;
      const passThreshold = Math.ceil(totalQ * 0.5);
      const isPassed = finalScore >= passThreshold;

      if (isPassed) {
        const quizStars = 1; // Quiz awards 1 star!
        setEarnedStars(quizStars);
        setIsQuizFinished(true);
        onCompleteStage(stage.id, quizStars, 'quiz');

        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f43f5e', '#38bdf8', '#34d399', '#a855f7'],
        });
      } else {
        setEarnedStars(0);
        setIsQuizFinished(true);
      }
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setQuizScore(0);
    setIsQuizFinished(false);
    setEarnedStars(0);
  };

  const handleRestartCards = () => {
    setCardIndex(0);
    setIsFlipped(false);
    setIsCardsFinished(false);
  };

  const handleRestartCurrent = () => {
    if (activeMode === 'learn') {
      handleRestartCards();
    } else {
      handleRestartQuiz();
    }
  };

  // Display stars: Flashcards = 2 stars, Quiz = 1 star -> Max 3 stars
  const calculatedStars = (isCardsStageDone ? 2 : 0) + (isQuizStageDone ? 1 : 0);
  const displayStars = Math.min(3, Math.max(currentStars, calculatedStars, cardsStarsEarned, earnedStars));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border-t-4 sm:border-3 border-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 sm:p-7 text-slate-800 h-[94vh] sm:h-auto sm:max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-xs animate-bounce-gentle">
              {stage.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-lg font-black text-slate-900 truncate">
                {stage.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-amber-800 font-bold truncate">{stage.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Stars badge */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-100 px-2 sm:px-3 py-1 rounded-2xl border border-amber-300">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                    s <= displayStars
                      ? 'text-amber-500 fill-amber-400 scale-110'
                      : 'text-slate-300 fill-slate-100'
                  }`}
                />
              ))}
            </div>

            {/* Restart Button in Header */}
            <button
              onClick={handleRestartCurrent}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-black text-xs transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
              title="เริ่มด่านนี้ใหม่อีกครั้ง"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">เริ่มใหม่</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-amber-50 transition-colors cursor-pointer"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 my-3 sm:my-4">
          <button
            onClick={() => {
              setActiveMode('learn');
              setIsCardsFinished(false);
            }}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all border-2 text-center select-none active:scale-95 ${
              activeMode === 'learn'
                ? 'bg-amber-400 text-amber-950 border-amber-400 shadow-md shadow-amber-200 scale-102'
                : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
            <span>1. 📖 แฟลชการ์ด (2⭐)</span>
            {isCardsStageDone && <span className="text-xs">✅</span>}
          </button>

          <button
            onClick={handleStartQuiz}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all border-2 text-center select-none active:scale-95 ${
              activeMode === 'quiz'
                ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200 scale-102'
                : 'bg-white text-slate-700 border-pink-200 hover:bg-pink-50'
            }`}
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
            <span>2. 🎯 เกมทายคำ (1⭐)</span>
            {isQuizStageDone && <span className="text-xs">✅</span>}
          </button>
        </div>

        {/* ==================== MODE 1: LEARN FLASHCARDS ==================== */}
        {activeMode === 'learn' && (
          <div>
            {isCardsFinished ? (
              /* ==================== FLASHCARDS COMPLETION CELEBRATION ==================== */
              <div className="py-6 text-center space-y-5 animate-in zoom-in-95">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-600 shadow-sm animate-bounce-gentle">
                  <span className="text-4xl">🌟</span>
                </div>

                <div className="space-y-1.5">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 font-black text-xs border border-amber-300 shadow-2xs">
                    🎉 คนเก่งเรียนรู้การ์ดคำศัพท์ครบทั้ง {stage.cards.length} คำแล้ว!
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    🎉 ได้รับ 2 ดาวเรียบร้อยแล้วจ้า! ⭐⭐
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-emerald-800">
                    ยอดเยี่ยมที่สุด! คนเก่งฝึกพูดคำศัพท์ครบทุกคำแล้ว (เล่นเกมทายคำต่อเพื่อคว้าอีก 1 ดาวให้เต็ม 3 ดาวนะ 🎯)
                  </p>
                </div>

                {/* Stars Display */}
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3].map((starIdx) => {
                    const isLit = starIdx <= (isQuizStageDone ? 3 : 2);
                    return (
                      <div
                        key={starIdx}
                        className={`p-3 rounded-2xl transition-all duration-300 ${
                          isLit
                            ? 'bg-amber-100 border-2 border-amber-400 scale-110 shadow-sm shadow-amber-200 animate-bounce-gentle'
                            : 'bg-slate-100 border border-slate-200 opacity-40'
                        }`}
                      >
                        <Star
                          className={`w-9 h-9 sm:w-11 sm:h-11 ${
                            isLit ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="max-w-sm mx-auto text-xs font-bold text-amber-900 bg-amber-50 p-3 rounded-2xl border-2 border-amber-200 space-y-1 text-left">
                  <p className="text-emerald-700 font-black">
                    • ⭐⭐ แฟลชการ์ด: ฝึกพูดคำศัพท์ครบทุกคำในด่านนี้แล้ว (ได้รับ 2 ดาว! 🥈)
                  </p>
                  <p className="text-pink-700 font-black">
                    • 🎯 เกมทายคำ: เล่นเกมทายคำต่อเพื่อรับอีก 1 ดาว ให้ได้ 3 ดาวเต็ม! 🥇
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleStartQuiz}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    <span>⭐ เล่นเกมทายคำต่อ (รับอีก 1 ดาว)</span>
                  </button>

                  {hasNextStage && displayStars >= 2 && (
                    <button
                      onClick={onGoToNextStage}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>🚀 ไปด่านถัดไปเลย!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={handleRestartCards}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs border border-amber-300 transition-colors shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>🔄 เริ่มใหม่ (ทบทวนอีกรอบ)</span>
                  </button>
                </div>
              </div>
            ) : currentCard ? (
              <div className="space-y-4">
                {/* Spoken Progress Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-amber-50/80 border-2 border-amber-200 text-xs font-black">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-900">🎙️ ฝึกพูดคำศัพท์:</span>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-950 font-black shadow-2xs">
                      {spokenCardsCount} / {stage.cards.length} คำ
                    </span>
                  </div>

                  {allCardsSpoken ? (
                    <span className="text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-2xs animate-bounce-gentle">
                      <span>🎉 ออกเสียงถูกต้องครบทุกคำแล้ว! รับ 2 ดาว ⭐⭐</span>
                    </span>
                  ) : (
                    <span className="text-pink-800 bg-pink-100 border border-pink-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                      <span>⚠️ ต้องออกเสียงให้ถูกต้องครบทุกคำเพื่อรับ 2 ดาวนะคนเก่ง 🎙️</span>
                    </span>
                  )}
                </div>

                {/* Clickable Word Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {stage.cards.map((c, idx) => {
                    const isCurrent = cardIndex === idx;
                    const isSpoken = spokenCardIds.has(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setIsFlipped(false);
                          setCardIndex(idx);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-400 text-amber-950 border-2 border-amber-500 scale-105 shadow-xs ring-2 ring-amber-300'
                            : isSpoken
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                            : 'bg-white hover:bg-pink-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span>{c.word}</span>
                        <span>{isSpoken ? '✅' : '🎙️'}</span>
                      </button>
                    );
                  })}
                </div>

                <FlashcardItem
                  card={currentCard}
                  isFlipped={isFlipped}
                  onFlip={handleCardFlip}
                  onPlayWordAudio={handlePlayWordAudioWrapper}
                  onPlayWordAudioSlow={handlePlayWordAudioSlowWrapper}
                  onPlaySentenceAudio={onPlaySentenceAudio}
                  onOpenMic={() => handleOpenMicWrapper(currentCard)}
                  isSpeaking={isSpeaking}
                  isMastered={masteredIds.has(currentCard.id)}
                  onToggleMastered={() => handleToggleMasteredWrapper(currentCard.id)}
                  isMicPracticed={isCurrentCardSpoken}
                />

                {/* Stepper controls (Responsive for mobile thumbs) */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      disabled={cardIndex === 0}
                      onClick={() => {
                        setIsFlipped(false);
                        setCardIndex((prev) => Math.max(0, prev - 1));
                      }}
                      className="px-3.5 sm:px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs border border-amber-300 disabled:opacity-40 cursor-pointer min-h-[42px] flex items-center justify-center active:scale-95 transition-all"
                    >
                      ◀ คำก่อนหน้า
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                        คำที่ {cardIndex + 1} / {stage.cards.length}
                      </span>
                      {cardIndex > 0 && (
                        <button
                          onClick={handleRestartCards}
                          className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer transition-all active:scale-95 shadow-2xs"
                          title="เริ่มใหม่ตั้งแต่คำแรก"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                        </button>
                      )}
                    </div>

                    {cardIndex < stage.cards.length - 1 ? (
                      <button
                        onClick={() => {
                          setIsFlipped(false);
                          setCardIndex((prev) => prev + 1);
                        }}
                        className="px-4 sm:px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-all min-h-[42px] flex items-center justify-center"
                      >
                        คำถัดไป ▶
                      </button>
                    ) : allCardsSpoken ? (
                      <button
                        onClick={handleFinishFlashcards}
                        className="px-3 sm:px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-black text-xs shadow-md flex items-center gap-1.5 animate-bounce-gentle active:scale-95 transition-all cursor-pointer ring-2 ring-amber-300 min-h-[42px]"
                      >
                        <Star className="w-3.5 h-3.5 fill-yellow-200 text-yellow-200" />
                        <span>รับ 2 ดาว ⭐⭐</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenMicWrapper(currentCard)}
                        className="px-3 py-2 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-900 border-2 border-pink-300 font-black text-xs flex items-center gap-1 cursor-pointer min-h-[42px]"
                      >
                        <Mic className="w-3.5 h-3.5 text-pink-600" />
                        <span>ฝึกพูด 🎙️</span>
                      </button>
                    )}
                  </div>

                  {/* On last card and not all spoken: wide help banner */}
                  {cardIndex === stage.cards.length - 1 && !allCardsSpoken && (
                    <button
                      onClick={() => {
                        const firstUnspokenIdx = stage.cards.findIndex(
                          (c) => !spokenCardIds.has(c.id)
                        );
                        if (firstUnspokenIdx !== -1) {
                          setIsFlipped(false);
                          setCardIndex(firstUnspokenIdx);
                          onOpenMic(stage.cards[firstUnspokenIdx]);
                        }
                      }}
                      className="w-full p-2.5 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-900 border-2 border-pink-200 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                    >
                      <Mic className="w-4 h-4 text-pink-600" />
                      <span>พูดถูกต้องแล้ว {spokenCardsCount}/{stage.cards.length} คำ (แตะตรงนี้เพื่อฝึกคำที่เหลือ 🎙️)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ==================== MODE 2: 3-STAR STAGE QUIZ ==================== */}
        {activeMode === 'quiz' && (
          <div>
            {!isQuizFinished && currentQ ? (
              <div className="space-y-4">
                {/* Quiz header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-black bg-pink-50 p-3.5 rounded-2xl border-2 border-pink-200">
                  <div className="flex items-center gap-2">
                    <span className="text-pink-900 font-black">
                      ข้อที่ {quizIndex + 1} / {questions.length} 🎯
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs">
                      {currentQ.type === 'thai-meaning'
                        ? '⭐ แปลว่าอะไรเอ่ย?'
                        : currentQ.type === 'english-definition'
                        ? '✨ คำภาษาอังกฤษ'
                        : '🎧 ฟังเสียงทายคำ'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <button
                      type="button"
                      onClick={handleRestartQuiz}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-black text-xs transition-all border shadow-2xs cursor-pointer bg-white hover:bg-pink-50 text-pink-700 border-pink-200 hover:scale-105 active:scale-95"
                      title="เริ่มทำแบบทดสอบใหม่ตั้งแต่ข้อ 1"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-pink-600" />
                      <span>เริ่มใหม่</span>
                    </button>

                    {currentQ.hint && (
                      <button
                        type="button"
                        onClick={() => setShowHint((prev) => !prev)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all border shadow-2xs cursor-pointer ${
                          showHint
                            ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300 scale-105'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 hover:scale-105'
                        }`}
                        title="ดูคำใบ้"
                      >
                        <Lightbulb className="w-4 h-4 text-amber-800 fill-amber-300" />
                        <span>{showHint ? 'ซ่อนคำใบ้' : '💡 ขอคำใบ้'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onPlayWordAudio(currentQ.targetWord)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all border shadow-2xs cursor-pointer ${
                        currentQ.type === 'fill-in-blank'
                          ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500 animate-bounce-gentle scale-105 ring-2 ring-amber-300'
                          : 'bg-white hover:bg-sky-50 text-sky-700 border-sky-200'
                      }`}
                      title="ฟังเสียงคำศัพท์เป้าหมาย"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>🔊 ฟังเสียง</span>
                    </button>
                    <span className="font-bold">แต้ม: {quizScore}</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-pink-50/50 border-2 border-pink-200 space-y-4">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
                    {currentQ.question}
                  </h4>

                  {/* Child-friendly Hint Card */}
                  {showHint && currentQ.hint && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 flex items-start gap-2.5 animate-in fade-in zoom-in-95 shadow-2xs">
                      <span className="text-2xl shrink-0 animate-bounce-gentle">💡</span>
                      <div className="text-xs sm:text-sm">
                        <span className="font-black text-amber-900 block mb-0.5">
                          คำใบ้จากพี่หมีใจดี 🐻:
                        </span>
                        <span className="font-bold text-amber-950 leading-relaxed">
                          {currentQ.hint}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQ.correctIndex;

                      let btnStyle = 'bg-white hover:bg-pink-50 border-2 border-pink-200 text-slate-800';
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-300';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-100 border-2 border-rose-500 text-rose-950 ring-2 ring-rose-300';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 opacity-50';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleSelectQuizOption(idx)}
                          className={`w-full p-3.5 rounded-2xl text-left border font-black text-xs sm:text-sm flex items-center justify-between transition-all shadow-2xs ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-xl bg-pink-100 text-pink-900 font-mono font-black text-xs flex items-center justify-center border border-pink-200">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt.replace(/\p{Extended_Pictographic}/gu, '').trim()}</span>
                          </div>
                          {isAnswerSubmitted && (
                            <div>
                              {isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : isSelected ? (
                                <XCircle className="w-5 h-5 text-rose-500" />
                              ) : null}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation & Next */}
                  {isAnswerSubmitted && (
                    <div className="space-y-3 pt-2 animate-in fade-in-50">
                      <div
                        className={`p-3.5 rounded-2xl border-2 text-xs leading-relaxed ${
                          selectedOption === currentQ.correctIndex
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                        }`}
                      >
                        <p className="font-black text-sm">
                          {selectedOption === currentQ.correctIndex
                            ? '🎉 ว้าว! คำตอบถูกต้อง เก่งมากๆ เลยคนเก่ง!'
                            : '✨ ไม่เป็นไรนะจ๊ะ ดูคำอธิบายประกอบตรงนี้:'}
                        </p>
                        <p className="mt-1 font-medium">{currentQ.explanation}</p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleNextQuizQuestion}
                          className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                        >
                          <span>{quizIndex < questions.length - 1 ? 'ข้อถัดไป ▶' : 'ดูสรุปผลประเมิน 3 ดาว 🏆'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ==================== QUIZ RESULT & 3-STAR RATING ==================== */
              <div className="py-6 text-center space-y-5 animate-in zoom-in-95">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-600 shadow-sm animate-bounce-gentle">
                  <span className="text-4xl">🌟</span>
                </div>

                {/* 3 Stars */}
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3].map((starIdx) => (
                    <div
                      key={starIdx}
                      className={`p-3 rounded-2xl transition-all duration-300 ${
                        starIdx <= displayStars
                          ? 'bg-amber-100 border-2 border-amber-400 scale-110 shadow-sm shadow-amber-200'
                          : 'bg-slate-100 border border-slate-200 opacity-40'
                      }`}
                    >
                      <Star
                        className={`w-9 h-9 sm:w-11 sm:h-11 ${
                          starIdx <= displayStars
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {displayStars === 3
                      ? '⭐⭐⭐ ยอดเยี่ยมที่สุด! คว้าไป 3 ดาวเต็มเลยจ้า 🎉'
                      : isCardsStageDone
                      ? '⭐⭐ เก่งมากเลยคนเก่ง! ได้ 2 ดาวจากแฟลชการ์ดแล้ว 🎈'
                      : earnedStars === 1
                      ? '⭐ เย้! ได้รับ 1 ดาวจากเกมทายคำแล้ว ✨'
                      : 'ยังไม่ผ่านเกณฑ์ ลองทบทวนการ์ดแล้วเล่นใหม่อีกทีนะคนเก่ง 🧸'}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-600">
                    ตอบถูก {quizScore} จาก {questions.length} ข้อ
                    {displayStars === 3
                      ? ' (ได้รับ 3 ดาวเต็มจากการฝึกพูด 2 ดาว + เกมทายคำ 1 ดาว 🏆)'
                      : displayStars >= 2
                      ? ' (ได้รับ 2 ดาวแล้ว ด่านต่อไปพร้อมเปิดต้อนรับแล้วจ้า 🚀)'
                      : ' (ได้ 1 ดาวแล้วจ้า! ต้องได้ 2 ดาวเพื่อปลดล็อกด่านต่อไปนะ 🔒)'}
                  </p>
                </div>

                {/* Star criteria note */}
                <div className="max-w-xs mx-auto text-xs font-bold text-amber-900 bg-amber-50 p-3 rounded-2xl border-2 border-amber-200 space-y-1 text-left">
                  <p className="font-black text-amber-950">🏆 กติกาการสะสมดาวประจำด่าน:</p>
                  <p className={isCardsStageDone ? 'text-emerald-700 font-black' : ''}>
                    • 📖 แฟลชการ์ด: ฝึกพูดออกเสียงครบทุกคำ ได้ 2 ดาว ⭐⭐ {isCardsStageDone && '✅'}
                  </p>
                  <p className={isQuizStageDone ? 'text-emerald-700 font-black' : ''}>
                    • 🎯 เกมทายคำ: เล่นเกมทายคำผ่าน ได้ 1 ดาว ⭐ {isQuizStageDone && '✅'}
                  </p>
                  <p className={displayStars === 3 ? 'text-amber-600 font-black' : 'text-slate-500'}>
                    • 🌟 รวมพลังคนเก่ง: ทำครบทั้งสองอย่าง คว้า 3 ดาวเต็ม! 🥇 {displayStars === 3 && '🎉'}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleRestartQuiz}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs border border-amber-300 transition-colors shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>🔄 เริ่มใหม่ (เล่นอีกรอบ)</span>
                  </button>

                  {hasNextStage && displayStars >= 2 && (
                    <button
                      onClick={() => {
                        onGoToNextStage();
                      }}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>🚀 ไปด่านถัดไปเลย!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {hasNextStage && displayStars < 2 && (
                    <button
                      onClick={() => {
                        setActiveMode('learn');
                        setIsCardsFinished(false);
                      }}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-amber-300"
                    >
                      <span>📖 ฝึกพูดแฟลชการ์ด (รับ 2 ดาวเพื่อปลดล็อกด่านถัดไป ⭐⭐)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
