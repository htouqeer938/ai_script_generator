import {GenerateScriptParams} from '@/types/generate';

export function buildPrompt({topic, tone, length}: GenerateScriptParams) {
  const lengthMap: {[key: string]: string} = {
    '1 min': '150-200 words',
    '3 min': '400-600 words',
    '5 min': '800-1000 words',
    '10 min': '1300-1600 words',
  };

  const toneGuide: {[key: string]: string} = {
    Dramatic: 'Use emotionally intense and powerful language',
    Neutral: 'Use clear, balanced, and informative language',
    Uplifting: 'Use positive, inspiring, and motivational language',
  };

  return `
You are a professional Video script writer.

Write a script based on the following idea:

Topic: ${topic}

Tone: ${tone}
Tone Style: ${toneGuide[tone]}

Target Length: ${length} (${lengthMap[length]})

Instructions:
- Start with a strong hook
- Write an engaging middle section
- End with a memorable conclusion
- Match the requested tone throughout
- Keep the pacing appropriate for the target length
- Write in natural spoken language for voiceover
- Do not use bullet points

Output only the final script.
`;
}
