export interface GenerateScriptParams {
  topic: string;
  tone: string;
  length: string;
}

export interface GenerateScriptRequest extends GenerateScriptParams {
  previousResponseId?: string | null;
}

export interface GenerateScriptResponse {
  responseId: string;
  script: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tone?: string;
  length?: string;
}

export type FormData = {
  topic: string;
  tone: string;
  length: string;
};
