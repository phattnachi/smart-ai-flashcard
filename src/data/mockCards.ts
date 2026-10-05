import { Flashcard, FlashcardDeck } from '../types/flashcard';
import { QuizQuestion } from '../types/quiz';

export const WORD_EMOJIS: Record<string, string> = {
  Dog: '🐶',
  Cat: '🐱',
  Lion: '🦁',
  Elephant: '🐘',
  Dolphin: '🐬',
  Eagle: '🦅',
  Apple: '🍎',
  Banana: '🍌',
  Orange: '🍊',
  Mango: '🥭',
  Sandwich: '🥪',
  Pizza: '🍕',
  Greeting: '👋',
  'Excuse me': '🙋',
  'Thank you': '🙏',
  Absolutely: '👍',
  'No problem': '👌',
  Welcome: '🎈',
  Airport: '✈️',
  Station: '🚉',
  Passport: '📘',
  Ticket: '🎫',
  Happy: '😊',
  Confident: '💪',
  Curious: '🧐',
  Creative: '🎨',
};

export const INITIAL_FLASHCARDS: Flashcard[] = [
  // 🐾 Animals (หมวดสัตว์รอบตัว)
  {
    id: 'anim-1',
    word: 'Dog',
    phonetic: '/dɔːɡ/',
    partOfSpeech: 'noun',
    thaiMeaning: 'สุนัข, หมา',
    englishMeaning: 'A cute pet that barks "Woof woof!" 🐶',
    exampleSentence: 'I love my cute puppy.',
    exampleTranslation: 'หนูรักน้องหมาตัวน้อยจังเลย',
    category: 'Animals',
    difficulty: 'Beginner',
    tags: ['pet', 'animal', 'companion'],
  },
  {
    id: 'anim-2',
    word: 'Cat',
    phonetic: '/kæt/',
    partOfSpeech: 'noun',
    thaiMeaning: 'แมวเหมียว',
    englishMeaning: 'A soft furry pet that says "Meow meow!" 🐱',
    exampleSentence: 'The little cat loves to drink milk.',
    exampleTranslation: 'ลูกแมวน้อยชอบกินนมจังเลย',
    category: 'Animals',
    difficulty: 'Beginner',
    tags: ['pet', 'animal', 'cute'],
  },
  {
    id: 'anim-3',
    word: 'Lion',
    phonetic: '/ˈlaɪ.ən/',
    partOfSpeech: 'noun',
    thaiMeaning: 'สิงโต (เจ้าป่า)',
    englishMeaning: 'The brave and strong king of the jungle! 🦁',
    exampleSentence: 'The lion roars loudly in the forest.',
    exampleTranslation: 'สิงโตคำรามเสียงดังก้องในป่า',
    category: 'Animals',
    difficulty: 'Beginner',
    tags: ['wildlife', 'safari', 'big-cat'],
  },
  {
    id: 'anim-4',
    word: 'Elephant',
    phonetic: '/ˈel.ə.fənt/',
    partOfSpeech: 'noun',
    thaiMeaning: 'ช้างตัวใหญ่',
    englishMeaning: 'A big gentle animal with a long trunk 🐘',
    exampleSentence: 'The big elephant loves sweet bananas.',
    exampleTranslation: 'ช้างตัวใหญ่ชอบกินกล้วยแสนหวาน',
    category: 'Animals',
    difficulty: 'Beginner',
    tags: ['wildlife', 'nature', 'trunk'],
  },
  {
    id: 'anim-5',
    word: 'Dolphin',
    phonetic: '/ˈdɑːl.fɪn/',
    partOfSpeech: 'noun',
    thaiMeaning: 'ปลาโลมาแสนรู้',
    englishMeaning: 'A friendly and smart animal that swims in the sea 🐬',
    exampleSentence: 'The dolphin jumps high out of the blue water.',
    exampleTranslation: 'ปลาโลมากระโดดขึ้นเหนือน้ำทะเลสีฟ้า',
    category: 'Animals',
    difficulty: 'Beginner',
    tags: ['ocean', 'marine', 'friendly'],
  },
  {
    id: 'anim-6',
    word: 'Eagle',
    phonetic: '/ˈiː.ɡəl/',
    partOfSpeech: 'noun',
    thaiMeaning: 'นกอินทรี',
    englishMeaning: 'A brave bird with big wings flying high 🦅',
    exampleSentence: 'The eagle flies high in the blue sky.',
    exampleTranslation: 'นกอินทรีบินอยู่สูงบนท้องฟ้าสีฟ้า',
    category: 'Animals',
    difficulty: 'Beginner',
    tags: ['bird', 'nature', 'wings'],
  },

  // 🍎 Fruits & Food (หมวดผลไม้และอาหาร)
  {
    id: 'food-1',
    word: 'Apple',
    phonetic: '/ˈæp.əl/',
    partOfSpeech: 'noun',
    thaiMeaning: 'แอปเปิล',
    englishMeaning: 'A sweet, crunchy red fruit that is yummy 🍎',
    exampleSentence: 'I eat a sweet red apple every day.',
    exampleTranslation: 'หนูกินแอปเปิลสีแดงแสนอร่อยทุกวัน',
    category: 'Fruits & Food',
    difficulty: 'Beginner',
    tags: ['fruit', 'healthy', 'sweet'],
  },
  {
    id: 'food-2',
    word: 'Banana',
    phonetic: '/bəˈnæn.ə/',
    partOfSpeech: 'noun',
    thaiMeaning: 'กล้วย',
    englishMeaning: 'A sweet yellow fruit that monkeys love 🍌',
    exampleSentence: 'Monkeys love to eat yellow bananas.',
    exampleTranslation: 'พวกเจ้าลิงชอบกินกล้วยสีเหลือง',
    category: 'Fruits & Food',
    difficulty: 'Beginner',
    tags: ['fruit', 'energy', 'snack'],
  },
  {
    id: 'food-3',
    word: 'Orange',
    phonetic: '/ˈɔːr.ɪndʒ/',
    partOfSpeech: 'noun',
    thaiMeaning: 'ส้ม',
    englishMeaning: 'A juicy, round orange fruit full of vitamins 🍊',
    exampleSentence: 'This cold orange juice is so sweet.',
    exampleTranslation: 'น้ำส้มเย็นๆ แก้วนี้หวานชื่นใจจัง',
    category: 'Fruits & Food',
    difficulty: 'Beginner',
    tags: ['fruit', 'citrus', 'vitamin-c'],
  },
  {
    id: 'food-4',
    word: 'Mango',
    phonetic: '/ˈmæŋ.ɡoʊ/',
    partOfSpeech: 'noun',
    thaiMeaning: 'มะม่วง',
    englishMeaning: 'A delicious golden tropical fruit 🥭',
    exampleSentence: 'Sweet yellow mango is my favorite fruit.',
    exampleTranslation: 'มะม่วงสุกหอมหวานคือผลไม้โปรดของหนู',
    category: 'Fruits & Food',
    difficulty: 'Beginner',
    tags: ['tropical', 'fruit', 'dessert'],
  },
  {
    id: 'food-5',
    word: 'Sandwich',
    phonetic: '/ˈsæn.wɪtʃ/',
    partOfSpeech: 'noun',
    thaiMeaning: 'แซนด์วิช',
    englishMeaning: 'Yummy bread with cheese and veggies 🥪',
    exampleSentence: 'Mom made a tasty sandwich for my lunch.',
    exampleTranslation: 'คุณแม่ทำแซนด์วิชแสนอร่อยให้หนูทาน',
    category: 'Fruits & Food',
    difficulty: 'Beginner',
    tags: ['lunch', 'meal', 'bread'],
  },
  {
    id: 'food-6',
    word: 'Pizza',
    phonetic: '/ˈpiːt.sə/',
    partOfSpeech: 'noun',
    thaiMeaning: 'พิซซ่า',
    englishMeaning: 'Yummy warm cheese bread that kids love 🍕',
    exampleSentence: 'We share a warm pizza together.',
    exampleTranslation: 'พวกเราแบ่งพิซซ่าอุ่นๆ ทานด้วยกันอย่างเอร็ดอร่อย',
    category: 'Fruits & Food',
    difficulty: 'Beginner',
    tags: ['food', 'popular', 'party'],
  },

  // 💬 Daily Conversation (การพูดและบทสนทนาทั่วไป)
  {
    id: 'conv-1',
    word: 'Greeting',
    phonetic: '/ˈɡriː.tɪŋ/',
    partOfSpeech: 'noun',
    thaiMeaning: 'การทักทาย, คำทักทาย',
    englishMeaning: 'Saying hello and smiling to our friends! 👋',
    exampleSentence: 'I say a happy hello to my teacher.',
    exampleTranslation: 'หนูกล่าวทักทายคุณครูด้วยรอยยิ้มสดใส',
    category: 'Daily Conversation',
    difficulty: 'Beginner',
    tags: ['social', 'speaking', 'polite'],
  },
  {
    id: 'conv-2',
    word: 'Excuse me',
    phonetic: '/ɪkˈskjuːz miː/',
    partOfSpeech: 'phrase',
    thaiMeaning: 'ขอโทษนะคะ/ครับ (ขอทางหรือขอความช่วยเหลือ)',
    englishMeaning: 'A polite word to ask for help or say hello 🙋',
    exampleSentence: 'Excuse me, may I please have a pencil?',
    exampleTranslation: 'ขอโทษนะคะ/ครับ หนูขอยืมดินสอหน่อยได้ไหม',
    category: 'Daily Conversation',
    difficulty: 'Beginner',
    tags: ['polite', 'travel', 'speaking'],
  },
  {
    id: 'conv-3',
    word: 'Thank you',
    phonetic: '/ˈθæŋk juː/',
    partOfSpeech: 'phrase',
    thaiMeaning: 'ขอบคุณค่ะ/ครับ',
    englishMeaning: 'A sweet polite word to say when someone helps us 🙏',
    exampleSentence: 'Thank you for helping me with my toys.',
    exampleTranslation: 'ขอบคุณที่ช่วยหนูเก็บของเล่นนะคะ',
    category: 'Daily Conversation',
    difficulty: 'Beginner',
    tags: ['polite', 'gratitude', 'essential'],
  },
  {
    id: 'conv-4',
    word: 'Absolutely',
    phonetic: '/ˌæb.səˈluːt.li/',
    partOfSpeech: 'adverb',
    thaiMeaning: 'แน่นอนที่สุด, ตกลงเลย',
    englishMeaning: 'Saying "Yes, of course! Let us do it!" 👍',
    exampleSentence: 'Do you want to play a game? Absolutely!',
    exampleTranslation: 'อยากเล่นเกมด้วยกันไหม? เล่นแน่นอนจ้า!',
    category: 'Daily Conversation',
    difficulty: 'Beginner',
    tags: ['agreement', 'natural-speech', 'chat'],
  },
  {
    id: 'conv-5',
    word: 'No problem',
    phonetic: '/noʊ ˈprɑː.bləm/',
    partOfSpeech: 'phrase',
    thaiMeaning: 'ไม่มีปัญหา, สบายมาก ยินดีช่วยเหลือ',
    englishMeaning: 'Saying "It is easy, I am happy to help!" 👌',
    exampleSentence: 'Can you share your crayons? No problem!',
    exampleTranslation: 'ขอยืมสีเทียนหน่อยได้ไหม? ได้เลย สบายมาก!',
    category: 'Daily Conversation',
    difficulty: 'Beginner',
    tags: ['friendly', 'reply', 'everyday'],
  },
  {
    id: 'conv-6',
    word: 'Welcome',
    phonetic: '/ˈwel.kəm/',
    partOfSpeech: 'noun / verb',
    thaiMeaning: 'ยินดีต้อนรับ',
    englishMeaning: 'Happy to see our friends arrive! 🎈',
    exampleSentence: 'Welcome to our fun classroom!',
    exampleTranslation: 'ยินดีต้อนรับสู่ห้องเรียนแสนสนุกของเราจ้า',
    category: 'Daily Conversation',
    difficulty: 'Beginner',
    tags: ['welcome', 'club', 'campus'],
  },

  // ✈️ Travel & Places (การเดินทางและสถานที่)
  {
    id: 'trv-1',
    word: 'Airport',
    phonetic: '/ˈer.pɔːrt/',
    partOfSpeech: 'noun',
    thaiMeaning: 'สนามบิน',
    englishMeaning: 'A big place where airplanes take off and fly ✈️',
    exampleSentence: 'We see big airplanes at the airport.',
    exampleTranslation: 'พวกเราเห็นเครื่องบินลำใหญ่ที่สนามบิน',
    category: 'Travel & Places',
    difficulty: 'Beginner',
    tags: ['travel', 'flight', 'transport'],
  },
  {
    id: 'trv-2',
    word: 'Station',
    phonetic: '/ˈsteɪ.ʃən/',
    partOfSpeech: 'noun',
    thaiMeaning: 'สถานีรถไฟ',
    englishMeaning: 'A place where trains stop to pick up passengers 🚉',
    exampleSentence: 'The colorful train arrives at the station.',
    exampleTranslation: 'รถไฟสีสันสดใสแล่นมาจอดที่สถานี',
    category: 'Travel & Places',
    difficulty: 'Beginner',
    tags: ['commute', 'train', 'city'],
  },
  {
    id: 'trv-3',
    word: 'Passport',
    phonetic: '/ˈpæs.pɔːrt/',
    partOfSpeech: 'noun',
    thaiMeaning: 'สมุดพาสปอร์ต (หนังสือเดินทาง)',
    englishMeaning: 'A little book for traveling to fun places 📘',
    exampleSentence: 'Keep your passport safe in your little bag.',
    exampleTranslation: 'เก็บสมุดพาสปอร์ตไว้ในกระเป๋าใบเล็กให้ดีนะ',
    category: 'Travel & Places',
    difficulty: 'Beginner',
    tags: ['abroad', 'document', 'travel'],
  },
  {
    id: 'trv-4',
    word: 'Ticket',
    phonetic: '/ˈtɪk.ɪt/',
    partOfSpeech: 'noun',
    thaiMeaning: 'ตั๋วรถ, บัตรผ่าน',
    englishMeaning: 'A little paper pass to ride the train or bus 🎫',
    exampleSentence: 'Here is my ticket to ride the zoo train.',
    exampleTranslation: 'นี่คือตั๋วของหนูสำหรับนั่งรถไฟชมสวนสัตว์',
    category: 'Travel & Places',
    difficulty: 'Beginner',
    tags: ['ticket', 'travel', 'fare'],
  },

  // 😊 Feelings & Personality (อารมณ์และนิสัย)
  {
    id: 'feel-1',
    word: 'Happy',
    phonetic: '/ˈhæp.i/',
    partOfSpeech: 'adjective',
    thaiMeaning: 'มีความสุข, สุขใจ',
    englishMeaning: 'Smiling with joy and feeling super good! 😊',
    exampleSentence: 'I am very happy when playing with friends.',
    exampleTranslation: 'หนูมีความสุขมากๆ เวลาเล่นกับเพื่อนๆ',
    category: 'Feelings & Personality',
    difficulty: 'Beginner',
    tags: ['emotion', 'positive', 'mood'],
  },
  {
    id: 'feel-2',
    word: 'Confident',
    phonetic: '/ˈkɑːn.fə.dənt/',
    partOfSpeech: 'adjective',
    thaiMeaning: 'มั่นใจในตัวเอง, เก่งและกล้าหาญ',
    englishMeaning: 'Feeling brave: "I can do this!" 💪',
    exampleSentence: 'I am confident that I can speak English.',
    exampleTranslation: 'หนูมั่นใจว่าหนูพูดภาษาอังกฤษได้แน่นอน',
    category: 'Feelings & Personality',
    difficulty: 'Beginner',
    tags: ['mindset', 'speaking', 'presentation'],
  },
  {
    id: 'feel-3',
    word: 'Curious',
    phonetic: '/ˈkjʊr.i.əs/',
    partOfSpeech: 'adjective',
    thaiMeaning: 'อยากรู้อยากเห็น, ช่างสงสัยใฝ่รู้',
    englishMeaning: 'Excited to explore and learn new things! 🧐',
    exampleSentence: 'The curious child loves reading picture books.',
    exampleTranslation: 'เด็กน้อยช่างสงสัยชอบเปิดอ่านหนังสือนิทาน',
    category: 'Feelings & Personality',
    difficulty: 'Beginner',
    tags: ['learning', 'curiosity', 'student'],
  },
  {
    id: 'feel-4',
    word: 'Creative',
    phonetic: '/kriˈeɪ.t̬ɪv/',
    partOfSpeech: 'adjective',
    thaiMeaning: 'มีความคิดสร้างสรรค์',
    englishMeaning: 'Full of fun imagination and colorful ideas 🎨',
    exampleSentence: 'She draws a creative flying car with wings.',
    exampleTranslation: 'เธอวาดรูปรถบินติดปีกสุดสร้างสรรค์',
    category: 'Feelings & Personality',
    difficulty: 'Beginner',
    tags: ['imagination', 'innovation', 'skills'],
  },
];

