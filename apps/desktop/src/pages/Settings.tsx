
import React, { useState } from 'react';

export function SettingsPage({ isCloud, setIsCloud }: { isCloud: boolean, setIsCloud: (v: boolean) => void }) {
  const [saveHistory, setSaveHistory] = useState(false);
  const [preferLocal, setPreferLocal] = useState(true);

  return (
    <div className="p-8 max-w-3xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Privacy & Processing</h2>
          <div className="space-y-6">
            <ToggleOption 
              title="Prefer local processing" 
              description="Process all documents and screenshots locally on this device. (Recommended)"
              checked={preferLocal}
              onChange={(c) => { setPreferLocal(c); if(c) setIsCloud(false); }}
            />
            <ToggleOption 
              title="Allow cloud fallback" 
              description="Use cloud models only if local processing fails or is unsupported. We will never upload without warning."
              checked={isCloud}
              onChange={(c) => { setIsCloud(c); if(c) setPreferLocal(false); }}
            />
            <ToggleOption 
              title="Save analysis history" 
              description="Store structural facts and analysis history locally in SQLite. (Raw files are always deleted)"
              checked={saveHistory}
              onChange={setSaveHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleOption({ title, description, checked, onChange }: { title: string, description: string, checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <label className="flex items-start justify-between cursor-pointer group">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="relative inline-flex items-center cursor-pointer ml-4">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
      </div>
    </label>
  );
}
