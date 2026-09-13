import React, { useState } from 'react';
import { Clipboard, AlertCircle } from 'lucide-react';
import { Source } from '@alcatraz/contracts';

export function PasteScreen({ onAnalyze }: { onAnalyze: (sources: Source[]) => void }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
      setError(null);
    } catch (err) {
      setError('Could not read clipboard. Please paste manually.');
    }
  };

  const handleAnalyze = () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    
    const source: Source = {
      id: `src_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      name: 'Pasted Information',
      type: 'text',
      isSynthetic: false,
      content: text,
    };
    
    onAnalyze([source]);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Paste Information</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Raw Text / Content</span>
          <button 
            onClick={handlePaste}
            className="flex items-center gap-2 text-xs font-semibold bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Clipboard size={14} /> Paste from Clipboard
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setError(null); }}
          placeholder="Paste email content, website text, or raw information here..."
          className="w-full h-64 p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg mb-6 border border-red-200">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex justify-end">
        <button 
          disabled={!text.trim()}
          onClick={handleAnalyze}
          className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Verify Text
        </button>
      </div>
    </div>
  );
}
