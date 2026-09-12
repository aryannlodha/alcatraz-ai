const fs = require('fs');
const path = require('path');

function write(p, content) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, content.trim() + '\n');
}

// 1. AnalysisProgress.tsx
write('src/components/AnalysisProgress.tsx', `
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
              <span className={\`text-sm font-medium \${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}\`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
`);

// 2. FindingCard.tsx
write('src/components/Cards/FindingCard.tsx', `
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
`);

// 3. AnalyzeScreen.tsx
write('src/pages/AnalyzeScreen.tsx', `
import React, { useState, useEffect } from 'react';
import { AnalysisProgress, AnalysisState } from '../components/AnalysisProgress';
import { FindingCard } from '../components/Cards/FindingCard';
import { EmptyState } from '../components/EmptyState';
import { runEngine } from '@alcatraz/reasoning';
import { Fact, Finding } from '@alcatraz/contracts';
import { CheckCircle } from 'lucide-react';
// @ts-ignore
import { demo1ApplicationFacts, demo2PaymentFacts, demo3PhishingFacts } from '../../../../demo/synthetic_data.ts';

export function AnalyzeScreen({ scenario }: { scenario: string }) {
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
        <h1 className="text-2xl font-bold text-gray-900">Analysis</h1>
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
`);

// 4. Update Dashboard.tsx
let dashboard = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(/onRun=\{.*?}/g, (match) => {
  if (match.includes('Demo 1')) return `onRun={() => onNavigate('demo1')}`;
  if (match.includes('Demo 2')) return `onRun={() => onNavigate('demo2')}`;
  if (match.includes('Demo 3')) return `onRun={() => onNavigate('demo3')}`;
  return match;
});
fs.writeFileSync('src/pages/Dashboard.tsx', dashboard);

// 5. Update App.tsx routing
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
if (!appTsx.includes('AnalyzeScreen')) {
  appTsx = `import { AnalyzeScreen } from './pages/AnalyzeScreen';\n` + appTsx;
  appTsx = appTsx.replace(
    /case 'dashboard': return <DashboardPage onNavigate={setActiveTab} \/>;/,
    `case 'dashboard': return <DashboardPage onNavigate={setActiveTab} />;\n      case 'analyze': return <AnalyzeScreen scenario="blank" />;\n      case 'demo1': return <AnalyzeScreen scenario="demo1" />;\n      case 'demo2': return <AnalyzeScreen scenario="demo2" />;\n      case 'demo3': return <AnalyzeScreen scenario="demo3" />;`
  );
  fs.writeFileSync('src/App.tsx', appTsx);
}

console.log('Phase 4 Scaffolding Completed Successfully.');
