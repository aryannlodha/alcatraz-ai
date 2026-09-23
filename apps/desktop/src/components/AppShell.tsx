
import React, { useState, useEffect } from 'react';
import { Shield, LayoutDashboard, Camera, Upload, Clipboard, Settings, Activity, Cloud, Sun, Moon, BookOpen, History, Lock, TerminalSquare, BarChart3, Mail, Globe } from 'lucide-react';
import { TourGuide } from './TourGuide';
import { DeveloperConsole } from './DeveloperConsole';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  isCloudActive: boolean;
}

export function AppShell({ children, activeTab, onNavigate, isCloudActive }: AppShellProps) {
  const [isDark, setIsDark] = useState(false);
  const [isDevConsoleOpen, setIsDevConsoleOpen] = useState(false);

  useEffect(() => {
    const isDarkStored = localStorage.getItem('alcatraz-theme') === 'dark';
    const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkStored || (!localStorage.getItem('alcatraz-theme') && isDarkSystem)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('alcatraz-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('alcatraz-theme', 'light');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors">
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors">
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <Shield className="w-6 h-6" /> ALCATRAZ AI
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase mb-4">Verify before you act</p>
          <TourGuide />
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto" id="tour-dashboard">
          <NavItem active={activeTab === 'dashboard'} onClick={() => onNavigate('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem active={activeTab === 'threat-dashboard'} onClick={() => onNavigate('threat-dashboard')} icon={<BarChart3 size={18} />} label="Threat Intel" />
          <span id="tour-analyze-btn" className="block">
            <NavItem active={activeTab === 'analyze'} onClick={() => onNavigate('analyze')} icon={<Camera size={18} />} label="Analyze Screen" />
            <NavItem active={activeTab === 'upload'} onClick={() => onNavigate('upload')} icon={<Upload size={18} />} label="Upload Documents" />
            <NavItem active={activeTab === 'paste'} onClick={() => onNavigate('paste')} icon={<Clipboard size={18} />} label="Cross-Check Sources" />
            <NavItem active={activeTab === 'url-scanner'} onClick={() => onNavigate('url-scanner')} icon={<Globe size={18} />} label="URL Scanner" />
            <NavItem active={activeTab === 'email-headers'} onClick={() => onNavigate('email-headers')} icon={<Mail size={18} />} label="Email Headers" />
          </span>
          <div className="h-4" />
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Insights</div>
          <NavItem active={activeTab === 'history'} onClick={() => onNavigate('history')} icon={<History size={18} />} label="Analysis History" />
          <NavItem active={activeTab === 'how-it-works'} onClick={() => onNavigate('how-it-works')} icon={<BookOpen size={18} />} label="How It Works" />
          <div className="h-4" />
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">System</div>
          <NavItem active={activeTab === 'benchmarks'} onClick={() => onNavigate('benchmarks')} icon={<Activity size={18} />} label="Benchmarks" />
          <NavItem active={activeTab === 'privacy'} onClick={() => onNavigate('privacy')} icon={<Lock size={18} />} label="Privacy Policy" />
          <NavItem active={activeTab === 'settings'} onClick={() => onNavigate('settings')} icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <button onClick={() => setIsDevConsoleOpen(true)} className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-900 text-green-400 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400">
            <span className="text-sm font-medium flex items-center gap-2"><TerminalSquare size={16} /> Dev Console</span>
          </button>
          <button onClick={toggleTheme} className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100">
            <span className="text-sm font-medium">Theme</span>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div id="tour-privacy-badge" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors">
            {isCloudActive ? (
              <Cloud size={16} className="text-blue-600 dark:text-blue-400" aria-label="Cloud processing active" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-green-500" aria-label="Local processing active" />
            )}
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
              {isCloudActive ? 'Cloud AI Active' : 'Local AI Active'}
            </span>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 transition-colors">
        {children}
      </main>
      <DeveloperConsole isOpen={isDevConsoleOpen} onClose={() => setIsDevConsoleOpen(false)} />
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 ${
        active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
