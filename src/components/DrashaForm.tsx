import React, { useState } from 'react';
import type { DrashaLength, RabbinicStyle, TorahPortion } from '../types.ts';
import { drashaLengths, rabbinicStyles, torahPortionsAndHolidays, CUSTOM_RABBI_STYLE } from '../types.ts';
import { SparklesIcon } from './icons/SparklesIcon.tsx';

interface DrashaFormProps {
  onGenerate: (torahPortion: TorahPortion, length: DrashaLength, style: RabbinicStyle | string, specificTopic: string) => void;
  isLoading: boolean;
}

const DrashaForm: React.FC<DrashaFormProps> = ({ onGenerate, isLoading }) => {
  const [torahPortion, setTorahPortion] = useState<TorahPortion>(torahPortionsAndHolidays[0].options[0]);
  const [length, setLength] = useState<DrashaLength>(drashaLengths[0]);
  const [style, setStyle] = useState<RabbinicStyle>(rabbinicStyles[0]);
  const [customStyle, setCustomStyle] = useState<string>('');
  const [specificTopic, setSpecificTopic] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStyle = style === CUSTOM_RABBI_STYLE ? customStyle : style;
    if (!finalStyle) return;
    onGenerate(torahPortion, length, finalStyle, specificTopic);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="torah-portion" className="block text-sm font-medium text-slate-300">
          Torah Portion / Chag
        </label>
        <div className="mt-1">
          <select
            id="torah-portion"
            value={torahPortion}
            onChange={(e) => setTorahPortion(e.target.value as TorahPortion)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          >
            {torahPortionsAndHolidays.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((portion) => (
                  <option key={portion} value={portion}>
                    {portion}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="drasha-length" className="block text-sm font-medium text-slate-300">
            Length
          </label>
          <div className="mt-1">
            <select
              id="drasha-length"
              value={length}
              onChange={(e) => setLength(e.target.value as DrashaLength)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            >
              {drashaLengths.map((len) => (
                <option key={len} value={len}>{len}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="rabbinic-style" className="block text-sm font-medium text-slate-300">
            Rabbinic Style
          </label>
          <div className="mt-1">
            <select
              id="rabbinic-style"
              value={style}
              onChange={(e) => setStyle(e.target.value as RabbinicStyle)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            >
              {rabbinicStyles.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {style === CUSTOM_RABBI_STYLE && (
        <div>
          <label htmlFor="custom-rabbinic-style" className="block text-sm font-medium text-slate-300">
            Custom Rabbi Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="custom-rabbinic-style"
              value={customStyle}
              onChange={(e) => setCustomStyle(e.target.value)}
              placeholder="Enter the name of the rabbi"
              className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              required
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="specific-topic" className="block text-sm font-medium text-slate-300">
          Specific Topic (Optional)
        </label>
        <div className="mt-1">
          <textarea
            id="specific-topic"
            rows={3}
            value={specificTopic}
            onChange={(e) => setSpecificTopic(e.target.value)}
            placeholder="e.g., The importance of community, finding light in darkness, a personal story..."
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || (style === CUSTOM_RABBI_STYLE && !customStyle)}
          className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 disabled:bg-sky-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
          aria-live="polite"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5"/>
              Generate Drasha
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DrashaForm;
