'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PronunciationResult } from '../types/flashcard';
import { evaluatePronunciation } from '../utils/speechSimilarity';

interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  result: PronunciationResult | null;
  audioLevel: number; // 0 - 100 live microphone volume meter
  hasMicPermission: boolean | null;
  startListening: (targetWord?: string) => Promise<void>;
  stopListening: () => void;
  resetResult: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const targetWordRef = useRef<string>('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check browser support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
    }
  }, []);

  // Cleanup audio tracks and recognition on unmount
  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      recognitionRef.current = null;
    }
    cleanupAudio();
    setIsListening(false);
  }, [cleanupAudio]);

  const startListening = useCallback(
    async (targetWord = '') => {
      targetWordRef.current = targetWord;
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      setResult(null);

      if (typeof window === 'undefined') return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError('เบราว์เซอร์นี้ยังไม่รองรับ Speech Recognition โปรดใช้งานบน Google Chrome หรือ Microsoft Edge');
        return;
      }

      // Stop any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
      cleanupAudio();

      // 1. Explicitly request microphone stream to ensure permissions and active audio input
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          setHasMicPermission(true);

          // Setup AudioContext Analyser for live volume meter
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const audioCtx = new AudioCtx();
              audioContextRef.current = audioCtx;
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 256;
              const source = audioCtx.createMediaStreamSource(stream);
              source.connect(analyser);

              const dataArray = new Uint8Array(analyser.frequencyBinCount);

              const updateMeter = () => {
                if (!analyser) return;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                  sum += dataArray[i];
                }
                const avg = sum / dataArray.length;
                const normalized = Math.min(100, Math.round((avg / 128) * 100));
                setAudioLevel(normalized);

                animationFrameRef.current = requestAnimationFrame(updateMeter);
              };
              updateMeter();
            }
          } catch (audioErr) {
            console.warn('Audio analyser setup failed (non-critical):', audioErr);
          }
        }
      } catch (permissionErr: any) {
        console.warn('Microphone permission error:', permissionErr);
        setHasMicPermission(false);
        if (permissionErr.name === 'NotAllowedError' || permissionErr.name === 'PermissionDeniedError') {
          setError('เบราว์เซอร์ไม่ได้รับอนุญาตให้ใช้ไมโครโฟน โปรดคลิกไอคอนรูปกลอน/ไมค์ข้าง URL แล้วเลือก Allow Microphone');
          return;
        } else if (permissionErr.name === 'NotFoundError' || permissionErr.name === 'DevicesNotFoundError') {
          setError('ไม่พบอุปกรณ์ไมโครโฟนที่เชื่อมต่อกับคอมพิวเตอร์ โปรดเสียบไมโครโฟนหรือเปิดใช้งานไมค์');
          return;
        }
      }

      // 2. Initialize fresh SpeechRecognition instance
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 3;

        let accumulatedTranscript = '';

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const item = event.results[i];
            if (item.isFinal) {
              currentFinal += item[0].transcript + ' ';
            } else {
              currentInterim += item[0].transcript;
            }
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim);
          }

          if (currentFinal) {
            accumulatedTranscript += currentFinal;
            const cleanFinal = accumulatedTranscript.trim();
            setTranscript(cleanFinal);
            setInterimTranscript('');

            if (targetWordRef.current) {
              const evalResult = evaluatePronunciation(cleanFinal, targetWordRef.current);
              setResult(evalResult);

              // If spoken correctly (score >= 80), automatically close microphone and let user reopen manually
              if (evalResult.score >= 80) {
                try {
                  recognition.stop();
                } catch {
                  try {
                    recognition.abort();
                  } catch {
                    // ignore
                  }
                }
                recognitionRef.current = null;
                cleanupAudio();
                setIsListening(false);
              }
            }
          } else if (currentInterim && targetWordRef.current) {
            // Also evaluate on interim if it matches closely so user sees feedback right away
            const cleanInterim = currentInterim.trim();
            if (cleanInterim.length >= 3) {
              const evalResult = evaluatePronunciation(cleanInterim, targetWordRef.current);
              if (evalResult.score >= 85) {
                setTranscript(cleanInterim);
                setInterimTranscript('');
                setResult(evalResult);

                // Auto-stop on high confidence match
                try {
                  recognition.stop();
                } catch {
                  try {
                    recognition.abort();
                  } catch {
                    // ignore
                  }
                }
                recognitionRef.current = null;
                cleanupAudio();
                setIsListening(false);
              } else {
                setResult(evalResult);
              }
            }
          }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event.error);
          if (event.error === 'no-speech') {
            setError('ยังตรวจไม่พบเสียงพูด ลองพูดให้ใกล้ไมโครโฟนมากขึ้น หรือพูดเสียงดังฟังชัดอีกนิดครับ');
          } else if (event.error === 'not-allowed') {
            setError('ไมโครโฟนถูกบล็อก โปรดอนุญาตสิทธิ์ไมโครโฟนในเบราว์เซอร์');
            setHasMicPermission(false);
          } else if (event.error === 'network') {
            setError('เกิดปัญหาการเชื่อมต่อ Speech Service ของเบราว์เซอร์ (โปรดตรวจสอบอินเทอร์เน็ต)');
          } else if (event.error !== 'aborted') {
            setError(`ข้อผิดพลาดของระบบเสียง: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          cleanupAudio();
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error('Failed to start speech recognition:', err);
        setError(`ไม่สามารถเริ่มระบบตรวจจับเสียงได้: ${err.message || err}`);
        setIsListening(false);
        cleanupAudio();
      }
    },
    [cleanupAudio]
  );

  const resetResult = useCallback(() => {
    setResult(null);
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setAudioLevel(0);
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [cleanupAudio]);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    result,
    audioLevel,
    hasMicPermission,
    startListening,
    stopListening,
    resetResult,
  };
}
