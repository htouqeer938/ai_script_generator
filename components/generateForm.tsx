'use client';
import {ChatMessage, GenerateScriptResponse} from '@/types/generate';
import {useState} from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const GenerateScriptForm = () => {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Dramatic');
  const [length, setLength] = useState('1 min');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTopic = topic.trim();

    if (!trimmedTopic) {
      setError('Topic is required');
      return;
    }

    setLoading(true);
    setError('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedTopic,
      tone,
      length,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    try {
      const result = await axios.post<GenerateScriptResponse>('/api/generate', {
        topic: trimmedTopic,
        tone,
        length,
        previousResponseId: chatId || null,
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: result.data.responseId,
          role: 'assistant',
          content: result.data.script,
          tone,
          length,
        },
      ]);
      setChatId(result.data.responseId);
      setTopic('');
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Something went wrong. Try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((message) => message.role === 'assistant');

    if (!lastAssistantMessage) {
      return;
    }

    try {
      await navigator.clipboard.writeText(lastAssistantMessage.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setChatId('');
    setTopic('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Script Chat</p>
          <p className="text-xs text-zinc-500">
            Chat ID: {chatId || 'Empty until first response'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!messages.some((message) => message.role === 'assistant')}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? 'Copied' : 'Copy last reply'}
          </button>
          <button
            type="button"
            onClick={handleNewChat}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            New chat
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-zinc-50 px-4 py-5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
            Start the conversation below
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                message.role === 'user'
                  ? 'ml-auto bg-zinc-900 text-white'
                  : 'mr-auto bg-white text-zinc-900 border border-zinc-200'
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] opacity-70">
                <span>{message.role === 'user' ? 'You' : 'Assistant'}</span>
                <span>
                  {message.tone} · {message.length}
                </span>
              </div>

              {message.role === 'assistant' ? (
                <div className="prose max-w-none text-sm leading-relaxed">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-zinc-200 bg-white p-4"
      >
        <div className="mb-3 flex flex-col gap-3 md:flex-row">
          <select
            value={tone}
            onChange={(event) => setTone(event.target.value)}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option>Dramatic</option>
            <option>Neutral</option>
            <option>Uplifting</option>
          </select>

          <select
            value={length}
            onChange={(event) => setLength(event.target.value)}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option>1 min</option>
            <option>3 min</option>
            <option>5 min</option>
            <option>10 min</option>
          </select>
        </div>

        <div className="flex items-end gap-3">
          <textarea
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Describe the script you want or refine the previous one..."
            rows={3}
            className="min-h-[88px] flex-1 resize-none rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default GenerateScriptForm;
