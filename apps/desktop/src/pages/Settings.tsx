import React from 'react';
import { Settings as SettingsIcon, Cloud, HardDrive, Shield, Key } from 'lucide-react';

export function SettingsPage({ isCloud, setIsCloud }: { isCloud: boolean, setIsCloud: (v: boolean) => void }) {
  const [strictness, setStrictness] = React.useState(() => {
    return parseInt(localStorage.getItem('alcatraz-strictness') || '1', 10);
  });
  const [groqApiKey, setGroqApiKey] = React.useState(() => {
    return localStorage.getItem('GROQ_API_KEY') || '';
  });
  const [isGroqSaved, setIsGroqSaved] = React.useState(() => {
    return !!localStorage.getItem('GROQ_API_KEY');
  });

  const handleSaveGroqKey = () => {
    if (groqApiKey.trim()) {
      localStorage.setItem('GROQ_API_KEY', groqApiKey.trim());
      setIsGroqSaved(true);
    } else {
      localStorage.removeItem('GROQ_API_KEY');
      setIsGroqSaved(false);
    }
  };

  const handleStrictnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setStrictness(val);
    localStorage.setItem('alcatraz-strictness', val.toString());
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <SettingsIcon size={20} className="text-gray-900 dark:text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Privacy Setting */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-gray-900 dark:text-white" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Privacy & Engine</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Configure how and where your data is processed.</p>

          <div className="flex items-start gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer mb-4 hover:border-gray-300 dark:hover:border-gray-600 border-gray-200 dark:border-gray-700"
               onClick={() => setIsCloud(false)}>
            <input type="radio" checked={!isCloud} onChange={() => setIsCloud(false)} className="mt-1" />
            <div>
              <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-1">
                <HardDrive size={16} /> Local / On-Device (Recommended)
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">All OCR, fact extraction, and rule evaluation happen on your hardware. Zero data leaves your PC.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
               onClick={() => setIsCloud(true)}>
            <input type="radio" checked={isCloud} onChange={() => setIsCloud(true)} className="mt-1" />
            <div>
              <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-1">
                <Cloud size={16} /> Cloud Fallback
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Use external APIs for heavier OCR/AI tasks. Requires an internet connection and transmits text.</p>
            </div>
          </div>
        </div>

        {/* Strictness Setting */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Engine Strictness</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Adjust how sensitive the deterministic rules engine is to mismatches.</p>

          <input 
            type="range" 
            min="0" max="2" step="1" 
            value={strictness} 
            onChange={handleStrictnessChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" 
          />
          <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
            <span>Lenient</span>
            <span>Balanced</span>
            <span>Strict</span>
          </div>
        </div>

        {/* Groq API Key */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Key size={20} className="text-gray-900 dark:text-white" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Groq API Key</h2>
            </div>
            {isGroqSaved ? (
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">Connected</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">Not Configured</span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your Groq API key for cloud fallback LLM capabilities.</p>
          <div className="flex gap-3">
            <input
              type="password"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              placeholder="gsk_..."
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white dark:text-white"
            />
            <button
              onClick={handleSaveGroqKey}
              className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Save Key
            </button>
          </div>
        </div>

        {/* Panic Button */}
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-red-700 dark:text-red-500 mb-2">Danger Zone</h2>
          <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6">Instantly purge all local storage, indexedDB, and cache. This action cannot be undone.</p>
          
          <button 
            onClick={() => {
              if (window.confirm('Are you sure? This will wipe all local data.')) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Execute Secure Wipe
          </button>
        </div>
      </div>
    </div>
  );
}
