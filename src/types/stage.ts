import { Flashcard } from './flashcard';
import { QuizQuestion } from './quiz';

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  bgGradient: string;
  borderColor: string;
  cards: Flashcard[];
  quizQuestions: QuizQuestion[];
}

export interface StageProgress {
  stageId: number;
  stars: number; // 0 - 3 stars
  isUnlocked: boolean;
  highScore: number;
  completedAt?: number;
  cardsCompleted?: boolean;
  quizCompleted?: boolean;
}
