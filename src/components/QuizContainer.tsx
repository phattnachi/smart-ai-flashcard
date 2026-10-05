'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Volume2,
  Sparkles,
  Flame,
  Star,
  Lightbulb,
} from 'lucide-react';
import { QuizQuestion } from '../types/quiz';
import confetti from 'canvas-confetti';

interface QuizContainerProps {
  questions: QuizQuestion[];
  onPlayAudio: (text: string) => void;
  onRestartQuiz: () => void;
}

export const QuizContainer: React.FC<QuizContainerProps> = ({
  questions,
  onPlayAudio,
  onRestartQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; selectedIndex: number; isCorrect: boolean }[]
  >([]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setIsFinished(false);
    setUserAnswers([]);
  }, [questions]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#fbbf24', '#f43f5e', '#38bdf8', '#34d399'],
      });
    } else {
      setStreak(0);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedIndex: idx,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f43f5e', '#38bdf8', '#34d399', '#a855f7'],
      });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white border-2 border-dashed border-amber-300 text-center max-w-xl mx-auto shadow-xs">
        <span className="text-5xl mb-2">🎯</span>
        <h3 className="text-xl font-black text-slate-800">ยังไม่มีข้อสอบสำหรับหมวดนี้จ้า</h3>
        <p className="text-xs font-bold text-slate-500 mt-1.5 mb-6">
          โปรดเลือกหมวดหมู่อื่น หรือกดปุ่มด้านล่างเพื่อเริ่มสร้างข้อสอบชุดใหม่
        </p>
        <button
          onClick={onRestartQuiz}
          className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs transition-colors shadow-xs"
        >
          🎲 สุ่มชุดคำถามใหม่
        </button>
      </div>
    );
  }

  // ==================== FINISHED SCREEN ====================
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let grade = {
      title: '🌟 ยอดเยี่ยมที่สุด! คนเก่งคว้าเหรียญทอง 🥇',
      desc: 'ว้าว! เก่งมากเลย ตอบถูกเกือบทั้งหมด จำคำศัพท์ได้แม่นยำที่สุด!',
      color: 'text-amber-900',
      badgeBg: 'bg-amber-100 border-2 border-amber-300',
    };

    if (percentage < 60) {
      grade = {
        title: '🌱 สู้ๆ นะคนเก่ง มาฝึกทบทวนกันใหม่นะ 🎈',
        desc: 'ลองกลับไปดูการ์ดคำศัพท์อีกนิด แล้วกลับมาเล่นใหม่อีกรอบนะจ๊ะ!',
        color: 'text-slate-800',
        badgeBg: 'bg-slate-100 border-2 border-slate-300',
      };
    } else if (percentage < 85) {
      grade = {
        title: '🎉 เก่งมากเลยคนเก่ง ได้เหรียญเงินไปครอง 🥈',
        desc: 'ตอบถูกเยอะมากๆ ฝึกอีกนิดเดียวจะได้คะแนนเต็มแล้วนะ!',
        color: 'text-emerald-900',
        badgeBg: 'bg-emerald-100 border-2 border-emerald-300',
      };
    }

    return (
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border-3 border-amber-200 shadow-md space-y-6 animate-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 border-2 border-amber-300 mb-1 shadow-sm animate-bounce-gentle">
            <span className="text-4xl">🏆</span>
          </div>

          <div>
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-black border ${grade.badgeBg} ${grade.color} shadow-2xs`}
            >
              {grade.title}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            สรุปผลคะแนนของคนเก่ง ✨
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-md mx-auto">
            {grade.desc}
          </p>
        </div>

        {/* Score Metrics Box */}
        <div className="grid grid-cols-3 gap-3 p-4.5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 text-center">
          <div className="space-y-0.5">
            <span className="text-xs text-amber-800 font-black">⭐ ตอบถูก</span>
            <p className="text-3xl font-black text-slate-900">
              {score} <span className="text-xs font-bold text-slate-400">/ {questions.length}</span>
            </p>
          </div>
          <div className="space-y-0.5 border-x-2 border-amber-200">
            <span className="text-xs text-amber-800 font-black">ความแม่นยำ</span>
            <p className="text-3xl font-black text-pink-600 font-mono">
              {percentage}%
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-amber-800 font-black flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              Streak สูงสุด
            </span>
            <p className="text-3xl font-black text-orange-500 font-mono">
              {bestStreak}
            </p>
          </div>
        </div>

        {/* Answers breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">
            รายละเอียดคำตอบของคนเก่ง ({questions.length} ข้อ):
          </h4>
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
            {questions.map((q, idx) => {
              const ans = userAnswers[idx];
              const isCorrect = ans?.isCorrect;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between text-xs transition-colors ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                      : 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    <span className="font-black text-slate-900">{q.targetWord}:</span>
                    <span className="truncate text-slate-700">{q.options[q.correctIndex].replace(/\p{Extended_Pictographic}/gu, '').trim()}</span>
                  </div>
                  <button
                    onClick={() => onPlayAudio(q.targetWord)}
                    className="p-1.5 rounded-xl bg-white text-sky-600 shrink-0 border border-sky-200 shadow-2xs hover:bg-sky-50"
                    title="ฟังเสียง"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Restart CTA */}
        <div className="pt-2 border-t-2 border-amber-100 flex justify-center">
          <button
            onClick={onRestartQuiz}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-black text-sm transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>🎮 เล่นเกมทายคำใหม่อีกครั้ง</span>
          </button>
        </div>
      </div>
    );
  }

  // ==================== ACTIVE QUIZ VIEW ====================
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Quiz Top Status */}
      <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-white border-2 border-pink-200 shadow-xs text-xs sm:text-sm font-black">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl bg-pink-100 text-pink-900 border border-pink-300">
            ข้อที่ {currentIndex + 1} / {questions.length} 🎯
          </span>
          <span className="hidden sm:inline text-slate-600">
            แต้มสะสม: <strong className="text-amber-600 font-mono">{score}</strong> แต้ม
          </span>
        </div>

        {/* Streak indicator */}
        {streak > 1 && (
          <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 text-xs font-black animate-bounce-gentle">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{streak} ข้อติดแล้วจ้า!</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-24 sm:w-36 h-3 bg-pink-100 rounded-full overflow-hidden p-0.5 border border-pink-200">
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border-3 border-pink-200 shadow-md space-y-5">
        {/* Question Header & Target Audio */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {currentQ.type === 'thai-meaning'
                ? '⭐ คำนี้แปลว่าอะไรเอ่ย?'
                : currentQ.type === 'english-definition'
                ? '✨ ภาษาอังกฤษคือคำไหน?'
                : '🎧 ฟังเสียงแล้วทายคำ'}
            </span>

            <div className="flex items-center gap-2">
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
                onClick={() => onPlayAudio(currentQ.targetWord)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition-all border shadow-2xs cursor-pointer ${
                  currentQ.type === 'fill-in-blank'
                    ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500 animate-bounce-gentle scale-105 ring-2 ring-amber-300'
                    : 'bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300'
                }`}
                title="ฟังเสียงคำศัพท์เป้าหมาย"
              >
                <Volume2 className="w-4 h-4" />
                <span>🔊 กดฟังเสียง</span>
              </button>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 whitespace-pre-line leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Child-friendly Hint Card */}
          {showHint && currentQ.hint && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 flex items-start gap-2.5 animate-in fade-in zoom-in-95 shadow-2xs">
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
        </div>

        {/* 4 Choices Grid */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = idx === currentQ.correctIndex;

            let optionStyle =
              'bg-white hover:bg-amber-50 border-2 border-amber-200 text-slate-800 hover:border-amber-400';

            if (isAnswerSubmitted) {
              if (isCorrectAnswer) {
                optionStyle =
                  'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-300';
              } else if (isSelected && !isCorrectAnswer) {
                optionStyle =
                  'bg-rose-100 border-2 border-rose-500 text-rose-950 ring-2 ring-rose-300';
              } else {
                optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl text-left font-black text-sm sm:text-base flex items-center justify-between gap-3 transition-all duration-150 shadow-2xs hover:scale-101 active:scale-98 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option.replace(/\p{Extended_Pictographic}/gu, '').trim()}</span>
                </div>

                {isAnswerSubmitted && (
                  <div>
                    {isCorrectAnswer ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 animate-bounce-gentle" />
                    ) : isSelected ? (
                      <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {isAnswerSubmitted && (
          <div className="space-y-3.5 pt-1 animate-in fade-in-50 duration-200">
            <div
              className={`p-4 rounded-2xl border-2 text-xs sm:text-sm leading-relaxed ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="font-black text-sm mb-1">
                {selectedOption === currentQ.correctIndex
                  ? '🎉 เย้! คำตอบถูกต้อง เก่งมากๆ เลยคนเก่ง!'
                  : '✨ ยังไม่ถูกนะจ๊ะ ลองดูคำอธิบายตรงนี้นะ:'}
              </div>
              <p className="whitespace-pre-line text-slate-800 font-bold">
                {currentQ.explanation}
              </p>
            </div>

            {/* Next Question Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <span>
                  {currentIndex < questions.length - 1 ? 'ข้อถัดไป ▶' : 'ดูสรุปผลคะแนน 🏆'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
