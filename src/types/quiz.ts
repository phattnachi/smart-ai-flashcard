export type QuizQuestionType = 'thai-meaning' | 'english-definition' | 'fill-in-blank';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  targetWord: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedCardId: string;
  hint?: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  selectedOption: number | null;
  isAnswerSubmitted: boolean;
  score: number;
  isFinished: boolean;
  history: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
}
