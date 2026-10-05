import { Stage } from '../types/stage';
import { INITIAL_FLASHCARDS, generateQuizFromCards } from './mockCards';

// Helper to pick cards by id
const getCard = (id: string) => {
  const card = INITIAL_FLASHCARDS.find((c) => c.id === id);
  if (!card) {
    throw new Error(`Card with id ${id} not found`);
  }
  return card;
};

export const STAGES_DATA: Stage[] = [
  {
    id: 1,
    title: 'ด่านที่ 1: แก๊งสัตว์โลกน่ารัก 🐶',
    subtitle: 'มาเรียนรู้เพื่อนสัตว์แสนซนรอบตัวกันเถอะ (Dog, Cat, Dolphin, Lion) 🐾',
    icon: '🐶',
    bgGradient: 'from-amber-400 via-orange-400 to-amber-500',
    borderColor: 'border-amber-300',
    cards: [getCard('anim-1'), getCard('anim-2'), getCard('anim-5'), getCard('anim-3')], // Dog, Cat, Dolphin, Lion
    quizQuestions: generateQuizFromCards([getCard('anim-1'), getCard('anim-2'), getCard('anim-5'), getCard('anim-3')], 4),
  },
  {
    id: 2,
    title: 'ด่านที่ 2: ตะลุยผลไม้แสนอร่อย 🍎',
    subtitle: 'ผลไม้สีสวยหวานฉ่ำน่ากิน (Apple, Banana, Orange, Mango) 🍌',
    icon: '🍎',
    bgGradient: 'from-emerald-400 via-teal-400 to-green-500',
    borderColor: 'border-emerald-300',
    cards: [getCard('food-1'), getCard('food-2'), getCard('food-3'), getCard('food-4')], // Apple, Banana, Orange, Mango
    quizQuestions: generateQuizFromCards([getCard('food-1'), getCard('food-2'), getCard('food-3'), getCard('food-4')], 4),
  },
  {
    id: 3,
    title: 'ด่านที่ 3: พูดคุยทักทายคนเก่ง 💬',
    subtitle: 'คำพูดน่ารักสำหรับทักทายและขอบคุณ (Greeting, Excuse me, Thank you) 👋',
    icon: '💬',
    bgGradient: 'from-sky-400 via-blue-400 to-indigo-500',
    borderColor: 'border-sky-300',
    cards: [getCard('conv-1'), getCard('conv-2'), getCard('conv-3'), getCard('conv-4'), getCard('conv-5')], // Greeting, Excuse me, Thank you, Absolutely, No problem
    quizQuestions: generateQuizFromCards([getCard('conv-1'), getCard('conv-2'), getCard('conv-3'), getCard('conv-4'), getCard('conv-5')], 5),
  },
  {
    id: 4,
    title: 'ด่านที่ 4: เที่ยวสนุกรอบโลก ✈️',
    subtitle: 'ออกเดินทางผจญภัยกับยานพาหนะสุดเท่ (Airport, Station, Passport, Ticket) 🚗',
    icon: '✈️',
    bgGradient: 'from-cyan-400 via-sky-400 to-blue-500',
    borderColor: 'border-cyan-300',
    cards: [getCard('trv-1'), getCard('trv-2'), getCard('trv-3'), getCard('trv-4')], // Airport, Station, Passport, Ticket
    quizQuestions: generateQuizFromCards([getCard('trv-1'), getCard('trv-2'), getCard('trv-3'), getCard('trv-4')], 4),
  },
  {
    id: 5,
    title: 'ด่านที่ 5: ยิ้มแย้มแจ่มใส 😊',
    subtitle: 'อารมณ์ความรู้สึกแสนสุขใจ (Happy, Confident, Curious, Creative) 🌟',
    icon: '😊',
    bgGradient: 'from-pink-400 via-rose-400 to-purple-500',
    borderColor: 'border-pink-300',
    cards: [getCard('feel-1'), getCard('feel-2'), getCard('feel-3'), getCard('feel-4')], // Happy, Confident, Curious, Creative
    quizQuestions: generateQuizFromCards([getCard('feel-1'), getCard('feel-2'), getCard('feel-3'), getCard('feel-4')], 4),
  },
];
