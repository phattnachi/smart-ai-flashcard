# 🌟 Smart AI Flashcard & Quiz (Web-based Application)

> เว็บไซต์แฟลชการ์ดคำศัพท์ & ควิซโต้ตอบด้วย AI พร้อมระบบตรวจจับเสียงพูดและการออกเสียงด้วย **Web Speech API** พัฒนาด้วย Next.js (App Router), TypeScript และ Tailwind CSS

---

## ✨ จุดเด่นและฟีเจอร์สำคัญ (Key Features)

1. **3D Interactive Flashcards (แฟลชการ์ดโต้ตอบ 3 มิติ)**:
   - คลิกการ์ดเพื่อพลิก 3D Flip ดูคำแปลไทย-อังกฤษ และประโยคตัวอย่าง
   - **หน้าการ์ด**: คำศัพท์ (Word), สัญลักษณ์สัทอักษร (Phonetic IPA), ชนิดของคำ (Part of Speech), ปุ่มฟังเสียง และปุ่มฝึกออกเสียง
   - **หลังการ์ด**: คำแปลภาษาไทย, English Definition, ประโยคตัวอย่างการใช้งานจริง พร้อมคำแปลภาษาไทย
   - ระบบสลับการ์ด (Shuffle), เล่นอัตโนมัติ (Auto Slideshow) และทำเครื่องหมายคำศัพท์ที่จำได้แล้ว (Mastered)

2. **Web Speech API Direct Integration (ระบบเสียงบนเบราว์เซอร์ 100%)**:
   - **Text-to-Speech (TTS)**: ฟังเสียงอ่านสำเนียงเจ้าของภาษาผ่าน `window.speechSynthesis` (ปรับความเร็วให้เหมาะสมกับการฝึกภาษา)
   - **Speech Recognition (STT)**: กดไมโครโฟนเพื่อพูดคำศัพท์ผ่าน `window.SpeechRecognition` / `window.webkitSpeechRecognition`
   - **Instant Visual Feedback & Pronunciation Meter**: ตรวจเทียบความแม่นยำของการออกเสียงด้วยอัลกอริทึม Normalized Levenshtein Distance แสดงคะแนน 0-100% พร้อมข้อความแนะนำและระดับความแม่นยำ (Perfect / Great / Practice)

3. **Interactive 4-Choice Quiz (ควิซทดสอบความจำ)**:
   - สร้างคำถาม 4 ตัวเลือกอัตโนมัติจากชุดคำศัพท์ในหมวดหมู่ที่เลือก (ทายความหมายภาษาไทย, ทายคำศัพท์จากนิยามภาษาอังกฤษ, เติมคำในช่องว่าง)
   - **Instant Feedback**: ตรวจคำตอบทันทีที่คลิกเลือก (ไฮไลต์สีเขียวเมื่อถูกต้อง / สีแดงเมื่อตอบผิด) พร้อมกล่องคำอธิบายและเฉลยอย่างละเอียด
   - ระบบนับคะแนน Streak ต่อเนื่อง และหน้าสรุปผลพร้อม Celebration Confetti Effect

4. **AI Generation Architecture & API Route**:
   - เชื่อมต่อ API Route `/api/generate` รองรับการระบุหัวข้อ (Topic), ระดับความยาก และจำนวนคำ
   - รองรับ Google Gemini API Key (`GEMINI_API_KEY`) ใน `.env.local`
   - มี **Smart Fallback Engine** ในตัว เพื่อให้สามารถรันและทดสอบสร้างการ์ดได้ทันที 100% แม้ยังไม่ได้ใส่ API Key

5. **Rich Mock Data & Category Filter**:
   - Mock Data คำศัพท์คุณภาพสูง 5 หมวดหมู่ (Business, AI & Technology, Daily Life, Travel, IELTS Academic)
   - ค้นหาคำศัพท์แบบ Real-time และระบบบันทึกความก้าวหน้าลงใน LocalStorage

---

## 🛠️ โครงสร้างไฟล์และสถาปัตยกรรม (Project Structure)

```
d:/SmartAIFlashcard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts            # Next.js Route Handler สำหรับ AI Flashcard Generator
│   │   ├── globals.css                 # สไตล์ Tailwind v4, 3D Flip Card และ Custom Animations
│   │   ├── layout.tsx                  # Root layout พร้อม metadata และการตั้งค่าธีมพรีเมียม
│   │   └── page.tsx                    # หน้า Dashboard หลัก เชื่อมโยงทุกระบบ
│   ├── components/
│   │   ├── Navbar.tsx                  # เมนูส่วนบน, สลับโหมด แฟลชการ์ด / ควิซ / สถิติ
│   │   ├── CategoryFilter.tsx          # แถบเลือกหมวดหมู่คำศัพท์และช่องค้นหา
│   │   ├── FlashcardDeck.tsx           # คอนเทนเนอร์ควบคุมการ์ด (ถัดไป, ก่อนหน้า, สุ่ม, ออโต้เพลย์)
│   │   ├── FlashcardItem.tsx           # การ์ด 3 มิติ พลิกหน้า/หลัง (3D Flip Card)
│   │   ├── PronunciationModal.tsx      # หน้าต่างบันทึกเสียงไมค์และแสดงผลตรวจการออกเสียง
│   │   ├── QuizContainer.tsx           # ระบบควิซ 4 ตัวเลือก ตรวจคำตอบทันทีพร้อมเฉลย
│   │   ├── AIGeneratorModal.tsx        # หน้าต่างสร้างชุดคำศัพท์ใหม่จากหัวข้อด้วย AI
│   │   └── StatsOverview.tsx           # สรุปสถิติการเรียนรู้และความเชี่ยวชาญ
│   ├── hooks/
│   │   ├── useSpeechSynthesis.ts       # Custom Hook สำหรับเสียงสังเคราะห์ Text-to-Speech
│   │   └── useSpeechRecognition.ts     # Custom Hook สำหรับไมโครโฟน Speech-to-Text
│   ├── utils/
│   │   └── speechSimilarity.ts         # อัลกอริทึมคำนวณคะแนนความแม่นยำของการออกเสียง
│   ├── types/
│   │   ├── flashcard.ts                # TypeScript Interfaces สำหรับ Flashcard & Deck
│   │   └── quiz.ts                     # TypeScript Interfaces สำหรับ Quiz Questions
│   └── data/
│       └── mockCards.ts                # Mock Data คำศัพท์ 5 หมวดหมู่ + ฟังก์ชันสุ่มควิซ
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 วิธีการรันโปรเจกต์ (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รัน Development Server
```bash
npm run dev
```

### 3. เปิดทดสอบบนเบราว์เซอร์
เปิดเบราว์เซอร์ไปที่:
```
http://localhost:3000
```
*(แนะนำเปิดบน **Google Chrome** หรือ **Microsoft Edge** เพื่อประสบการณ์ใช้งาน Web Speech Recognition ที่สมบูรณ์แบบที่สุด)*

---

## 🔑 การตั้งค่า AI API Key (Optional)
หากต้องการใช้โมเดล Google Gemini จริงในการสร้างคำศัพท์ ให้สร้างไฟล์ `.env.local` ที่โฟลเดอร์หลักของโปรเจกต์:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(หากไม่ใส่คีย์ ระบบจะใช้ Smart Fallback Engine ที่เตรียมคำศัพท์คุณภาพสูงไว้ให้โดยอัตโนมัติ)*
