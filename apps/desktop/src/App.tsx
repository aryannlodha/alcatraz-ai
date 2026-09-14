import { UploadScreen } from './pages/UploadScreen';
import { PasteScreen } from './pages/PasteScreen';
import { AnalyzeScreen } from './pages/AnalyzeScreen';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { HistoryPage } from './pages/HistoryPage';

import React, { useState } from 'react';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/Dashboard';
import { SettingsPage } from './pages/Settings';
import { EmptyState } from './components/EmptyState';
import { Onboarding, useOnboarding } from './components/Onboarding';
import { ToastProvider } from './components/Toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { Activity } from 'lucide-react';
import { AppLock } from './components/AppLock';
import { AudioScanner } from './pages/AudioScanner';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCloud, setIsCloud] = useState(false);
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const { isHelpOpen, setIsHelpOpen } = useKeyboardShortcuts(setActiveTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPage onNavigate={setActiveTab} />;
      case 'analyze': return <AnalyzeScreen scenario="blank" isCloud={isCloud} />;
      case 'demo1': return <AnalyzeScreen scenario="demo1" isCloud={isCloud} />;
      case 'demo2': return <AnalyzeScreen scenario="demo2" isCloud={isCloud} />;
      case 'demo3': return <AnalyzeScreen scenario="demo3" isCloud={isCloud} />;
      case 'upload': return <UploadScreen onAnalyze={() => setActiveTab('analyze')} />;
      case 'paste': return <PasteScreen onAnalyze={() => setActiveTab('analyze')} />;
      case 'audio': return <AudioScanner />;
      case 'how-it-works': return <HowItWorksPage />;
      case 'history': return <HistoryPage />;
      case 'privacy': return <PrivacyPolicyPage />;
      case 'settings': return <SettingsPage isCloud={isCloud} setIsCloud={setIsCloud} />;
      case 'benchmarks': return (
        <div className="p-8 max-w-5xl mx-auto"><h1 className="text-2xl font-bold mb-6 dark:text-white">Benchmarks</h1>
        <EmptyState icon={<Activity size={32}/>} title="No benchmarks recorded" description="Snapdragon NPU benchmarks will appear here once executed on supported hardware." />
        </div>
      );
      default: return (
        <div className="p-8 max-w-5xl mx-auto"><h1 className="text-2xl font-bold mb-6 capitalize dark:text-white">{activeTab.replace('-', ' ')}</h1>
        <EmptyState icon={<Activity size={32}/>} title="Workflow not implemented" description="This workflow will be available in subsequent phases." />
        </div>
      );
    }
  };

  return (
    <ToastProvider>
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
      {isHelpOpen && <KeyboardShortcutsHelp isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />}
      <AppLock>
        <AppShell activeTab={activeTab} onNavigate={setActiveTab} isCloudActive={isCloud}>
          {renderContent()}
        </AppShell>
      </AppLock>
    </ToastProvider>
  );
}
