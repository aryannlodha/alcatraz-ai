const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');
const pagesDir = path.join(srcDir, 'pages');

const dirs = [
  componentsDir,
  path.join(componentsDir, 'Cards'),
  path.join(componentsDir, 'Badges'),
  path.join(componentsDir, 'Drawers'),
  pagesDir,
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Write SeverityBadge.tsx
fs.writeFileSync(path.join(componentsDir, 'Badges', 'SeverityBadge.tsx'), `
import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Severity = "information" | "review" | "warning" | "high_risk";

export function SeverityBadge({ severity, className }: { severity: Severity, className?: string }) {
  const config = {
    information: { icon: Info, text: "Information", classes: "bg-blue-50 text-blue-700 border-blue-200" },
    review: { icon: CheckCircle, text: "Review", classes: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    warning: { icon: AlertTriangle, text: "Warning", classes: "bg-orange-50 text-orange-700 border-orange-200" },
    high_risk: { icon: AlertCircle, text: "High Risk", classes: "bg-red-50 text-red-700 border-red-200" },
  };
  const Cfg = config[severity];
  const Icon = Cfg.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", Cfg.classes, className)}>
      <Icon size={14} />
      {Cfg.text}
    </span>
  );
}
`);

// Write EmptyState.tsx
fs.writeFileSync(path.join(componentsDir, 'EmptyState.tsx'), `
import React from 'react';

export function EmptyState({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
      <div className="text-gray-400 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm">{description}</p>
    </div>
  );
}
`);

// Write AppShell.tsx
fs.writeFileSync(path.join(componentsDir, 'AppShell.tsx'), `
import React, { useState } from 'react';
import { Shield, LayoutDashboard, Camera, Upload, Clipboard, Settings, Activity, Cloud } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  isCloudActive: boolean;
}

export function AppShell({ children, activeTab, onNavigate, isCloudActive }: AppShellProps) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Shield className="w-6 h-6" /> ALCATRAZ AI
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium tracking-wide uppercase">Verify before you act</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem active={activeTab === 'dashboard'} onClick={() => onNavigate('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem active={activeTab === 'analyze'} onClick={() => onNavigate('analyze')} icon={<Camera size={18} />} label="Analyze Screen" />
          <NavItem active={activeTab === 'upload'} onClick={() => onNavigate('upload')} icon={<Upload size={18} />} label="Upload Documents" />
          <NavItem active={activeTab === 'paste'} onClick={() => onNavigate('paste')} icon={<Clipboard size={18} />} label="Paste Information" />
          <div className="h-4" />
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</div>
          <NavItem active={activeTab === 'benchmarks'} onClick={() => onNavigate('benchmarks')} icon={<Activity size={18} />} label="Benchmarks" />
          <NavItem active={activeTab === 'settings'} onClick={() => onNavigate('settings')} icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
            {isCloudActive ? (
              <Cloud size={16} className="text-blue-600" aria-label="Cloud processing active" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-green-500" aria-label="Local processing active" />
            )}
            <span className="text-sm font-semibold">
              {isCloudActive ? 'Cloud AI Active' : 'Local AI Active'}
            </span>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 \${
        active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }\`}
    >
      {icon}
      {label}
    </button>
  );
}
`);

// Write Settings.tsx
fs.writeFileSync(path.join(pagesDir, 'Settings.tsx'), `
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
`);

// Write Dashboard.tsx updates
fs.writeFileSync(path.join(pagesDir, 'Dashboard.tsx'), `
import React from 'react';
import { Camera, Upload, Clipboard, PlayCircle } from 'lucide-react';
import { SeverityBadge } from '../components/Badges/SeverityBadge';

export function DashboardPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold mb-6">What do you want to verify?</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <ActionCard icon={<Camera size={24} />} title="Analyze Screen" description="Select a region of your screen to cross-check." onClick={() => onNavigate('analyze')} />
        <ActionCard icon={<Upload size={24} />} title="Upload Documents" description="Compare PDFs, images, and files." onClick={() => onNavigate('upload')} />
        <ActionCard icon={<Clipboard size={24} />} title="Paste Information" description="Verify copied text and links." onClick={() => onNavigate('paste')} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Demo Scenarios (Synthetic Data)</h2>
      </div>
      
      <div className="space-y-3">
        <DemoCard severity="high_risk" title="Application Consistency" description="Resume vs Application vs Job Requirement" onRun={() => console.log('Run Demo 1')} />
        <DemoCard severity="warning" title="Invoice / Payment Verification" description="Invoice PDF vs Payment Screen" onRun={() => console.log('Run Demo 2')} />
        <DemoCard severity="review" title="Email / Website Risk" description="Suspicious Email vs Claimed Domain" onRun={() => console.log('Run Demo 3')} />
      </div>
    </div>
  );
}

function ActionCard({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group focus:outline-none focus:ring-2 focus:ring-gray-900">
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-700 group-hover:bg-gray-900 group-hover:text-white transition-colors mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-1 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  );
}

function DemoCard({ severity, title, description, onRun }: { severity: any, title: string, description: string, onRun: () => void }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <SeverityBadge severity={severity} />
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button onClick={onRun} className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 text-sm font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors">
        <PlayCircle size={16} /> Run Demo
      </button>
    </div>
  );
}
`);

// Write App.tsx to route to the new pages
fs.writeFileSync(path.join(srcDir, 'App.tsx'), `
import React, { useState } from 'react';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/Dashboard';
import { SettingsPage } from './pages/Settings';
import { EmptyState } from './components/EmptyState';
import { Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCloud, setIsCloud] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPage onNavigate={setActiveTab} />;
      case 'settings': return <SettingsPage isCloud={isCloud} setIsCloud={setIsCloud} />;
      case 'benchmarks': return (
        <div className="p-8 max-w-5xl mx-auto"><h1 className="text-2xl font-bold mb-6">Benchmarks</h1>
        <EmptyState icon={<Activity size={32}/>} title="No benchmarks recorded" description="Snapdragon NPU benchmarks will appear here once executed on supported hardware." />
        </div>
      );
      default: return (
        <div className="p-8 max-w-5xl mx-auto"><h1 className="text-2xl font-bold mb-6 capitalize">{activeTab.replace('-', ' ')}</h1>
        <EmptyState icon={<Activity size={32}/>} title="Workflow not implemented" description="This workflow will be available in subsequent phases." />
        </div>
      );
    }
  };

  return (
    <AppShell activeTab={activeTab} onNavigate={setActiveTab} isCloudActive={isCloud}>
      {renderContent()}
    </AppShell>
  );
}
`);

console.log('Scaffolding Phase 1 components complete.');
