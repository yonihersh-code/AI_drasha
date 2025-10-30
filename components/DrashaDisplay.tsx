import React, { useState, useEffect } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { PrintIcon } from './icons/PrintIcon';
import { ShareIcon } from './icons/ShareIcon';

interface DrashaDisplayProps {
  drasha: string;
  isLoading: boolean;
}

const stripMarkdown = (markdown: string): string => {
  return markdown
    .replace(/### |## |# /g, '') // Remove heading markers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italics
    .replace(/^\* /gm, '') // Remove list bullets
    .trim();
};


const DrashaDisplay: React.FC<DrashaDisplayProps> = ({ drasha, isLoading }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    if (copyStatus === 'copied') {
      const timer = setTimeout(() => setCopyStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);
  
  const handleCopy = () => {
    const plainText = stripMarkdown(drasha);
    navigator.clipboard.writeText(plainText).then(() => {
      setCopyStatus('copied');
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const plainText = stripMarkdown(drasha);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Drasha from Zooz',
          text: plainText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy();
      alert('Sharing not supported on this browser. Drasha copied to clipboard instead.');
    }
  };


  if (isLoading && !drasha) { // Only show skeleton if drasha is empty
    return (
      <div className="mt-6 p-6 rounded-md border border-slate-700 bg-slate-900/50">
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
             <div className="h-4 bg-slate-700 rounded w-1/2 mt-6"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-4/6"></div>
          </div>
      </div>
    );
  }

  if (!drasha && !isLoading) {
    return (
      <div className="text-center text-slate-500 py-10 border-2 border-dashed border-slate-700 rounded-lg mt-6">
        <p className="text-lg">Your generated drasha will appear here.</p>
        <p className="text-sm">Fill out the form above to begin.</p>
      </div>
    );
  }

  // Basic markdown-like rendering. A full library like 'react-markdown' would be better for production.
  const formattedContent = drasha.split('\n').map((line, index) => {
    line = line.trim();
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-sky-400">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-sky-300">{line.substring(3)}</h2>;
    }
     if (line.startsWith('# ')) {
      return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-sky-200">{line.substring(2)}</h1>;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold my-4">{line.substring(2, line.length - 2)}</p>
    }
    if (line.startsWith('* ') && line.length > 2) {
        return <li key={index} className="ml-6 list-disc">{line.substring(2)}</li>
    }
    if (line === '') {
      return null; // Don't render empty lines
    }
    return <p key={index} className="my-3 leading-relaxed">{line}</p>;
  }).filter(Boolean); // remove nulls

  return (
    <div className="mt-6">
        <div className="drasha-actions flex justify-end gap-2 mb-4">
           <button onClick={handleCopy} className="flex items-center gap-2 py-1 px-3 border border-slate-600 rounded-md text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors">
            <CopyIcon className="h-4 w-4" />
            {copyStatus === 'copied' ? 'Copied!' : 'Copy Text'}
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 py-1 px-3 border border-slate-600 rounded-md text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors">
            <PrintIcon className="h-4 w-4" />
            Print
          </button>
           <button onClick={handleShare} className="flex items-center gap-2 py-1 px-3 border border-slate-600 rounded-md text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors">
            <ShareIcon className="h-4 w-4" />
            Share
          </button>
        </div>
        <div
        aria-live="assertive"
        className="drasha-container bg-slate-900/50 p-6 rounded-md border border-slate-700 text-slate-300 text-left"
        >
            {formattedContent}
        </div>
        <div className="mt-6 pt-4 text-center text-xs text-slate-500 border-t border-slate-700">
          <p><strong>Disclaimer:</strong> This drasha is AI-generated. Please review carefully for accuracy and appropriateness before use. Zooz is not responsible for any content.</p>
        </div>
    </div>
  );
};

export default DrashaDisplay;
