import { UploadScreen } from './pages/UploadScreen';
import { PasteScreen } from './pages/PasteScreen';
import { AnalyzeScreen } from './pages/AnalyzeScreen';

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
      case 'analyze': return <AnalyzeScreen scenario="blank" />;
      case 'upload': return <UploadScreen onAnalyze={() => setActiveTab('analyze')} />;
      case 'paste': return <PasteScreen onAnalyze={() => setActiveTab('analyze')} />;
      case 'demo1': return <AnalyzeScreen scenario="demo1" />;
      case 'demo2': return <AnalyzeScreen scenario="demo2" />;
      case 'demo3': return <AnalyzeScreen scenario="demo3" />;
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
