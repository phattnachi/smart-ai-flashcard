'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY_RATE = 'smart_kids_speech_rate';

interface UseSpeechSynthesisReturn {
  speak: (text: string, lang?: string, rate?: number) => void;
  speakSlow: (text: string, lang?: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRateState] = useState(0.8); // 0.8 is child-friendly default
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load saved speech rate preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedRate = localStorage.getItem(STORAGE_KEY_RATE);
        if (savedRate) {
          const parsed = parseFloat(savedRate);
          if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 1.5) {
            setSpeechRateState(parsed);
          }
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const setSpeechRate = useCallback((rate: number) => {
    setSpeechRateState(rate);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_RATE, rate.toString());
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Find preferred high quality English voice (en-US or en-GB)
        const preferred =
          availableVoices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Zira'))) ||
          availableVoices.find((v) => v.lang.startsWith('en-US')) ||
          availableVoices.find((v) => v.lang.startsWith('en')) ||
          availableVoices[0] ||
          null;

        setSelectedVoice(preferred);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string, lang = 'en-US', rate?: number) => {
      if (!isSupported || typeof window === 'undefined') return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      utterance.lang = lang;
      utterance.rate = rate !== undefined ? rate : speechRate;
      utterance.pitch = 1.05; // Slightly cheerful pitch for kids

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, selectedVoice, speechRate]
  );

  const speakSlow = useCallback(
    (text: string, lang = 'en-US') => {
      speak(text, lang, 0.6); // Turtle speed: 0.6x for very clear, slow pronunciation
    },
    [speak]
  );

  return {
    speak,
    speakSlow,
    stop,
    isSpeaking,
    isSupported,
    speechRate,
    setSpeechRate,
    voices,
    selectedVoice,
    setSelectedVoice,
  };
}
