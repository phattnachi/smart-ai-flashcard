import { PronunciationResult } from '../types/flashcard';

/**
 * Calculates Levenshtein Distance between two strings.
 */
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Clean and normalize text for pronunciation comparison.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Evaluates how close the spoken transcript matches the target word or phrase.
 */
export function evaluatePronunciation(spoken: string, target: string): PronunciationResult {
  const cleanSpoken = normalizeText(spoken);
  const cleanTarget = normalizeText(target);

  if (!cleanSpoken) {
    return {
      transcript: '',
      targetWord: target,
      score: 0,
      accuracy: 'needs-practice',
      feedback: 'ยังตรวจไม่พบเสียงพูด ลองกดไมโครโฟนแล้วออกเสียงใหม่อีกครั้ง',
    };
  }

  // Exact match
  if (cleanSpoken === cleanTarget) {
    return {
      transcript: spoken,
      targetWord: target,
      score: 100,
      accuracy: 'perfect',
      feedback: '🎯 สมบูรณ์แบบ! ออกเสียงได้ถูกต้องและชัดเจนมาก (Native Level)',
    };
  }

  const spokenWords = cleanSpoken.split(' ').filter(Boolean);
  const targetWords = cleanTarget.split(' ').filter(Boolean);

  // Calculate full string similarity
  const maxOverallLen = Math.max(cleanSpoken.length, cleanTarget.length);
  const overallDist = levenshteinDistance(cleanSpoken, cleanTarget);
  const overallScore = Math.max(0, Math.round(((maxOverallLen - overallDist) / maxOverallLen) * 100));

  let finalScore = overallScore;

  if (targetWords.length === 1) {
    // For single word targets: find the best matching token in the utterance
    let bestWordMatch = 0;
    for (const sw of spokenWords) {
      const maxLen = Math.max(sw.length, cleanTarget.length);
      if (maxLen === 0) continue;
      const dist = levenshteinDistance(sw, cleanTarget);
      const sim = Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));
      if (sim > bestWordMatch) {
        bestWordMatch = sim;
      }
    }
    // Only accept word match if it is genuinely close
    finalScore = Math.max(overallScore, bestWordMatch);
  } else {
    // For multi-word targets: user must pronounce all key words in the phrase!
    let matchedTargetWords = 0;
    for (const tw of targetWords) {
      let wordFound = false;
      for (const sw of spokenWords) {
        const maxLen = Math.max(sw.length, tw.length);
        if (maxLen === 0) continue;
        const dist = levenshteinDistance(sw, tw);
        const sim = (maxLen - dist) / maxLen;
        if (sim >= 0.75) {
          wordFound = true;
          break;
        }
      }
      if (wordFound) matchedTargetWords++;
    }

    const coverageRatio = matchedTargetWords / targetWords.length;
    finalScore = Math.round(overallScore * 0.4 + coverageRatio * 100 * 0.6);

    // If not all words were spoken, cap at 65% so it will NOT falsely auto-approve!
    if (matchedTargetWords < targetWords.length) {
      finalScore = Math.min(finalScore, 65);
    }
  }

  let accuracy: 'perfect' | 'great' | 'needs-practice' = 'needs-practice';
  let feedback = '';

  if (finalScore >= 85) {
    accuracy = 'perfect';
    feedback = '🌟 ยอดเยี่ยมมาก! ออกเสียงได้ชัดเจน ถูกต้องตามหลักโฟเนติกส์';
  } else if (finalScore >= 65) {
    accuracy = 'great';
    feedback = '👍 ดีมาก! เข้าใจได้ชัดเจน แนะนำลองฟังเสียงต้นแบบแล้วเน้นจังหวะอีกนิด';
  } else {
    accuracy = 'needs-practice';
    feedback = '💡 ฝึกฝนอีกนิด! ลองกดปุ่มลำโพงฟังต้นแบบ แล้วออกเสียงตามทีละพยางค์';
  }

  return {
    transcript: spoken,
    targetWord: target,
    score: finalScore,
    accuracy,
    feedback,
  };
}