export const CATEGORIES = [
  { id: 'All', label: 'ทั้งหมด (All Cards)', icon: 'GraduationCap', count: 26, color: 'from-indigo-600 to-violet-600' },
  { id: 'Animals', label: 'สัตว์น่ารู้ (Animals)', icon: 'Dog', count: 6, color: 'from-amber-500 to-orange-600' },
  { id: 'Fruits & Food', label: 'ผลไม้ & อาหาร (Food)', icon: 'Apple', count: 6, color: 'from-emerald-500 to-teal-600' },
  { id: 'Daily Conversation', label: 'การพูดทั่วไป (Conversation)', icon: 'MessageCircle', count: 6, color: 'from-blue-600 to-indigo-600' },
  { id: 'Travel & Places', label: 'การเดินทาง (Travel)', icon: 'Compass', count: 4, color: 'from-purple-600 to-pink-600' },
  { id: 'Feelings & Personality', label: 'อารมณ์ & นิสัย (Feelings)', icon: 'Heart', count: 4, color: 'from-rose-500 to-pink-500' },
];

export const WORD_HINTS: Record<string, string> = {
  Dog: 'น้องเป็นสัตว์เลี้ยงแสนซื่อสัตย์ ชอบกระดิกหางและเห่า "โฮ่งๆ" 🐶',
  Cat: 'น้องชอบนอนทั้งวัน ชอบกินปลา และร้อง "เหมียวๆ" 🐱',
  Lion: 'เจ้าป่าแสนดุร้าย มีแผงคอสีทองอร่ามและชอบคำรามเสียงดัง "โฮก!" 🦁',
  Elephant: 'สัตว์บกตัวโตที่สุด มีงวงยาวๆ พ่นน้ำได้ และมีใบหูใหญ่เหมือนพัด 🐘',
  Dolphin: 'เพื่อนรักแห่งท้องทะเล ว่ายน้ำเร็ว ชอบกระโดดโชว์ตีลังกาเหนือน้ำ 🐬',
  Eagle: 'พญานกที่มีสายตาเฉียบคม มีปีกขนาดใหญ่ บินร่อนสูงเสียดฟ้า 🦅',
  Apple: 'ผลไม้สีแดงกลมๆ กรอบอร่อย สโนว์ไวท์ชอบกินมาก 🍎',
  Banana: 'ผลไม้ทรงยาวสีเหลือง รสหวานนุ่ม ของโปรดของพี่ลิงจ๋อ 🍌',
  Orange: 'ผลไม้ทรงกลมสีส้ม มีวิตามินซีสูง รสชาติหวานอมเปรี้ยวชื่นใจ 🍊',
  Mango: 'ผลไม้หน้าร้อนสุดฮิต เมื่อสุกแล้วจะมีสีเหลืองทอง หวานฉ่ำกินกับข้าวเหนียว 🥭',
  Sandwich: 'ขนมปังสองแผ่นประกบกัน ตรงกลางมีชีส แฮม และผัก 🥪',
  Pizza: 'แป้งกลมๆ อบชีสยืดเยิ้ม หอมกรุ่น ตัดเป็นชิ้นสามเหลี่ยม 🍕',
  Greeting: 'การทักทายโบกมือและกล่าว "สวัสดี" เมื่อเจอคุณครูหรือเพื่อนๆ 👋',
  'Excuse me': 'คำพูดสุภาพเวลาจะขอเดินผ่าน หรือขอความช่วยเหลือจากคนอื่น 🙋',
  'Thank you': 'คำพูดวิเศษที่ควรพูดเสมอเวลาได้รับของหรือความช่วยเหลือจากผู้อื่น 🙏',
  Absolutely: 'คำตอบรับแบบเต็มใจสุดๆ แปลว่า "แน่นอนที่สุด!" หรือ "ตกลงเลย!" 👍',
  'No problem': 'คำตอบรับอย่างใจดี แปลว่า "สบายมาก ไม่มีปัญหา ยินดีช่วยจ้า" 👌',
  Welcome: 'คำพูดกล่าวต้อนรับเพื่อนๆ หรือแขกที่มาเที่ยวบ้านเรา 🎈',
  Airport: 'สถานที่กว้างใหญ่ มีลานบินและเครื่องบินลำใหญ่กำลังบินขึ้นฟ้า ✈️',
  Station: 'สถานที่ที่ผู้คนมารอขึ้นรถไฟ มีรางรถไฟยาวสุดลูกหูลูกตา 🚉',
  Passport: 'สมุดเล่มเล็กๆ สีกรมท่าหรือแดง ที่ต้องพกติดตัวเวลาบินไปต่างประเทศ 📘',
  Ticket: 'กระดาษหรือการ์ดใบเล็กๆ ที่ใช้ยื่นเพื่อขึ้นรถไฟหรือเข้าสวนสนุก 🎫',
  Happy: 'ความรู้สึกเบิกบานใจ มีรอยยิ้มกว้างบนใบหน้าและหัวเราะอย่างสดใส 😊',
  Confident: 'ความรู้สึกกล้าหาญ เชื่อมั่นในตัวเองว่า "หนูทำได้แน่นอน!" 💪',
  Curious: 'ความรู้สึกช่างสงสัย ชอบตั้งคำถามและอยากสำรวจสิ่งใหม่ๆ ตลอดเวลา 🧐',
  Creative: 'ความคิดแปลกใหม่ ชอบวาดรูป ระบายสี และประดิษฐ์ของเล่นเอง 🎨',
};

