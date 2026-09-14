import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Info, FileText, ArrowRight, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { AnalysisProgress, AnalysisState } from '../components/AnalysisProgress';
import { FindingCard } from '../components/Cards/FindingCard';
import { EmptyState } from '../components/EmptyState';
import { runEngine } from '@alcatraz/reasoning';
import { Fact, Finding } from '@alcatraz/contracts';
import { CheckCircle, Bot } from 'lucide-react';
// @ts-ignore
import { demo1ApplicationFacts, demo2PaymentFacts, demo3PhishingFacts } from '../demo/synthetic_data';
import { CameraScanner } from './CameraScanner';
import { SecurityCopilot } from '../components/SecurityCopilot';
import { TransformersProvider } from '@alcatraz/analysis';

export function AnalyzeScreen({ scenario, isCloud }: { scenario: string, isCloud: boolean }) {
  const [state, setState] = useState<AnalysisState>('idle');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [phishingResult, setPhishingResult] = useState<{label: string, score: number} | null>(null);
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
    setTimeout(async () => {
      const generatedFindings = runEngine(demoFacts);
      setFindings(generatedFindings);
      setState('complete');
      
      // Run the local ML model in the background
      if (scenario === 'demo3' || scenario === 'paste') {
        try {
          const provider = new TransformersProvider();
          // Provide a dummy suspicious email text for the demo
          const text = "URGENT: Your account has been suspended. Please click here to verify your identity and restore access.";
          const result = await provider.detectPhishing(text);
          setPhishingResult(result);
        } catch(e) {
          console.error("Local ML Model failed to load:", e);
        }
      }
    }, 3200);

  }, [scenario]);

  const startAnalysis = async (_img: string, _type: string) => {
    setState('sources_selected');
    setFindings([]);
    // Setup real pipeline call here if needed
    setTimeout(() => setState('complete'), 3000);
  };

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
        {scenario === 'camera' ? (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Camera Capture
          </span>
        ) : scenario !== 'blank' ? (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Synthetic Demo Data
          </span>
        ) : null}
      </div>

      {scenario === 'blank' ? (
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
