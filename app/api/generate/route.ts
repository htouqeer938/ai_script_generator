import {generateScript} from '@/services/generate';
import {GenerateScriptRequest} from '@/types/generate';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {topic, tone, length, previousResponseId} =
      (await request.json()) as GenerateScriptRequest;

    if (!topic || !tone || !length) {
      return NextResponse.json({error: 'Missing fields'}, {status: 400});
    }

    const response = await generateScript({
      topic,
      tone,
      length,
      previousResponseId,
    });
    return NextResponse.json(response, {status: 200});
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
