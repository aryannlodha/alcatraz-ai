import React, { useState, useEffect } from 'react';
import { AnalysisProgress, AnalysisState } from '../components/AnalysisProgress';
import { FindingCard } from '../components/Cards/FindingCard';
import { EmptyState } from '../components/EmptyState';
import { runEngine } from '@alcatraz/reasoning';
import { Fact, Finding } from '@alcatraz/contracts';
import { CheckCircle } from 'lucide-react';
// @ts-ignore
import { demo1ApplicationFacts, demo2PaymentFacts, demo3PhishingFacts } from '../../../../demo/synthetic_data.ts';

export function AnalyzeScreen({ scenario, isCloud }: { scenario: string, isCloud: boolean }) {
  const [state, setState] = useState<AnalysisState>('idle');
  const [facts, setFacts] = useState<Fact[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (scenario === 'blank') {
      setState('idle');
      return;
    }
    
    // Reset state
    setState('sources_selected');
    setFindings([]);
    setDismissedIds(new Set());
    
    let demoFacts: Fact[] = [];
    if (scenario === 'demo1') demoFacts = demo1ApplicationFacts;
    if (scenario === 'demo2') demoFacts = demo2PaymentFacts;
    if (scenario === 'demo3') demoFacts = demo3PhishingFacts;
    
    setFacts(demoFacts);

    // Simulate state machine delays
    setTimeout(() => setState('extracting'), 800);
    setTimeout(() => setState('normalizing'), 1600);
    setTimeout(() => setState('cross_checking'), 2400);
    setTimeout(() => {
      const generatedFindings = runEngine(demoFacts);
      setFindings(generatedFindings);
      setState('complete');
    }, 3200);

  }, [scenario]);

  const activeFindings = findings.filter(f => !dismissedIds.has(f.id));

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Analysis</h1>
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${isCloud ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
            {isCloud ? 'Cloud Processing' : 'Local / On-Device (Privacy Safe)'}
          </span>
        </div>
        {scenario !== 'blank' && (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Synthetic Demo Data
          </span>
        )}
      </div>

      {scenario === 'blank' ? (
        <EmptyState 
          icon={<CheckCircle size={32} />} 
          title="No Analysis Running" 
          description="Select an option from the dashboard to begin cross-checking your sources." 
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AnalysisProgress currentState={state} />
            {state === 'complete' && (
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Analysis Summary</h3>
                <p className="text-sm text-gray-500">Analyzed {facts.length} facts across multiple sources.</p>
                <div className="mt-4 text-xs font-semibold px-2 py-1 bg-gray-100 inline-block rounded">Local Processing</div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2">
            {state === 'complete' ? (
              activeFindings.length > 0 ? (
                activeFindings.map(finding => (
                  <FindingCard 
                    key={finding.id} 
                    finding={finding} 
                    facts={facts} 
                    onDismiss={(id) => setDismissedIds(prev => new Set([...prev, id]))} 
                  />
                ))
              ) : (
                <EmptyState 
                  icon={<CheckCircle size={32} className="text-green-500" />} 
                  title="All Clear" 
                  description="No high-risk inconsistencies detected in the provided sources." 
                />
              )
            ) : (
               <div className="bg-white p-12 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center h-64">
                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-sm text-gray-500 font-medium">Analyzing sources in real-time...</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
