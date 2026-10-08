import { Stage } from '../types/stage';
import { INITIAL_FLASHCARDS, generateQuizFromCards } from './mockCards';

// Helper to pick cards by id safely
const getCard = (id: string) => {
  const card = INITIAL_FLASHCARDS.find((c) => c.id === id);
  if (!card) {
    throw new Error(`Card with id ${id} not found in INITIAL_FLASHCARDS`);
  }
  return card;
};

export const STAGES_DATA: Stage[] = [
  {
    id: 1,
    title: 'ด่านที่ 1: แก๊งสัตว์โลกน่ารัก 🐶',
    subtitle: 'มาเป็นเพื่อนกับสัตว์แสนซนรอบตัวกันเถอะ (Cat, Dog, Bird, Fish, Lion, Duck) 🐾',
    icon: '🐶',
    bgGradient: 'from-amber-400 via-orange-400 to-amber-500',
    borderColor: 'border-amber-300',
    cards: [
      getCard('anim-1'), // Cat
      getCard('anim-2'), // Dog
      getCard('anim-3'), // Bird
      getCard('anim-4'), // Fish
      getCard('anim-5'), // Lion
      getCard('anim-6'), // Duck
    ],
    quizQuestions: generateQuizFromCards(
      [
        getCard('anim-1'),
        getCard('anim-2'),
        getCard('anim-3'),
        getCard('anim-4'),
        getCard('anim-5'),
        getCard('anim-6'),
      ],
      5
    ),
  },
  {
    id: 2,
    title: 'ด่านที่ 2: สีสันสดใส & ผลไม้แสนหวาน 🍎',
    subtitle: 'ผลไม้อร่อยและสีสันแสนสวยรอบกาย (Apple, Banana, Red, Blue, Yellow, Orange) 🍌',
    icon: '🍎',
    bgGradient: 'from-emerald-400 via-teal-400 to-green-500',
    borderColor: 'border-emerald-300',
    cards: [
      getCard('food-1'), // Apple
      getCard('food-2'), // Banana
      getCard('clr-1'),  // Red
      getCard('clr-2'),  // Blue
      getCard('clr-3'),  // Yellow
      getCard('food-3'), // Orange
    ],
    quizQuestions: generateQuizFromCards(
      [
        getCard('food-1'),
        getCard('food-2'),
        getCard('clr-1'),
        getCard('clr-2'),
        getCard('clr-3'),
        getCard('food-3'),
      ],
      5
    ),
  },
  {
    id: 3,
    title: 'ด่านที่ 3: สิ่งของรอบตัว & เครื่องเขียน 🎒',
    subtitle: 'อุปกรณ์และของใช้ในโรงเรียนคนเก่ง (Book, Pen, Bag, Pencil, Chair, Desk) ✏️',
    icon: '🎒',
    bgGradient: 'from-sky-400 via-blue-400 to-indigo-500',
    borderColor: 'border-sky-300',
    cards: [
      getCard('obj-1'), // Book
      getCard('obj-2'), // Pen
      getCard('obj-3'), // Bag
      getCard('obj-4'), // Pencil
      getCard('obj-5'), // Chair
      getCard('obj-6'), // Desk
    ],
    quizQuestions: generateQuizFromCards(
      [
        getCard('obj-1'),
        getCard('obj-2'),
        getCard('obj-3'),
        getCard('obj-4'),
        getCard('obj-5'),
        getCard('obj-6'),
      ],
      5
    ),
  },
  {
    id: 4,
    title: 'ด่านที่ 4: ธรรมชาติรอบกายแสนสวย ☀️',
    subtitle: 'ท้องฟ้า พระอาทิตย์ และต้นไม้ใบหญ้า (Sun, Star, Moon, Tree, Rain, Green) 🌳',
    icon: '☀️',
    bgGradient: 'from-amber-400 via-yellow-400 to-lime-500',
    borderColor: 'border-yellow-300',
    cards: [
      getCard('nat-1'), // Sun
      getCard('nat-2'), // Star
      getCard('nat-3'), // Moon
      getCard('nat-4'), // Tree
      getCard('nat-5'), // Rain
      getCard('clr-4'), // Green
    ],
    quizQuestions: generateQuizFromCards(
      [
        getCard('nat-1'),
        getCard('nat-2'),
        getCard('nat-3'),
        getCard('nat-4'),
        getCard('nat-5'),
        getCard('clr-4'),
      ],
      5
    ),
  },
  {
    id: 5,
    title: 'ด่านที่ 5: ยิ้มแย้มแจ่มใส & ความสุขใจ 😊',
    subtitle: 'อารมณ์ความสุขและคำน่ารักในบ้าน (Happy, Smile, Milk, Baby, Love, Pink) 🌟',
    icon: '😊',
    bgGradient: 'from-pink-400 via-rose-400 to-purple-500',
    borderColor: 'border-pink-300',
    cards: [
      getCard('feel-1'), // Happy
      getCard('feel-2'), // Smile
      getCard('day-1'),  // Milk
      getCard('day-2'),  // Baby
      getCard('day-3'),  // Love
      getCard('clr-5'),  // Pink
    ],
    quizQuestions: generateQuizFromCards(
      [
        getCard('feel-1'),
        getCard('feel-2'),
        getCard('day-1'),
        getCard('day-2'),
        getCard('day-3'),
        getCard('clr-5'),
      ],
      5
    ),
  },
];
