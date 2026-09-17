import React from 'react';
import { Shield, FileText, Cpu, GitCompare, AlertTriangle, User, Brain, Zap, Globe, Lock, Smartphone, AppWindow } from 'lucide-react';

const STEPS = [
  { icon: <FileText size={24} />, label: 'Source Intake', desc: 'Upload PDFs, images, paste text, scan documents with camera, or record voicemail audio.', color: 'bg-blue-600' },
  { icon: <Cpu size={24} />, label: 'On-Device AI Extraction', desc: 'Transformers.js runs DistilBERT NER and Whisper-tiny locally via WebGPU on Snapdragon NPU. Zero cloud calls.', color: 'bg-purple-600' },
  { icon: <GitCompare size={24} />, label: 'Fact Normalization', desc: 'Dates, currency, names, accounts, and domains are normalized to canonical forms using Levenshtein distance.', color: 'bg-indigo-600' },
  { icon: <Shield size={24} />, label: 'Deterministic Rules Engine', desc: 'Hard-coded rules compare normalized facts across sources. No AI hallucination. Pure mathematical proof.', color: 'bg-gray-900 dark:bg-white dark:text-gray-900' },
  { icon: <Brain size={24} />, label: 'ML Classification', desc: 'A fine-tuned DistilBERT ONNX model (trained on 18K phishing emails from Kaggle) classifies text as phishing/safe.', color: 'bg-red-600' },
  { icon: <AlertTriangle size={24} />, label: 'Evidence-First Findings', desc: 'Each finding shows exactly which sources conflict, with excerpts, confidence scores, and Bloom Filter domain checks.', color: 'bg-amber-600' },
  { icon: <User size={24} />, label: 'User Decision', desc: 'Alcatraz never acts autonomously. You review the evidence, ask the Groq-powered Copilot, and decide.', color: 'bg-green-600' },
];

const PLATFORMS = [
  { icon: <Globe size={14} />, label: 'Web / PWA', desc: 'True Offline Mode' },
  { icon: <Smartphone size={14} />, label: 'Desktop (.msi)', desc: 'Rust + Tauri' },
  { icon: <AppWindow size={14} />, label: 'Chrome Extension', desc: 'Manifest V3' },
];

export function HowItWorksPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">System Architecture</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 font-medium">
        A transparent, deterministic verification pipeline. AI extracts. Rules compare. You decide.
      </p>

      {/* Architecture Pipeline */}
      <div className="relative">
        {STEPS.map((step, i) => (
          <div key={i} className="flex gap-6 mb-6 last:mb-0">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${step.color}`}>
                {step.icon}
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 mt-2" />
              )}
            </div>
            <div className="pt-1 flex-1 pb-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Step {i + 1}</span>
                {i === 3 && (
                  <span className="text-[10px] font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-0.5 rounded-full uppercase tracking-wider">Core Engine</span>
                )}
                {i === 4 && (
                  <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Kaggle Trained</span>
                )}
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{step.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Key Principle */}
      <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Lock size={16} className="text-gray-900 dark:text-white" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Key Principle: Zero Hallucination</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          The deterministic rules engine at Step 4 is the <strong>source of truth</strong>. AI models extract and classify facts,
          but they are <strong>never</strong> the sole mechanism deciding whether two values conflict. Mathematical comparison (Levenshtein distance, 
          fuzzy string matching, Bloom Filters) ensures zero hallucination in the verification layer. The ML model at Step 5 provides an 
          <strong> independent, probabilistic second opinion</strong> trained on real-world phishing data.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-gray-900 dark:text-white" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Technology Stack</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {['React 18', 'Vite', 'TailwindCSS', 'TypeScript', 'Transformers.js', 'ONNX Runtime', 'WebGPU', 'Rust/Tauri'].map(tech => (
            <div key={tech} className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 text-center">
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Targets */}
      <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Deployment Targets</h3>
        <div className="grid grid-cols-3 gap-4">
          {PLATFORMS.map(p => (
            <div key={p.label} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
                {p.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{p.label}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
