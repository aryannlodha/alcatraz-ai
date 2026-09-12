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
