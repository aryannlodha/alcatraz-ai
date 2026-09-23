import React, { useState } from 'react';
import { Clipboard, AlertCircle, Plus, Trash2, ArrowRight, Shield, FileText } from 'lucide-react';
import { Source } from '@alcatraz/contracts';

interface TextSource {
  id: string;
  label: string;
  content: string;
}

export function PasteScreen({ onAnalyze }: { onAnalyze: (sources: Source[]) => void }) {
  const [sources, setSources] = useState<TextSource[]>([
    { id: `src_1`, label: 'Source A (e.g., Email)', content: '' },
    { id: `src_2`, label: 'Source B (e.g., Website / Invoice)', content: '' },
  ]);
  const [error, setError] = useState<string | null>(null);

  const addSource = () => {
    const n = sources.length + 1;
    setSources(prev => [...prev, {
      id: `src_${Date.now()}`,
      label: `Source ${String.fromCharCode(64 + n)}`,
      content: ''
    }]);
  };

  const removeSource = (id: string) => {
    if (sources.length <= 1) return;
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const updateContent = (id: string, content: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, content } : s));
    setError(null);
  };

  const handlePasteFromClipboard = async (id: string) => {
    try {
      const clipText = await navigator.clipboard.readText();
      updateContent(id, clipText);
    } catch {
      setError('Could not read clipboard. Please paste manually.');
    }
  };

  const handleAnalyze = () => {
    const filledSources = sources.filter(s => s.content.trim());
    if (filledSources.length === 0) {
      setError('Please enter text in at least one source.');
      return;
    }
    
    const contractSources: Source[] = filledSources.map(s => ({
      id: s.id,
      name: s.label,
      type: 'text' as const,
      isSynthetic: false,
      content: s.content,
    }));
    
    onAnalyze(contractSources);
  };

  const filledCount = sources.filter(s => s.content.trim()).length;

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cross-Check Sources</h1>
        <span className="px-3 py-1 text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full uppercase tracking-wider">
          {filledCount} Source{filledCount !== 1 ? 's' : ''} Ready
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Paste content from multiple sources to cross-check for contradictions. For a single source, the engine will scan for phishing indicators, urgency tactics, and credential requests.
      </p>

      {/* Hint Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Shield size={18} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Tip:</strong> For best results, paste related documents side by side — e.g., an email in Source A and the sender's official website text in Source B. The engine will compare names, domains, amounts, and dates across both.
        </div>
      </div>

      {/* Source Text Areas */}
      <div className="space-y-4 mb-6">
        {sources.map((source, i) => (
          <div key={source.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{source.label}</span>
                {source.content.trim() && (
                  <span className="text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                    {source.content.trim().split(/\s+/).length} words
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePasteFromClipboard(source.id)}
                  className="flex items-center gap-1 text-xs font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-2.5 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Clipboard size={12} /> Paste
                </button>
                {sources.length > 1 && (
                  <button 
                    onClick={() => removeSource(source.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={source.content}
              onChange={(e) => updateContent(source.id, e.target.value)}
              placeholder={i === 0 
                ? "Paste the first source here (e.g., email body, invoice text, job application)..." 
                : "Paste the second source here (e.g., website text, payment receipt, resume)..."
              }
              className="w-full h-40 p-4 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        ))}
      </div>

      {/* Add Source Button */}
      <button
        onClick={addSource}
        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center justify-center gap-2 mb-6"
      >
        <Plus size={16} /> Add Another Source
      </button>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg mb-6 border border-red-200 dark:border-red-900/40">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex justify-end">
        <button 
          disabled={filledCount === 0}
          onClick={handleAnalyze}
          className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <ArrowRight size={16} /> {filledCount > 1 ? 'Cross-Check Sources' : 'Scan for Threats'}
        </button>
      </div>
    </div>
  );
}
