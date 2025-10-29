import React, { useState, useCallback } from 'react';
import type { DrashaLength, RabbinicStyle, TorahPortion } from './types';
import { generateDrasha as generateDrashaService } from './services/geminiService';
import DrashaForm from './components/DrashaForm';
import DrashaDisplay from './components/DrashaDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [drasha, setDrasha] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDrasha = useCallback(async (
    torahPortion: TorahPortion,
    length: DrashaLength,
    style: RabbinicStyle | string
  ) => {
    setIsLoading(true);
    setError(null);
    setDrasha('');
    try {
      const generatedDrasha = await generateDrashaService(torahPortion, length, style);
      setDrasha(generatedDrasha);
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 flex items-center justify-center gap-3">
          <SparklesIcon />
          Zooz Drasha Generator
        </h1>
        <p className="mt-2 text-slate-400">Craft the perfect drasha.</p>
      </header>
      <main className="w-full max-w-4xl bg-slate-800 rounded-lg shadow-xl p-6 sm:p-8">
        <DrashaForm onGenerate={handleGenerateDrasha} isLoading={isLoading} />
        <div className="mt-8">
          {error && <p className="text-red-400 text-center bg-red-900/20 p-3 rounded-md border border-red-800">{error}</p>}
          <DrashaDisplay drasha={drasha} isLoading={isLoading} />
        </div>
      </main>
      <footer className="w-full max-w-4xl text-center mt-8 text-slate-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