/**
 * Generates 4-choice child-friendly quiz questions dynamically from the flashcards array.
 * Tailored specially for 5-6 year olds (kindergarten / early primary school).
 */
export function generateQuizFromCards(cards: Flashcard[], count = 10): QuizQuestion[] {
  if (!cards || cards.length === 0) return [];
  const shuffledCards = [...cards].sort(() => 0.5 - Math.random());
  const selectedCards = shuffledCards.slice(0, Math.min(count, shuffledCards.length));

  return selectedCards.map((card, idx) => {
    const qTypeIndex = idx % 3;
    let type: QuizQuestion['type'] = 'thai-meaning';
    let questionText = '';
    const emoji = WORD_EMOJIS[card.word] || '✨';
    const hint = WORD_HINTS[card.word] || `ลองนึกถึงคำว่า "${card.thaiMeaning}" ดูนะคนเก่ง ${emoji}`;

    if (qTypeIndex === 0) {
      type = 'thai-meaning';
      questionText = `คำว่า "${card.word}" ${emoji} แปลว่าอะไรนะคนเก่ง? 🌟`;
    } else if (qTypeIndex === 1) {
      type = 'english-definition';
      questionText = `คำว่า "${card.thaiMeaning}" ${emoji} ภาษาอังกฤษคือคำไหนเอ่ย? 🎈`;
    } else {
      type = 'fill-in-blank';
      questionText = `กดปุ่มฟังเสียง 🔊 แล้วทายซิว่าคือคำว่าอะไร? 🎧`;
    }

    const otherCards = cards.filter((c) => c.id !== card.id);
    const shuffledOthers = [...otherCards].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3);

    let correctAnswer = '';
    let incorrectOptions: string[] = [];

    if (type === 'thai-meaning') {
      correctAnswer = card.thaiMeaning.replace(/\p{Extended_Pictographic}/gu, '').trim();
      incorrectOptions = distractors.map((d) =>
        d.thaiMeaning.replace(/\p{Extended_Pictographic}/gu, '').trim()
      );
    } else {
      correctAnswer = card.word.replace(/\p{Extended_Pictographic}/gu, '').trim();
      incorrectOptions = distractors.map((d) =>
        d.word.replace(/\p{Extended_Pictographic}/gu, '').trim()
      );
    }

    const allOptions = [correctAnswer, ...incorrectOptions].sort(() => 0.5 - Math.random());
    const correctIndex = allOptions.indexOf(correctAnswer);

    return {
      id: `quiz-${card.id}-${idx}`,
      type,
      question: questionText,
      targetWord: card.word,
      options: allOptions,
      correctIndex,
      explanation: `คำตอบที่ถูกต้องคือ "${card.word}" (${card.thaiMeaning}) จ้า เก่งมากเลย! 🎉`,
      relatedCardId: card.id,
      hint,
    };
  });
}
