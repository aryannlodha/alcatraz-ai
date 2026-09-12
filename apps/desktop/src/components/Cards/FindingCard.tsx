import React from 'react';
import { SeverityBadge } from '../Badges/SeverityBadge';
import { Finding, Fact } from '@alcatraz/contracts';
import { X, Search, FileText } from 'lucide-react';

export function FindingCard({ 
  finding, 
  facts, 
  onDismiss 
}: { 
  finding: Finding; 
  facts: Fact[]; 
  onDismiss: (id: string) => void;
}) {
  const relevantFacts = facts.filter(f => finding.factIds.includes(f.id));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <SeverityBadge severity={finding.severity} />
          <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">
            {finding.type.replace('_', ' ')} DETECTED
          </h3>
        </div>
        <button 
          onClick={() => onDismiss(finding.id)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
          aria-label="Dismiss finding"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Why am I seeing this?</h4>
          <p className="text-gray-900 text-sm font-medium leading-relaxed">{finding.explanation}</p>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Source Evidence</h4>
          <div className="space-y-4">
            {relevantFacts.map((fact) => (
              <div key={fact.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <FileText size={16} className="text-gray-400" />
                  {fact.sourceId}
                </div>
                <div className="font-mono text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                  {fact.attribute}: {fact.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
            <Search size={16} /> Review Evidence
          </button>
          <button 
            onClick={() => onDismiss(finding.id)}
            className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
