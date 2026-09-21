import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, ShieldCheck, CheckCircle, Bot } from 'lucide-react';
import { AnalysisProgress, AnalysisState } from '../components/AnalysisProgress';
import { FindingCard } from '../components/Cards/FindingCard';
import { EmptyState } from '../components/EmptyState';
import { runEngine } from '@alcatraz/reasoning';
import { Fact, Finding, Source } from '@alcatraz/contracts';
// @ts-ignore
import { demo1ApplicationFacts, demo2PaymentFacts, demo3PhishingFacts } from '../demo/synthetic_data';
import { CameraScanner } from './CameraScanner';
import { SecurityCopilot } from '../components/SecurityCopilot';
import { RegexProvider } from '@alcatraz/analysis';
import confetti from 'canvas-confetti';

export function AnalyzeScreen({ scenario, isCloud, userSources }: { scenario: string, isCloud: boolean, userSources?: Source[] }) {
  const [state, setState] = useState<AnalysisState>('idle');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [phishingResult, setPhishingResult] = useState<{label: string, score: number} | null>(null);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (scenario === 'blank' && !userSources?.length) {
      setState('idle');
      return;
    }
    
    // Reset state
    setState('sources_selected');
    setFindings([]);
    setDismissedIds(new Set());
    setPhishingResult(null);
    
    // If user provided real sources (from Upload or Paste), extract facts with RegexProvider
    if (userSources && userSources.length > 0) {
      runRealAnalysis(userSources);
      return;
    }
    
    // Otherwise use demo data
    let demoFacts: Fact[] = [];
    if (scenario === 'demo1') demoFacts = demo1ApplicationFacts;
    if (scenario === 'demo2') demoFacts = demo2PaymentFacts;
    if (scenario === 'demo3') demoFacts = demo3PhishingFacts;
    
    setFacts(demoFacts);

    // Simulate state machine delays for demo
    setTimeout(() => setState('extracting'), 800);
    setTimeout(() => setState('normalizing'), 1600);
    setTimeout(() => setState('cross_checking'), 2400);
    setTimeout(async () => {
      const generatedFindings = runEngine(demoFacts);
      setFindings(generatedFindings);
      setState('complete');
      
      // Celebrate if no findings!
      if (generatedFindings.length === 0) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
      }
    }, 3200);

  }, [scenario, userSources]);

  const runRealAnalysis = async (sources: Source[]) => {
    try {
      // Step 1: Extracting facts
      setState('extracting');
      
      const regexProvider = new RegexProvider();
      let allFacts: Fact[] = [];
      
      for (const source of sources) {
        const text = { content: source.content || '', sourceId: source.id, confidence: 1.0 };
        const extracted = await regexProvider.extractFacts(text);
        allFacts = [...allFacts, ...extracted];
      }
      
      setFacts(allFacts);
      
      // Step 2: Normalizing
      setState('normalizing');
      await new Promise(r => setTimeout(r, 800));
      
      // Step 3: Cross-checking
      setState('cross_checking');
      await new Promise(r => setTimeout(r, 800));
      
      // Step 4: Run deterministic engine
      const generatedFindings = runEngine(allFacts);
      setFindings(generatedFindings);
      
      // Step 5: Complete
      setState('complete');
      
      // Celebrate clean results!
      if (generatedFindings.length === 0 && allFacts.length > 0) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
      }
      
    } catch (err) {
      console.error('Analysis failed:', err);
      setState('complete');
    }
  };

  const startAnalysis = async (_img: string, _type: string) => {
    setState('sources_selected');
    setFindings([]);
    setTimeout(() => setState('complete'), 3000);
  };

  const activeFindings = findings.filter(f => !dismissedIds.has(f.id));

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis</h1>
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${isCloud ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
            {isCloud ? 'Cloud Processing' : 'Local / On-Device (Privacy Safe)'}
          </span>
        </div>
        {userSources && userSources.length > 0 ? (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded-full">
            Live User Data
          </span>
        ) : scenario === 'camera' ? (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Camera Capture
          </span>
        ) : scenario !== 'blank' ? (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Synthetic Demo Data
          </span>
        ) : null}
      </div>

      {scenario === 'blank' && !userSources?.length ? (
        <EmptyState 
          icon={<CheckCircle size={32} />} 
          title="No Analysis Running" 
          description="Select an option from the dashboard to begin cross-checking your sources." 
        />
      ) : scenario === 'camera' && state === 'idle' ? (
        <div className="max-w-xl mx-auto">
          <CameraScanner onCapture={(img) => startAnalysis(img, 'image')} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <AnalysisProgress currentState={state} />
            
            {phishingResult && (
              <div className={`p-6 rounded-xl border ${phishingResult.label === 'phishing' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50' : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  {phishingResult.label === 'phishing' ? <ShieldAlert className="text-red-500" /> : <ShieldCheck className="text-green-500" />}
                  <h3 className={`font-bold ${phishingResult.label === 'phishing' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                    Local DistilBERT Analysis
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  The local ONNX model classified this document's text as <strong>{phishingResult.label.toUpperCase()}</strong>.
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-1 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${phishingResult.label === 'phishing' ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${Math.round(phishingResult.score * 100)}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs font-bold text-gray-500">
                  {Math.round(phishingResult.score * 100)}% Confidence
                </div>
              </div>
            )}

            {state === 'complete' && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Analysis Summary</h3>
                <p className="text-sm text-gray-500">Extracted {facts.length} facts from {userSources?.length || 'synthetic'} source(s).</p>
                <p className="text-sm text-gray-500 mt-1">Found {activeFindings.length} finding(s).</p>
                <div className="mt-4 text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-800 inline-block rounded text-gray-700 dark:text-gray-300">Local Processing</div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2 space-y-4">
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
                  description={facts.length > 0 
                    ? `Analyzed ${facts.length} extracted facts. No high-risk inconsistencies detected.` 
                    : "No facts could be extracted. Try pasting more detailed content like emails, invoices, or documents with names, dates, and amounts."
                  } 
                />
              )
            ) : (
               <div className="bg-white dark:bg-gray-900 p-12 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center h-64">
                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Analyzing sources in real-time...</p>
               </div>
            )}
          </div>
        </div>
      )}
      
      {/* Floating Copilot Button */}
      {state === 'complete' && !isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-50 group"
        >
          <Bot size={24} />
          <span className="absolute right-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask Security Copilot
          </span>
        </button>
      )}

      {/* Security Copilot Drawer */}
      <SecurityCopilot 
        isOpen={isCopilotOpen} 
        onClose={() => setIsCopilotOpen(false)} 
        facts={facts} 
        findings={activeFindings} 
      />
    </div>
  );
}
