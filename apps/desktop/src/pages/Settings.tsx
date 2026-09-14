import React from 'react';
import { Settings as SettingsIcon, Cloud, HardDrive, Shield } from 'lucide-react';

export function SettingsPage({ isCloud, setIsCloud }: { isCloud: boolean, setIsCloud: (v: boolean) => void }) {
  const [strictness, setStrictness] = React.useState(() => {
    return parseInt(localStorage.getItem('alcatraz-strictness') || '1', 10);
  });

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
      </div>
    </div>
  );
}
