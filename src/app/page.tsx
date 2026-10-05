'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar, TabType } from '@/components/Navbar';
import { StageMap } from '@/components/StageMap';
import { StagePlayModal } from '@/components/StagePlayModal';
import { CategoryFilter } from '@/components/CategoryFilter';
import { FlashcardDeck } from '@/components/FlashcardDeck';
import { QuizContainer } from '@/components/QuizContainer';
import { StatsOverview } from '@/components/StatsOverview';
import { SettingsView } from '@/components/SettingsView';
import { PronunciationModal } from '@/components/PronunciationModal';
import { AIGeneratorModal } from '@/components/AIGeneratorModal';
import { INITIAL_FLASHCARDS, generateQuizFromCards } from '@/data/mockCards';
import { STAGES_DATA } from '@/data/stagesData';
import { Flashcard } from '@/types/flashcard';
import { QuizQuestion } from '@/types/quiz';
import { Stage, StageProgress } from '@/types/stage';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import {
  Mic,
  Volume2,
  Sparkles,
  Star,
  Map,
  GraduationCap,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

const STORAGE_KEY_CARDS = 'smart_ai_cards_easy_v2';
const STORAGE_KEY_MASTERED = 'smart_ai_mastered_easy_v2';
const STORAGE_KEY_STAGES = 'smart_ai_stage_progress_easy_v2';
const STORAGE_KEY_SPOKEN = 'smart_ai_spoken_correct_v2';
const STORAGE_KEY_THRESHOLD = 'smart_ai_pronunciation_threshold_v2';
const STORAGE_KEY_HINTS = 'smart_ai_show_hints_v2';

// Normalizes stage progression ensuring Stage N requires at least 2 stars in Stage N-1 to unlock
const normalizeStageProgress = (prog: Record<number, StageProgress>): Record<number, StageProgress> => {
  const normalized: Record<number, StageProgress> = {};

  STAGES_DATA.forEach((s) => {
    const existing = prog[s.id];
    normalized[s.id] = {
      stageId: s.id,
      stars: existing?.stars || 0,
      isUnlocked: s.id === 1,
      highScore: existing?.highScore || 0,
      cardsCompleted: existing?.cardsCompleted || false,
      quizCompleted: existing?.quizCompleted || false,
      completedAt: existing?.completedAt,
    };
  });

  // Stage 1 is always unlocked
  normalized[1].isUnlocked = true;

  // Stages 2..N are unlocked ONLY if the previous stage has at least 2 stars!
  for (let id = 2; id <= STAGES_DATA.length; id++) {
    const prevStars = normalized[id - 1]?.stars || 0;
    normalized[id].isUnlocked = prevStars >= 2;
  }

  return normalized;
};

// Initial stage progress (Stage 1 is unlocked by default)
const createInitialStageProgress = (): Record<number, StageProgress> => {
  return normalizeStageProgress({});
};

export default function HomePage() {
  const [cards, setCards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [spokenCardIds, setSpokenCardIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('stages');
  const [pronunciationThreshold, setPronunciationThreshold] = useState<number>(65);
  const [showHints, setShowHints] = useState<boolean>(true);

  // Stages & 3-Star Progression
  const [stageProgress, setStageProgress] = useState<Record<number, StageProgress>>(createInitialStageProgress);
  const [activeStage, setActiveStage] = useState<Stage | null>(null);

  // Modals
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [activeMicCard, setActiveMicCard] = useState<Flashcard | null>(null);

  // Custom Hooks
  const {
    speak,
    speakSlow,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: ttsSupported,
    speechRate,
    setSpeechRate,
    voices,
    selectedVoice,
    setSelectedVoice,
  } = useSpeechSynthesis();
  const {
    isSupported: sttSupported,
    isListening,
    transcript,
    interimTranscript,
    error: sttError,
    result: pronunciationResult,
    audioLevel,
    hasMicPermission,
    startListening,
    stopListening,
    resetResult,
  } = useSpeechRecognition();

  // Load persisted progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCards = localStorage.getItem(STORAGE_KEY_CARDS);
        if (savedCards) {
          const parsed = JSON.parse(savedCards);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCards(parsed);
          }
        }

        const savedMastered = localStorage.getItem(STORAGE_KEY_MASTERED);
        if (savedMastered) {
          const parsed = JSON.parse(savedMastered);
          if (Array.isArray(parsed)) {
            setMasteredIds(new Set(parsed));
          }
        }

        const savedStages = localStorage.getItem(STORAGE_KEY_STAGES);
        if (savedStages) {
          const parsed = JSON.parse(savedStages);
          if (parsed && typeof parsed === 'object') {
            const normalized = normalizeStageProgress(parsed);
            setStageProgress(normalized);
            localStorage.setItem(STORAGE_KEY_STAGES, JSON.stringify(normalized));
          }
        }

        const savedSpoken = localStorage.getItem(STORAGE_KEY_SPOKEN);
        if (savedSpoken) {
          const parsed = JSON.parse(savedSpoken);
          if (Array.isArray(parsed)) {
            setSpokenCardIds(new Set(parsed));
          }
        }

        const savedThreshold = localStorage.getItem(STORAGE_KEY_THRESHOLD);
        if (savedThreshold) {
          const parsed = Number(savedThreshold);
          if (!isNaN(parsed) && parsed >= 40 && parsed <= 90) {
            setPronunciationThreshold(parsed);
          }
        }

        const savedHints = localStorage.getItem(STORAGE_KEY_HINTS);
        if (savedHints !== null) {
          setShowHints(savedHints === 'true');
        }
      } catch (e) {
        console.warn('Failed to load local storage:', e);
      }
    }
  }, []);

  // Save cards to localStorage when updated
  const handleSaveCards = (newCards: Flashcard[]) => {
    setCards(newCards);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(newCards));
    }
  };

  // Setting update handlers
  const handleSetPronunciationThreshold = (val: number) => {
    setPronunciationThreshold(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_THRESHOLD, val.toString());
    }
  };

  const handleSetShowHints = (val: boolean) => {
    setShowHints(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_HINTS, val.toString());
    }
  };

  // Reset handlers
  const handleResetStages = () => {
    const init = createInitialStageProgress();
    setStageProgress(init);
    setSpokenCardIds(new Set());
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_STAGES, JSON.stringify(init));
      localStorage.removeItem(STORAGE_KEY_SPOKEN);
    }
  };

  const handleResetCardsToDefault = () => {
    setCards(INITIAL_FLASHCARDS);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(INITIAL_FLASHCARDS));
    }
  };

  // Toggle mastered card
  const handleToggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_MASTERED, JSON.stringify(Array.from(next)));
      }
      return next;
    });
  };

  const handleClearMastered = () => {
    setMasteredIds(new Set());
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_MASTERED);
    }
  };

  // Stage completion handler (Flashcards = 2 stars, Quiz = 1 star, Total = 3 stars)
  const handleCompleteStage = (
    stageId: number,
    starsEarned: number,
    type?: 'cards' | 'quiz'
  ) => {
    setStageProgress((prev) => {
      const current = prev[stageId] || {
        stageId,
        stars: 0,
        isUnlocked: true,
        highScore: 0,
        cardsCompleted: false,
        quizCompleted: false,
      };

      let cardsDone = current.cardsCompleted || false;
      let quizDone = current.quizCompleted || false;

      if (type === 'cards') cardsDone = true;
      if (type === 'quiz') quizDone = true;

      // Flashcards = 2 stars, Quiz = 1 star
      const calculatedStars = (cardsDone ? 2 : 0) + (quizDone ? 1 : 0);
      const updatedStars = Math.min(3, Math.max(current.stars || 0, calculatedStars, starsEarned));

      const nextStageId = stageId + 1;

      const updatedMap: Record<number, StageProgress> = {
        ...prev,
        [stageId]: {
          ...current,
          stars: updatedStars,
          cardsCompleted: cardsDone,
          quizCompleted: quizDone,
          completedAt: Date.now(),
        },
      };

      // Requirement: Must earn at least 2 stars in previous stage to unlock next stage!
      const nextProg = normalizeStageProgress(updatedMap);

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_STAGES, JSON.stringify(nextProg));
      }

      return nextProg;
    });
  };

  // Navigate to next stage from modal (must have at least 2 stars)
  const handleGoToNextStage = () => {
    if (!activeStage) return;
    const currentStars = stageProgress[activeStage.id]?.stars || 0;
    if (currentStars < 2) return; // Must have at least 2 stars to proceed!

    const nextId = activeStage.id + 1;
    const nextStageObj = STAGES_DATA.find((s) => s.id === nextId);
    if (nextStageObj && stageProgress[nextId]?.isUnlocked) {
      setActiveStage(nextStageObj);
    }
  };

  // Total stars calculated
  const totalStars = useMemo(() => {
    return Object.values(stageProgress).reduce((acc, p) => acc + (p.stars || 0), 0);
  }, [stageProgress]);

  // Filtered Cards for free deck mode
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesCategory =
        selectedCategory === 'All' || card.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        card.word.toLowerCase().includes(q) ||
        card.thaiMeaning.toLowerCase().includes(q) ||
        card.englishMeaning.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [cards, selectedCategory, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cards.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [cards]);

  // Quiz questions state for free quiz mode
  const [freeQuizQuestions, setFreeQuizQuestions] = useState<QuizQuestion[]>([]);

  const generateFreeQuiz = useCallback(() => {
    const sourceCards = filteredCards.length >= 4 ? filteredCards : cards;
    const generated = generateQuizFromCards(sourceCards, 10);
    setFreeQuizQuestions(generated);
  }, [filteredCards, cards]);

  useEffect(() => {
    if (activeTab === 'quiz') {
      generateFreeQuiz();
    }
  }, [activeTab, generateFreeQuiz]);

  // Audio handlers
  const handlePlayWordAudio = (word: string) => {
    speak(word, 'en-US'); // Uses preferred speechRate
  };

  const handlePlayWordAudioSlow = (word: string) => {
    speakSlow(word, 'en-US'); // Speaks slowly at 0.75x
  };

  const handlePlaySentenceAudio = (sentence: string) => {
    speak(sentence, 'en-US', Math.max(0.7, speechRate * 0.95));
  };

  // Pronunciation Modal Handlers
  const handleOpenMic = (card: Flashcard) => {
    setActiveMicCard(card);
    resetResult();
  };

  const handleCloseMic = () => {
    stopListening();
    setActiveMicCard(null);
  };

  const handleStartMicListening = () => {
    if (activeMicCard) {
      startListening(activeMicCard.word);
    }
  };

  // Called ONLY when user pronounces correctly (score >= pronunciationThreshold)
  const handlePronunciationSuccess = useCallback(
    (card: Flashcard, score: number) => {
      if (score < pronunciationThreshold) return; // Incorrect pronunciation - DO NOT count!

      setSpokenCardIds((prev) => {
        if (prev.has(card.id)) return prev; // Already recorded, avoid unnecessary re-render!
        const next = new Set([...prev, card.id]);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_SPOKEN, JSON.stringify(Array.from(next)));
        }

        // If active stage is open, check if this completes all cards in the stage
        if (activeStage) {
          const allSpoken = activeStage.cards.every((c) => next.has(c.id));
          if (allSpoken) {
            handleCompleteStage(activeStage.id, 2, 'cards');
          }
        }

        return next;
      });
    },
    [activeStage, pronunciationThreshold]
  );

  // AI Cards Generated
  const handleNewAICards = (newCards: Flashcard[]) => {
    const updated = [...newCards, ...cards];
    handleSaveCards(updated);
    if (newCards.length > 0 && newCards[0].category) {
      setSelectedCategory(newCards[0].category);
    }
    setActiveTab('flashcards');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 via-sky-50/40 to-pink-50/30 text-slate-800">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
        cardCount={cards.length}
        totalStars={totalStars}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-4 sm:space-y-6 pb-28 sm:pb-12">
        {/* Top Hero: Kid Friendly Header (hidden on dedicated Settings tab) */}
        {activeTab !== 'settings' && (
          <section className="text-center space-y-2 pt-1 pb-1 sm:space-y-2.5 sm:pt-2 sm:pb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-amber-100 border-2 border-amber-300 text-[11px] sm:text-xs font-black text-amber-900 shadow-2xs">
              <span className="text-sm sm:text-base animate-bounce-gentle">🎈</span>
              <span>ดินแดนคำศัพท์หรรษา • เหมาะสำหรับเด็ก 5-6 ขวบ 🌟</span>
            </div>

            <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              เรียนรู้คำศัพท์ภาษาอังกฤษแสนสนุกกับ{' '}
              <span className="bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
                SmartAI Kids
              </span>{' '}
              🧸🎨
            </h1>

            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed px-2">
              ฟังเสียงพี่เจ้าของภาษา 🔊 พูดตามพี่ AI คนเก่ง 🎤 และสะสมดาว 3 ดวงผ่านด่านกันเถอะ! ✨
            </p>

            {/* Web Speech Status Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 pt-0.5 text-[11px] sm:text-xs font-bold">
              <span
                className={`inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border ${
                  ttsSupported
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>🔊 เสียงอ่านเจ้าของภาษา: พร้อมแล้ว</span>
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border ${
                  sttSupported
                    ? 'bg-sky-50 text-sky-800 border-sky-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>🎤 ไมค์ฝึกพูดกับ AI: พร้อมฟังคนเก่ง</span>
              </span>
            </div>
          </section>
        )}

        {/* ==================== VIEW 1: STAGE MAP (โหมด 5 ด่านผจญภัย 3 ดาว) ==================== */}
        {activeTab === 'stages' && (
          <StageMap
            stages={STAGES_DATA}
            progress={stageProgress}
            onSelectStage={(stage) => setActiveStage(stage)}
          />
        )}

        {/* ==================== VIEW 2: ALL FLASHCARDS (คลังการ์ดทั้งหมด) ==================== */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryCounts={categoryCounts}
              masteredCount={masteredIds.size}
              totalCards={cards.length}
            />

            <FlashcardDeck
              cards={filteredCards}
              onPlayWordAudio={handlePlayWordAudio}
              onPlayWordAudioSlow={handlePlayWordAudioSlow}
              onPlaySentenceAudio={handlePlaySentenceAudio}
              onOpenMic={handleOpenMic}
              isSpeaking={isSpeaking}
              masteredIds={masteredIds}
              onToggleMastered={handleToggleMastered}
            />
          </div>
        )}

        {/* ==================== VIEW 3: FREE QUIZ (เกมทายคำอิสระ) ==================== */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4.5 rounded-2xl bg-white border-2 border-pink-200 shadow-xs max-w-2xl mx-auto">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                  <span>หมวดหมู่เกมทายคำ:</span>
                  <span className="text-pink-600 font-extrabold">
                    {selectedCategory === 'All' ? 'รวมทุกหมวดหมู่ (All Cards) 🌟' : selectedCategory}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  มาเล่นเกมทายคำศัพท์สะสมแต้มกันเถอะคนเก่ง!
                </p>
              </div>

              <button
                onClick={generateFreeQuiz}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-300 transition-colors shrink-0 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>สุ่มคำถามใหม่ 🎲</span>
              </button>
            </div>

            <QuizContainer
              questions={freeQuizQuestions}
              onPlayAudio={handlePlayWordAudio}
              onRestartQuiz={generateFreeQuiz}
            />
          </div>
        )}

        {/* ==================== VIEW 4: TROPHY / STATS ==================== */}
        {activeTab === 'stats' && (
          <StatsOverview
            cards={cards}
            masteredIds={masteredIds}
            onClearMastered={handleClearMastered}
            onGoToDeck={() => setActiveTab('stages')}
          />
        )}

        {/* ==================== VIEW 5: SEPARATE SETTINGS (หน้าตั้งค่าแยก) ==================== */}
        {activeTab === 'settings' && (
          <SettingsView
            speechRate={speechRate}
            setSpeechRate={setSpeechRate}
            pronunciationThreshold={pronunciationThreshold}
            setPronunciationThreshold={handleSetPronunciationThreshold}
            showHints={showHints}
            setShowHints={handleSetShowHints}
            onTestAudio={(text) =>
              speak(text || 'Hello! I love learning English with SmartAI Kids.', 'en-US')
            }
            isSpeaking={isSpeaking}
            totalCards={cards.length}
            masteredCount={masteredIds.size}
            spokenCount={spokenCardIds.size}
            totalStars={totalStars}
            onResetStages={handleResetStages}
            onResetMastered={handleClearMastered}
            onResetCards={handleResetCardsToDefault}
            voices={voices}
            selectedVoice={selectedVoice}
            onSelectVoice={setSelectedVoice}
          />
        )}
      </main>

      {/* Stage Play Modal (Flashcards + 3-Star Challenge Quiz) */}
      <StagePlayModal
        stage={activeStage}
        isOpen={!!activeStage}
        onClose={() => setActiveStage(null)}
        currentStars={activeStage ? stageProgress[activeStage.id]?.stars || 0 : 0}
        stageProgress={activeStage ? stageProgress[activeStage.id] : undefined}
        onPlayWordAudio={handlePlayWordAudio}
        onPlayWordAudioSlow={handlePlayWordAudioSlow}
        onPlaySentenceAudio={handlePlaySentenceAudio}
        onOpenMic={handleOpenMic}
        isSpeaking={isSpeaking}
        masteredIds={masteredIds}
        onToggleMastered={handleToggleMastered}
        onCompleteStage={handleCompleteStage}
        onGoToNextStage={handleGoToNextStage}
        hasNextStage={activeStage ? activeStage.id < STAGES_DATA.length : false}
        spokenCardIds={spokenCardIds}
      />

      {/* Pronunciation Recording Modal */}
      {activeMicCard && (
        <PronunciationModal
          card={activeMicCard}
          isOpen={!!activeMicCard}
          onClose={handleCloseMic}
          isListening={isListening}
          transcript={transcript}
          interimTranscript={interimTranscript}
          error={sttError}
          result={pronunciationResult}
          audioLevel={audioLevel}
          hasPermission={hasMicPermission}
          onStartListening={handleStartMicListening}
          onStopListening={stopListening}
          onPlayTargetWord={() => handlePlayWordAudio(activeMicCard.word)}
          onSuccess={handlePronunciationSuccess}
          passingScore={pronunciationThreshold}
        />
      )}

      {/* AI Card Generator Modal */}
      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onCardsGenerated={handleNewAICards}
      />
    </div>
  );
}
