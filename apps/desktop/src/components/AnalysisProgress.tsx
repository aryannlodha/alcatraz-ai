import React from 'react';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

export type AnalysisState = 'idle' | 'sources_selected' | 'extracting' | 'normalizing' | 'cross_checking' | 'complete' | 'error';

const STAGES = [
  { id: 'sources_selected', label: 'Sources Selected' },
  { id: 'extracting', label: 'Extracting Facts (OCR/AI)' },
  { id: 'normalizing', label: 'Normalizing Data' },
  { id: 'cross_checking', label: 'Cross-Checking Consistency' },
  { id: 'complete', label: 'Analysis Complete' },
];

export function AnalysisProgress({ currentState }: { currentState: AnalysisState }) {
  if (currentState === 'idle') return null;

  const currentIndex = STAGES.findIndex(s => s.id === currentState);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Analysis Progress</h3>
      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const isCompleted = currentIndex > index || currentState === 'complete';
          const isCurrent = currentState === stage.id && currentState !== 'complete';
          
          return (
            <div key={stage.id} className="flex items-center gap-3">
              {isCompleted ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : isCurrent ? (
                <Loader2 className="text-blue-600 animate-spin" size={20} />
              ) : (
                <Circle className="text-gray-300" size={20} />
              )}
              <span className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
