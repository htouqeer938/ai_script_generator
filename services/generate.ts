import {GenerateScriptRequest, GenerateScriptResponse} from '@/types/generate';
import {buildPrompt} from '@/utils/generate';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateScript = async ({
  topic,
  tone,
  length,
  previousResponseId,
}: GenerateScriptRequest): Promise<GenerateScriptResponse> => {
  const prompt = buildPrompt({topic, tone, length});

  const response = await openai.responses.create({
    model: 'gpt-4o-mini', // fast + cheap
    instructions:
      'You are a professional video script writer. Keep the conversation coherent across turns and refine prior ideas when the user follows up.',
    input: prompt,
    previous_response_id: previousResponseId || undefined,
  });

  const script = response.output_text || 'No script generated.';

  return {
    responseId: response.id,
    script,
  };
};
