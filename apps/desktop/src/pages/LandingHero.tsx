import React from 'react';
import { Shield, ExternalLink, Globe, Brain, Lock, Zap, Fingerprint, FileText, BarChart3 } from 'lucide-react';

const FEATURES = [
  { icon: <Brain size={20} />, title: 'On-Device AI (NER)', desc: 'DistilBERT runs locally via WebGPU', color: 'text-purple-500' },
  { icon: <Lock size={20} />, title: 'Biometric Lock', desc: 'WebAuthn TouchID / Windows Hello', color: 'text-blue-500' },
  { icon: <Shield size={20} />, title: 'Bloom Filter', desc: 'Offline phishing domain detection', color: 'text-red-500' },
  { icon: <Zap size={20} />, title: 'ELA Tamper Check', desc: 'Detect Photoshop modifications', color: 'text-amber-500' },
  { icon: <Fingerprint size={20} />, title: 'Zero Trust', desc: 'No data leaves your device', color: 'text-green-500' },
  { icon: <BarChart3 size={20} />, title: 'Trained ML Model', desc: '97.2% accuracy on phishing data', color: 'text-indigo-500' },
];

export function LandingHero({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-12 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 tech-grid-bg opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-950"></div>
      
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Shield Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center shadow-2xl">
          <Shield size={40} className="text-white dark:text-gray-900" />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
          Alcatraz AI
        </h1>
        
        {/* Tagline */}
        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mb-2 max-w-lg mx-auto">
          The privacy-first, on-device verification layer for the AI era.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-10 font-mono">
          Powered by Snapdragon NPU · Transformers.js · WebGPU
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all text-sm flex items-center gap-2"
          >
            <Zap size={16} /> Launch Dashboard
          </button>
          <a 
            href="https://github.com/aryannlodha/alcatraz-ai" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all text-sm flex items-center gap-2"
          >
            <ExternalLink size={16} /> View Source
          </a>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl text-left hover:shadow-md transition-shadow">
              <div className={`mb-2 ${f.color}`}>{f.icon}</div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom Badge */}
        <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
          <Globe size={12} /> Deploys as PWA · Desktop App · Chrome Extension
        </div>
      </div>
    </div>
  );
}
