import { NextRequest, NextResponse } from 'next/server';
import { Flashcard, DifficultyLevel } from '@/types/flashcard';

export const runtime = 'nodejs';

// Child-friendly fallback vocabulary for 5-6 year olds (Preschool / Kindergarten)
const TOPIC_PRESETS: Record<string, Partial<Flashcard>[]> = {
  animals: [
    {
      word: 'Cat',
      phonetic: '/kæt/',
      partOfSpeech: 'noun',
      thaiMeaning: 'แมวเหมียว',
      englishMeaning: 'A cute furry pet that says "Meow meow!" 🐱',
      exampleSentence: 'The cute cat says meow meow.',
      exampleTranslation: 'แมวน้อยน่ารักร้องเหมียวๆ',
    },
    {
      word: 'Dog',
      phonetic: '/dɔːɡ/',
      partOfSpeech: 'noun',
      thaiMeaning: 'สุนัข, น้องหมา',
      englishMeaning: 'A happy pet that barks "Woof woof!" 🐶',
      exampleSentence: 'The friendly dog barks woof woof.',
      exampleTranslation: 'น้องหมาใจดีเห่าโฮ่งๆ วิ่งเล่นไปมา',
    },
    {
      word: 'Bird',
      phonetic: '/bɝːd/',
      partOfSpeech: 'noun',
      thaiMeaning: 'นกน้อย',
      englishMeaning: 'A little animal that flies in the blue sky 🐦',
      exampleSentence: 'The little bird sings in the green tree.',
      exampleTranslation: 'นกน้อยร้องเพลงเพราะๆ อยู่บนต้นไม้',
    },
    {
      word: 'Fish',
      phonetic: '/fɪʃ/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ปลา',
      englishMeaning: 'A swimming friend that glides in clear water 🐟',
      exampleSentence: 'The little fish swims fast in the water.',
      exampleTranslation: 'ปลาน้อยว่ายน้ำเร็วและร่าเริง',
    },
    {
      word: 'Lion',
      phonetic: '/ˈlaɪ.ən/',
      partOfSpeech: 'noun',
      thaiMeaning: 'สิงโตเจ้าป่า',
      englishMeaning: 'A brave big cat that roars "Roar!" 🦁',
      exampleSentence: 'The brave lion roars loudly in the forest.',
      exampleTranslation: 'สิงโตผู้กล้าหาญคำรามเสียงดังก้องป่า',
    },
    {
      word: 'Duck',
      phonetic: '/dʌk/',
      partOfSpeech: 'noun',
      thaiMeaning: 'เป็ดก้าบก้าบ',
      englishMeaning: 'A cute bird that swims and says "Quack quack!" 🦆',
      exampleSentence: 'The yellow duck swims across the pond.',
      exampleTranslation: 'เป็ดสีเหลืองว่ายน้ำข้ามสระอย่างสบายใจ',
    },
  ],
  school: [
    {
      word: 'Book',
      phonetic: '/bʊk/',
      partOfSpeech: 'noun',
      thaiMeaning: 'หนังสือ',
      englishMeaning: 'Pages full of pictures and fun stories 📖',
      exampleSentence: 'I open my fun picture book to read.',
      exampleTranslation: 'หนูเปิดหนังสือนิทานภาพแสนสนุกเพื่ออ่าน',
    },
    {
      word: 'Pen',
      phonetic: '/pen/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ปากกา',
      englishMeaning: 'A tool used to draw with bright ink 🖊️',
      exampleSentence: 'I draw a pretty star with my blue pen.',
      exampleTranslation: 'หนูวาดรูปดาวแสนสวยด้วยปากกาสีฟ้า',
    },
    {
      word: 'Bag',
      phonetic: '/bæɡ/',
      partOfSpeech: 'noun',
      thaiMeaning: 'กระเป๋า',
      englishMeaning: 'A bag to carry books and pencils to school 🎒',
      exampleSentence: 'My colorful school bag is ready.',
      exampleTranslation: 'กระเป๋านักเรียนสีสดใสของหนูพร้อมแล้ว',
    },
    {
      word: 'Pencil',
      phonetic: '/ˈpen.səl/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ดินสอ',
      englishMeaning: 'A pencil used for writing and drawing cute shapes ✏️',
      exampleSentence: 'I write my name with a sharp pencil.',
      exampleTranslation: 'หนูเขียนชื่อของหนูด้วยดินสอแท่งโปรด',
    },
    {
      word: 'Chair',
      phonetic: '/tʃer/',
      partOfSpeech: 'noun',
      thaiMeaning: 'เก้าอี้',
      englishMeaning: 'A comfy seat to sit down and learn happily 🪑',
      exampleSentence: 'I sit nicely on the wooden chair.',
      exampleTranslation: 'หนูนั่งเรียบร้อยบนเก้าอี้ไม้',
    },
    {
      word: 'Desk',
      phonetic: '/desk/',
      partOfSpeech: 'noun',
      thaiMeaning: 'โต๊ะเรียน',
      englishMeaning: 'A table where we put our books and color pictures 🪑',
      exampleSentence: 'My picture books are on the desk.',
      exampleTranslation: 'หนังสือนิทานของหนูวางอยู่บนโต๊ะเรียน',
    },
  ],
  fruits_colors: [
    {
      word: 'Apple',
      phonetic: '/ˈæp.əl/',
      partOfSpeech: 'noun',
      thaiMeaning: 'แอปเปิล',
      englishMeaning: 'A sweet, crunchy red fruit that is yummy 🍎',
      exampleSentence: 'I eat a sweet red apple every day.',
      exampleTranslation: 'หนูกินแอปเปิลสีแดงแสนอร่อยทุกวัน',
    },
    {
      word: 'Banana',
      phonetic: '/bəˈnæn.ə/',
      partOfSpeech: 'noun',
      thaiMeaning: 'กล้วย',
      englishMeaning: 'A sweet yellow fruit that friendly monkeys love 🍌',
      exampleSentence: 'Monkeys love sweet yellow bananas.',
      exampleTranslation: 'พวกเจ้าลิงชอบกินกล้วยสีเหลืองแสนหวาน',
    },
    {
      word: 'Red',
      phonetic: '/red/',
      partOfSpeech: 'adjective',
      thaiMeaning: 'สีแดง',
      englishMeaning: 'The bright warm color of juicy apples 🔴',
      exampleSentence: 'The shiny ripe apple is bright red.',
      exampleTranslation: 'ผลแอปเปิลสุกมีสีแดงสดใสน่ากิน',
    },
    {
      word: 'Blue',
      phonetic: '/bluː/',
      partOfSpeech: 'adjective',
      thaiMeaning: 'สีฟ้า, สีน้ำเงิน',
      englishMeaning: 'The pretty cool color of the sky and ocean 🔵',
      exampleSentence: 'The wide morning sky is clear blue.',
      exampleTranslation: 'ท้องฟ้ากว้างใหญ่ยามเช้าเป็นสีฟ้าสดใส',
    },
    {
      word: 'Yellow',
      phonetic: '/ˈjel.oʊ/',
      partOfSpeech: 'adjective',
      thaiMeaning: 'สีเหลือง',
      englishMeaning: 'The warm shining color of the bright sun 🟡',
      exampleSentence: 'The warm sunshine is bright yellow.',
      exampleTranslation: 'แสงแดดอันอบอุ่นส่องแสงสีเหลืองนวล',
    },
    {
      word: 'Orange',
      phonetic: '/ˈɔːr.ɪndʒ/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ส้ม',
      englishMeaning: 'A round, sweet and juicy fruit packed with vitamins 🍊',
      exampleSentence: 'Sweet orange juice is fresh and tasty.',
      exampleTranslation: 'น้ำส้มแสนหวานอร่อยสดชื่นชื่นใจ',
    },
  ],
  nature: [
    {
      word: 'Sun',
      phonetic: '/sʌn/',
      partOfSpeech: 'noun',
      thaiMeaning: 'พระอาทิตย์',
      englishMeaning: 'The big warm star that brings light to our day ☀️',
      exampleSentence: 'The morning sun brings warm light.',
      exampleTranslation: 'พระอาทิตย์ยามเช้าส่องแสงอบอุ่นทั่วฟ้า',
    },
    {
      word: 'Star',
      phonetic: '/stɑːr/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ดวงดาว',
      englishMeaning: 'A bright little light twinkling high in the night sky ⭐',
      exampleSentence: 'Look at the twinkling star in the dark sky.',
      exampleTranslation: 'มองดูดวงดาวกะพริบระยิบระยับบนฟ้าสิ',
    },
    {
      word: 'Moon',
      phonetic: '/muːn/',
      partOfSpeech: 'noun',
      thaiMeaning: 'พระจันทร์',
      englishMeaning: 'The glowing moon that smiles down at night 🌙',
      exampleSentence: 'The round moon shines softly at night.',
      exampleTranslation: 'พระจันทร์กลมโตส่องแสงนวลตาในยามค่ำคืน',
    },
    {
      word: 'Tree',
      phonetic: '/triː/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ต้นไม้',
      englishMeaning: 'A tall green plant with cool shade and green leaves 🌳',
      exampleSentence: 'The tall green tree gives cool shade.',
      exampleTranslation: 'ต้นไม้ต้นใหญ่ให้ร่มเงาที่เย็นสบาย',
    },
    {
      word: 'Rain',
      phonetic: '/reɪn/',
      partOfSpeech: 'noun',
      thaiMeaning: 'สายฝน, ฝนตก',
      englishMeaning: 'Cool water drops falling gently from clouds 🌧️',
      exampleSentence: 'Cool rain helps flowers and trees grow.',
      exampleTranslation: 'สายฝนเย็นฉ่ำช่วยให้ดอกไม้และต้นไม้เติบโต',
    },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic = 'Animals', difficulty = 'Beginner', count = 5 } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured, attempt real Gemini call tailored for early-childhood
    if (apiKey) {
      try {
        const prompt = `You are a warm, friendly early-childhood English teacher.
Generate exactly ${count} educational English vocabulary flashcards for preschool/kindergarten children (aged 5-6) for the topic: "${topic}".
CRITICAL RULES FOR 5-6 YEAR OLDS:
1. Words MUST be very simple, basic, 1-2 syllables suitable for young children aged 5-6 (e.g. Cat, Dog, Bird, Fish, Lion, Duck, Book, Pen, Bag, Pencil, Chair, Apple, Banana, Red, Blue, Yellow, Sun, Star, Milk, etc.).
2. NEVER use complex, adult, abstract, or exam-level vocabulary (e.g. "Initiative", "Accomplishment", "Adaptability", "Collaboration", "Microservices").
3. Thai meaning must be short, sweet, and easy for 5-6 year olds to understand.
4. Example sentence must be short, positive, and easy to pronounce for a child.
Output MUST be a strictly valid JSON array of objects with these exact keys:
[
  {
    "word": "string (Simple 1-2 syllable English word)",
    "phonetic": "string (IPA phonetic, e.g. /kæt/)",
    "partOfSpeech": "noun | verb | adjective",
    "thaiMeaning": "string (Clear friendly Thai definition)",
    "englishMeaning": "string (Child-friendly definition with cute emoji)",
    "exampleSentence": "string (Short simple English sentence)",
    "exampleTranslation": "string (Thai translation of example sentence)"
  }
]
Do not wrap in markdown tags like \`\`\`json. Output raw JSON only.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            const formattedCards: Flashcard[] = parsed.map((item: any, i: number) => ({
              id: `ai-${Date.now()}-${i}`,
              word: item.word,
              phonetic: item.phonetic || `/${item.word.toLowerCase()}/`,
              partOfSpeech: item.partOfSpeech || 'noun',
              thaiMeaning: item.thaiMeaning,
              englishMeaning: item.englishMeaning,
              exampleSentence: item.exampleSentence,
              exampleTranslation: item.exampleTranslation,
              category: topic.length > 20 ? topic.substring(0, 20) : topic,
              difficulty: (difficulty as DifficultyLevel) || 'Beginner',
              tags: ['ai-generated', topic.toLowerCase()],
            }));

            return NextResponse.json({
              success: true,
              source: 'gemini-ai',
              cards: formattedCards,
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to smart child preset generator:', geminiError);
      }
    }

    // Smart Fallback Generator (Preschool 5-6 year old friendly)
    const lowerTopic = topic.toLowerCase();
    let templateSet = TOPIC_PRESETS.animals;

    if (
      lowerTopic.includes('school') ||
      lowerTopic.includes('โรงเรียน') ||
      lowerTopic.includes('ของใช้') ||
      lowerTopic.includes('object') ||
      lowerTopic.includes('stationery')
    ) {
      templateSet = TOPIC_PRESETS.school;
    } else if (
      lowerTopic.includes('fruit') ||
      lowerTopic.includes('color') ||
      lowerTopic.includes('food') ||
      lowerTopic.includes('สี') ||
      lowerTopic.includes('ผลไม้') ||
      lowerTopic.includes('อาหาร')
    ) {
      templateSet = TOPIC_PRESETS.fruits_colors;
    } else if (
      lowerTopic.includes('nature') ||
      lowerTopic.includes('ธรรมชาติ') ||
      lowerTopic.includes('sky') ||
      lowerTopic.includes('weather')
    ) {
      templateSet = TOPIC_PRESETS.nature;
    }

    // Generate tailored flashcards
    const generatedCards: Flashcard[] = templateSet.slice(0, count).map((item, idx) => ({
      id: `gen-${Date.now()}-${idx}`,
      word: item.word || `Word ${idx + 1}`,
      phonetic: item.phonetic || '/wɝːd/',
      partOfSpeech: item.partOfSpeech || 'noun',
      thaiMeaning: item.thaiMeaning || 'ความหมายคำศัพท์',
      englishMeaning: item.englishMeaning || 'A cute simple word for children.',
      exampleSentence: item.exampleSentence || 'This is a fun word to learn.',
      exampleTranslation: item.exampleTranslation || 'นี่คือคำศัพท์แสนสนุกที่น่าเรียนรู้',
      category: topic.length > 20 ? topic.substring(0, 20) : topic,
      difficulty: (difficulty as DifficultyLevel) || 'Beginner',
      tags: ['ai-generated', topic.toLowerCase()],
    }));

    return NextResponse.json({
      success: true,
      source: 'smart-child-template-engine',
      topic,
      cards: generatedCards,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
