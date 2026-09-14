import React from 'react';
import { Shield, FileText, Cpu, GitCompare, AlertTriangle, User, ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: <FileText size={28} />, label: 'Source Intake', desc: 'Upload PDFs, images, paste text, or analyze screen content.' },
  { icon: <Cpu size={28} />, label: 'OCR / AI Extraction', desc: 'Tesseract.js reads images. PDF.js reads documents. ONNX Runtime runs models locally on Snapdragon NPU.' },
  { icon: <GitCompare size={28} />, label: 'Fact Normalization', desc: 'Dates, numbers, names, accounts, and domains are normalized to a canonical form for safe comparison.' },
  { icon: <Shield size={28} />, label: 'Deterministic Rules', desc: 'Hard-coded rules compare normalized facts across sources. No AI hallucination. Math, not guessing.' },
  { icon: <AlertTriangle size={28} />, label: 'Evidence-First Findings', desc: 'Each finding shows exactly which sources conflict, with excerpts and confidence scores.' },
  { icon: <User size={28} />, label: 'User Decision', desc: 'Alcatraz never acts. You review the evidence and make every consequential decision yourself.' },
];

export function HowItWorksPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">How Alcatraz AI Works</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">
        A transparent, deterministic verification pipeline. AI extracts. Rules compare. You decide.
      </p>

      <div className="relative">
        {STEPS.map((step, i) => (
          <div key={i} className="flex gap-6 mb-8 last:mb-0">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${
                i === 3 ? 'bg-gray-900 dark:bg-white dark:text-gray-900' : 'bg-gray-700 dark:bg-gray-600'
              }`}>
                {step.icon}
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-700 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="pt-2 flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Step {i + 1}</span>
                {i === 3 && (
                  <span className="text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-0.5 rounded-full">CORE</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{step.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Key Principle</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          The deterministic rules engine at Step 4 is the source of truth. An AI model may extract or interpret facts,
          but it is <strong>never</strong> the sole mechanism deciding whether two values conflict. Mathematical comparison
          ensures zero hallucination in the verification layer.
        </p>
      </div>
    </div>
  );
}
