
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
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 ${
        active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
