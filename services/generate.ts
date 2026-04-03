import {GenerateScriptParams} from '@/types/generate';
import {buildPrompt} from '@/utils/generate';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateScript = async ({
  topic,
  tone,
  length,
}: GenerateScriptParams) => {
  const prompt = buildPrompt({topic, tone, length});

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // fast + cheap
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const script =
    completion.choices[0]?.message?.content || 'No script generated.';

  return {script};
};
