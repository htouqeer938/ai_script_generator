'use client';
import {FormData} from '@/types/generate';
import {generateFormSchema} from '@/validations/generateForm';
import {yupResolver} from '@hookform/resolvers/yup';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const GenerateScriptForm = () => {
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: yupResolver(generateFormSchema),
    defaultValues: {
      tone: 'Dramatic',
      length: '1 min',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setScript('');
    setError('');

    try {
      const result = await axios.post('/api/generate', data);
      setScript(result.data.script);
    } catch (err: any) {
      const message =
        err.response?.data?.error || 'Something went wrong. Try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleClear = () => {
    setScript('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="bg-white/70 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-lg p-6 space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <textarea
              placeholder="Enter your content idea... (e.g. The rise and fall of Cleopatra)"
              {...register('topic')}
              className="w-full p-4 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              rows={4}
            />
            {errors.topic && (
              <p className="text-red-500 text-sm mt-1">
                {errors.topic.message}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <select
              {...register('tone')}
              className="flex-1 p-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-pink-400"
            >
              <option>Dramatic</option>
              <option>Neutral</option>
              <option>Uplifting</option>
            </select>

            <select
              {...register('length')}
              className="flex-1 p-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-cyan-400"
            >
              <option>1 min</option>
              <option>3 min</option>
              <option>5 min</option>
              <option>10 min</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-500 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Generating magic...' : 'Generate Script'}
          </button>
        </form>
      </div>

      {script && (
        <div className="relative bg-white border border-zinc-200 rounded-2xl shadow-md p-6 whitespace-pre-wrap leading-relaxed">
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1 rounded-lg bg-indigo-500 text-white hover:opacity-90 transition"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>

            <button
              onClick={handleClear}
              className="text-xs px-3 py-1 rounded-lg bg-zinc-200 hover:bg-zinc-300 transition"
            >
              Clear
            </button>
          </div>

          <div className="prose mt-6">
            <ReactMarkdown>{script}</ReactMarkdown>
          </div>
        </div>
      )}

      {error && (
        <div
          className={`text-red-500 bg-white border border-zinc-200 rounded-2xl shadow-md p-6 whitespace-pre-wrap leading-relaxed`}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default GenerateScriptForm;
