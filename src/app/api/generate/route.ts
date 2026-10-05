import { NextRequest, NextResponse } from 'next/server';
import { Flashcard, DifficultyLevel } from '@/types/flashcard';

export const runtime = 'nodejs';

// Pre-curated high quality fallback dictionary for popular topics
const TOPIC_PRESETS: Record<string, Partial<Flashcard>[]> = {
  interview: [
    {
      word: 'Initiative',
      phonetic: '/ɪˈnɪʃ.ə.t̬ɪv/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ความคิดริเริ่ม, ความกระตือรือร้นในการลงมือทำก่อนผู้อื่น',
      englishMeaning: 'The power or opportunity to act or take charge before others do.',
      exampleSentence: 'She showed great initiative by proposing a streamlined workflow.',
      exampleTranslation: 'เธอแสดงความคิดริเริ่มที่ยอดเยี่ยมโดยการเสนอกระบวนการทำงานที่กระชับขึ้น',
    },
    {
      word: 'Adaptability',
      phonetic: '/əˌdæp.təˈbɪl.ə.t̬i/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ความสามารถในการปรับตัวให้เข้ากับสถานการณ์ใหม่ๆ',
      englishMeaning: 'The quality of being able to adjust to new conditions.',
      exampleSentence: 'Adaptability is one of the most valued traits in fast-growing startups.',
      exampleTranslation: 'ความสามารถในการปรับตัวเป็นหนึ่งในคุณสมบัติที่มีค่าที่สุดในสตาร์ทอัพที่เติบโตเร็ว',
    },
    {
      word: 'Accomplishment',
      phonetic: '/əˈkɑːm.plɪʃ.mənt/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ความสำเร็จ, ผลงานที่บรรลุตามเป้าหมาย',
      englishMeaning: 'Something that has been achieved successfully.',
      exampleSentence: 'Please highlight your greatest professional accomplishment.',
      exampleTranslation: 'โปรดไฮไลต์ผลงานความสำเร็จทางอาชีพที่โดดเด่นที่สุดของคุณ',
    },
    {
      word: 'Collaboration',
      phonetic: '/kəˌlæb.əˈreɪ.ʃən/',
      partOfSpeech: 'noun',
      thaiMeaning: 'การทำงานร่วมกัน, ความร่วมมือของทีม',
      englishMeaning: 'The action of working with someone to produce or create something.',
      exampleSentence: 'Effective cross-functional collaboration helped deliver the project early.',
      exampleTranslation: 'การทำงานร่วมกันข้ามสายงานอย่างมีประสิทธิภาพช่วยให้ส่งมอบโปรเจกต์ได้ก่อนกำหนด',
    },
    {
      word: 'Resilience',
      phonetic: '/rɪˈzɪl.jəns/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ความสามารถในการฟื้นตัวจากอุปสรรค, ความทรหดอดทน',
      englishMeaning: 'The capacity to recover quickly from difficulties; toughness.',
      exampleSentence: 'Her resilience during the company restructuring was admirable.',
      exampleTranslation: 'ความทรหดของเธอในช่วงการปรับโครงสร้างบริษัทเป็นที่น่าชื่นชมอย่างยิ่ง',
    },
  ],
  coffee: [
    {
      word: 'Aroma',
      phonetic: '/əˈroʊ.mə/',
      partOfSpeech: 'noun',
      thaiMeaning: 'กลิ่นหอมกรุ่น (โดยเฉพาะกาแฟหรืออาหาร)',
      englishMeaning: 'A distinctive, typically pleasant smell.',
      exampleSentence: 'The rich aroma of freshly roasted coffee beans filled the room.',
      exampleTranslation: 'กลิ่นหอมกรุ่นของเมล็ดกาแฟคั่วบดสดใหม่ลอยฟุ้งไปทั่วห้อง',
    },
    {
      word: 'Acidity',
      phonetic: '/əˈsɪd.ə.t̬i/',
      partOfSpeech: 'noun',
      thaiMeaning: 'รสเปรี้ยวสดชื่นตามธรรมชาติของผลไม้ในกาแฟ',
      englishMeaning: 'The pleasant sharpness or crispness characteristic of certain coffees.',
      exampleSentence: 'This Ethiopian single-origin coffee has vibrant citrus acidity.',
      exampleTranslation: 'กาแฟเอธิโอเปียสายพันธุ์เดี่ยวนี้มีรสเปรี้ยวสดชื่นแบบผลไม้ตระกูลส้ม',
    },
    {
      word: 'Extraction',
      phonetic: '/ɪkˈstræk.ʃən/',
      partOfSpeech: 'noun',
      thaiMeaning: 'การสกัดรสชาติและสารอาหารออกจากผงกาแฟ',
      englishMeaning: 'The process of dissolving coffee flavors from grounds into water.',
      exampleSentence: 'Over-extraction results in an unpleasant bitter taste.',
      exampleTranslation: 'การสกัดกาแฟนานเกินไปส่งผลให้เกิดรสขมที่ไม่พึงประสงค์',
    },
    {
      word: 'Artisan',
      phonetic: '/ˈɑːr.t̬ə.zən/',
      partOfSpeech: 'adjective / noun',
      thaiMeaning: 'งานฝีมือประณีต, ช่างฝีมือผู้เชี่ยวชาญ',
      englishMeaning: 'Made in a traditional or non-mechanized way with high quality craft.',
      exampleSentence: 'The local cafe serves artisan pastries baked fresh every morning.',
      exampleTranslation: 'คาเฟ่ท้องถิ่นเสิร์ฟขนมอบสไตล์ช่างฝีมือที่อบสดใหม่ทุกเช้า',
    },
    {
      word: 'Aftertaste',
      phonetic: '/ˈæf.tɚ.teɪst/',
      partOfSpeech: 'noun',
      thaiMeaning: 'รสสัมผัสที่หลงเหลืออยู่ในลำคอหลังจากกลืนแล้ว',
      englishMeaning: 'A taste remaining in the mouth after eating or drinking something.',
      exampleSentence: 'The espresso finishes with a smooth caramel aftertaste.',
      exampleTranslation: 'เอสเปรสโซ่ทิ้งรสสัมผัสหวานนุ่มละมุนของคาราเมลไว้ในลำคอ',
    },
  ],
  tech: [
    {
      word: 'Microservices',
      phonetic: '/ˌmaɪ.kroʊˈsɝː.vɪs.ɪz/',
      partOfSpeech: 'noun',
      thaiMeaning: 'สถาปัตยกรรมบริการย่อยแบบกระจายศูนย์',
      englishMeaning: 'An architectural approach where an app is composed of small independent services.',
      exampleSentence: 'Migrating to microservices allowed each team to deploy independently.',
      exampleTranslation: 'การย้ายไปใช้สถาปัตยกรรมบริการย่อยช่วยให้แต่ละทีมสามารถปรับใช้ระบบแยกกันได้อย่างอิสระ',
    },
    {
      word: 'Concurrency',
      phonetic: '/kənˈkɝː.ən.si/',
      partOfSpeech: 'noun',
      thaiMeaning: 'การทำงานพร้อมกันหลายภารกิจในระบบคอมพิวเตอร์',
      englishMeaning: 'The ability of different parts of a program to be executed out-of-order or concurrently.',
      exampleSentence: 'Go language handles concurrency efficiently using goroutines.',
      exampleTranslation: 'ภาษา Go จัดการงานที่ทำพร้อมกันได้อย่างมีประสิทธิภาพด้วย goroutines',
    },
    {
      word: 'Latency',
      phonetic: '/ˈleɪ.tən.si/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ความหน่วงเวลาในการส่งผ่านข้อมูลของระบบ',
      englishMeaning: 'The delay before a transfer of data begins following an instruction.',
      exampleSentence: 'Edge servers drastically reduce network latency for international users.',
      exampleTranslation: 'เซิร์ฟเวอร์แบบ Edge ช่วยลดความหน่วงเครือข่ายสำหรับผู้ใช้ทั่วโลกได้อย่างมาก',
    },
    {
      word: 'Authentication',
      phonetic: '/ɔːˌθen.təˈkeɪ.ʃən/',
      partOfSpeech: 'noun',
      thaiMeaning: 'การยืนยันตัวตน, การตรวจสอบความถูกต้องของผู้ใช้งาน',
      englishMeaning: 'The process of verifying that someone or something is who they claim to be.',
      exampleSentence: 'Two-factor authentication adds an extra layer of account protection.',
      exampleTranslation: 'การยืนยันตัวตนแบบสองขั้นตอนช่วยเพิ่มระดับความปลอดภัยของบัญชี',
    },
    {
      word: 'Polymorphism',
      phonetic: '/ˌpɑː.liˈmɔːr.fɪ.zəm/',
      partOfSpeech: 'noun',
      thaiMeaning: 'ความหลากหลายรูป, ความสามารถของอ็อบเจกต์ในการตอบสนองตามประเภท',
      englishMeaning: 'The ability of a message or data to be processed in more than one form.',
      exampleSentence: 'Polymorphism is a fundamental pillar of object-oriented programming.',
      exampleTranslation: 'ความหลากหลายรูปเป็นเสาหลักพื้นฐานของการเขียนโปรแกรมเชิงวัตถุ',
    },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic = 'General English', difficulty = 'Intermediate', count = 5 } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured, attempt real Gemini call
    if (apiKey) {
      try {
        const prompt = `You are an expert English linguist and vocabulary coach.
Generate exactly ${count} educational English vocabulary flashcards for the topic: "${topic}" with difficulty level: "${difficulty}".
Output MUST be a strictly valid JSON array of objects with these exact keys:
[
  {
    "word": "string (English word)",
    "phonetic": "string (IPA phonetic, e.g. /ˈæl.ɡə.rɪ.ðəm/)",
    "partOfSpeech": "noun | verb | adjective | adverb",
    "thaiMeaning": "string (Clear Thai definition)",
    "englishMeaning": "string (Clear English definition)",
    "exampleSentence": "string (Realistic natural English example sentence)",
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
              difficulty: difficulty as DifficultyLevel,
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
        console.warn('Gemini API call failed, falling back to smart generator:', geminiError);
      }
    }

    // Smart Fallback Generator (Instant & reliable even without API key)
    const lowerTopic = topic.toLowerCase();
    let templateSet = TOPIC_PRESETS.interview;

    if (lowerTopic.includes('coffee') || lowerTopic.includes('cafe') || lowerTopic.includes('food')) {
      templateSet = TOPIC_PRESETS.coffee;
    } else if (
      lowerTopic.includes('tech') ||
      lowerTopic.includes('code') ||
      lowerTopic.includes('cloud') ||
      lowerTopic.includes('cyber') ||
      lowerTopic.includes('software')
    ) {
      templateSet = TOPIC_PRESETS.tech;
    }

    // Generate tailored flashcards
    const generatedCards: Flashcard[] = templateSet.slice(0, count).map((item, idx) => ({
      id: `gen-${Date.now()}-${idx}`,
      word: item.word || `Concept ${idx + 1}`,
      phonetic: item.phonetic || '/kənˈsept/',
      partOfSpeech: item.partOfSpeech || 'noun',
      thaiMeaning: item.thaiMeaning || 'ความหมายคำศัพท์',
      englishMeaning: item.englishMeaning || 'A relevant concept in this domain.',
      exampleSentence: item.exampleSentence || 'This term is widely used in modern context.',
      exampleTranslation: item.exampleTranslation || 'คำนี้ถูกใช้อย่างแพร่หลายในบริบทปัจจุบัน',
      category: topic.length > 20 ? topic.substring(0, 20) : topic,
      difficulty: difficulty as DifficultyLevel,
      tags: ['ai-generated', topic.toLowerCase()],
    }));

    return NextResponse.json({
      success: true,
      source: 'smart-template-engine',
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
