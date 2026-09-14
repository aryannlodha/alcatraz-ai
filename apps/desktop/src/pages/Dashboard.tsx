import React from 'react';
import { Camera, Upload, Clipboard, PlayCircle, FileText, AlertTriangle, Play, CheckCircle, Mic } from 'lucide-react';
import { SeverityBadge } from '../components/Badges/SeverityBadge';

export function DashboardPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold mb-6">What do you want to verify?</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <ActionCard icon={<Camera size={24} />} title="Analyze Screen" description="Select a region of your screen to cross-check." onClick={() => onNavigate('analyze')} />
        <ActionCard icon={<Mic size={24} />} title="Verify Audio" description="Local Whisper Transcription" onClick={() => onNavigate('audio')} />
        <ActionCard icon={<Upload size={24} />} title="Upload Documents" description="Compare PDFs, images, and files." onClick={() => onNavigate('upload')} />
        <ActionCard icon={<Clipboard size={24} />} title="Paste Information" description="Verify copied text and links." onClick={() => onNavigate('paste')} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Demo Scenarios (Synthetic Data)</h2>
      </div>
      
      <div className="space-y-3">
        <DemoCard severity="high_risk" title="Application Consistency" description="Resume vs Application vs Job Requirement" onRun={() => onNavigate('demo1')} />
        <DemoCard severity="warning" title="Invoice / Payment Verification" description="Invoice PDF vs Payment Screen" onRun={() => onNavigate('demo2')} />
        <DemoCard severity="review" title="Email / Website Risk" description="Suspicious Email vs Claimed Domain" onRun={() => onNavigate('demo3')} />
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
