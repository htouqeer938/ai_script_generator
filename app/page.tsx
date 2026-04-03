import GenerateScriptForm from '@/components/generateForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-black px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
          AI Script Generator
        </h1>
        <GenerateScriptForm />
      </div>
    </div>
  );
}
