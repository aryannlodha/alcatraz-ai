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

  const handleFiles = async (files: FileList | null) => {
    setError(null);
    if (!files) return;
    
    const newSources: Source[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.txt')) {
        setError(`Invalid file type: ${file.name}. Only PDF, PNG, JPG, and TXT are allowed.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large: ${file.name}. Maximum size is 10MB.`);
        continue;
      }
      
      const type = file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'text';
      
      // Read content
      let content = '';
      if (type === 'text') {
        content = await file.text();
      } else {
        // Read as Data URL for OCR/PDF processing
        content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      newSources.push({
        id: `src_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        name: file.name,
        type,
        isSynthetic: false,
        content
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
