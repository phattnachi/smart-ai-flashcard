export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Flashcard {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  thaiMeaning: string;
  englishMeaning: string;
  exampleSentence: string;
  exampleTranslation: string;
  category: string;
  difficulty: DifficultyLevel;
  tags?: string[];
  mastered?: boolean;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
  cards: Flashcard[];
}

export interface PronunciationResult {
  transcript: string;
  targetWord: string;
  score: number; // 0 - 100
  accuracy: 'perfect' | 'great' | 'needs-practice';
  feedback: string;
}
