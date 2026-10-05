import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const playpenSansThai = localFont({
  src: './fonts/PlaypenSansThai-VariableFont_wght.ttf',
  variable: '--font-playpen',
  display: 'swap',
  weight: '100 800',
});

export const metadata: Metadata = {
  title: 'SmartAI Flashcard & Quiz | ระบบฝึกคำศัพท์และควิซโต้ตอบอัจฉริยะสำหรับนักเรียน นักศึกษา 🎓',
  description:
    'แพลตฟอร์ม Flashcard อัจฉริยะสำหรับนักเรียน นักศึกษา และผู้เรียนทั่วไป ด้วยระบบอ่านออกเสียงเจ้าของภาษา ทดสอบสำเนียงด้วย AI และระบบควิซประเมินผล 3 ดาว',
  keywords: [
    'Smart Flashcards',
    'English Vocabulary',
    'Daily Conversation',
    'คำศัพท์ภาษาอังกฤษ',
    'แฟลชการ์ดคำศัพท์',
    'ฝึกออกเสียงภาษาอังกฤษ AI',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`light ${playpenSansThai.variable}`}>
      <body className={`${playpenSansThai.className} min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white flex flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}
