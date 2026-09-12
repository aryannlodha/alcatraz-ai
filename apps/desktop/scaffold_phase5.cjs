const fs = require('fs');
const path = require('path');

function write(p, content) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, content.trim() + '\n');
}

// 1. SourceCard.tsx
write('src/components/Cards/SourceCard.tsx', `
import React from 'react';
import { FileText, Image as ImageIcon, Type, X } from 'lucide-react';
import { Source } from '@alcatraz/contracts';

export function SourceCard({ source, onRemove }: { source: Source; onRemove: (id: string) => void }) {
  const Icon = source.type === 'pdf' ? FileText : source.type === 'image' ? ImageIcon : Type;
  
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 bg-gray-50 rounded text-gray-500">
          <Icon size={18} />
        </div>
        <div className="truncate">
          <p className="text-sm font-medium text-gray-900 truncate">{source.name}</p>
          <p className="text-xs text-gray-500 uppercase">{source.type} {source.isSynthetic && '• Synthetic'}</p>
        </div>
      </div>
      <button 
        onClick={() => onRemove(source.id)}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        aria-label="Remove source"
      >
        <X size={16} />
      </button>
    </div>
  );
}
`);

// 2. UploadScreen.tsx
write('src/pages/UploadScreen.tsx', `
import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { Source } from '@alcatraz/contracts';
import { SourceCard } from '../components/Cards/SourceCard';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'];

export function UploadScreen({ onAnalyze }: { onAnalyze: (sources: Source[]) => void }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    setError(null);
    if (!files) return;
    
    const newSources: Source[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.txt')) {
        setError(\`Invalid file type: \${file.name}. Only PDF, PNG, JPG, and TXT are allowed.\`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(\`File too large: \${file.name}. Maximum size is 10MB.\`);
        continue;
      }
      
      newSources.push({
        id: \`src_\${Date.now()}_\${Math.random().toString(36).substring(2)}\`,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'text',
        isSynthetic: false
      });
    }
    
    setSources(prev => [...prev, ...newSources]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h1>
      
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl bg-white p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors mb-6"
      >
        <UploadCloud size={40} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Click or drag files here</h3>
        <p className="text-sm text-gray-500">Supports PDF, PNG, JPG, and TXT up to 10MB.</p>
        <p className="text-xs text-gray-400 mt-4 font-medium bg-gray-100 px-3 py-1 rounded-full">Files are processed locally and deleted after analysis.</p>
        <input 
          type="file" 
          className="hidden" 
          multiple 
          accept=".pdf,.png,.jpg,.jpeg,.txt"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg mb-6 border border-red-200">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {sources.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Selected Sources</h3>
          <div className="space-y-2">
            {sources.map(src => (
              <SourceCard key={src.id} source={src} onRemove={(id) => setSources(s => s.filter(x => x.id !== id))} />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button 
          disabled={sources.length === 0}
          onClick={() => onAnalyze(sources)}
          className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Verify Sources
        </button>
      </div>
    </div>
  );
}
`);

// 3. PasteScreen.tsx
write('src/pages/PasteScreen.tsx', `
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
      id: \`src_\${Date.now()}_\${Math.random().toString(36).substring(2)}\`,
      name: 'Pasted Information',
      type: 'text',
      isSynthetic: false,
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
`);

// 4. Update App.tsx
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
if (!appTsx.includes('UploadScreen')) {
  appTsx = `import { UploadScreen } from './pages/UploadScreen';\nimport { PasteScreen } from './pages/PasteScreen';\n` + appTsx;
  appTsx = appTsx.replace(
    /case 'analyze': return <AnalyzeScreen scenario="blank" \/>;/,
    `case 'analyze': return <AnalyzeScreen scenario="blank" />;\n      case 'upload': return <UploadScreen onAnalyze={() => setActiveTab('analyze')} />;\n      case 'paste': return <PasteScreen onAnalyze={() => setActiveTab('analyze')} />;`
  );
  fs.writeFileSync('src/App.tsx', appTsx);
}

console.log('Phase 5 Scaffolding UI Completed.');
