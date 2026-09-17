import React, { useState } from 'react';
import { Shield, Activity, Brain, CheckCircle, AlertTriangle, Clock, BarChart3, Zap } from 'lucide-react';

export function ThreatDashboard() {
  const [stats] = useState({
    scansToday: 47,
    threatsBlocked: 12,
    avgConfidence: 94.2,
    modelStatus: 'Online'
  });

  const [activities] = useState([
    { id: 1, type: 'Phishing Attempt', time: '10 mins ago', severity: 'High', status: 'Blocked', source: 'Suspicious Email' },
    { id: 2, type: 'Malware Signature', time: '1 hour ago', severity: 'Critical', status: 'Quarantined', source: 'Download Directory' },
    { id: 3, type: 'Anomalous Login', time: '3 hours ago', severity: 'Medium', status: 'Investigating', source: 'Auth Service' },
    { id: 4, type: 'Data Exfiltration', time: '5 hours ago', severity: 'Critical', status: 'Blocked', source: 'Network Outbound' }
  ]);

  const [performance] = useState([
    { metric: 'Accuracy', value: 97.2 },
    { metric: 'Precision', value: 96.8 },
    { metric: 'Recall', value: 97.6 },
    { metric: 'F1 Score', value: 97.2 }
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-950 min-h-screen font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-300 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Shield size={32} className="text-gray-900 dark:text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">Global Threat Intelligence</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tactical Overview & Neural Engine Status</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold text-gray-800 dark:text-green-500 uppercase tracking-wider">Secure Connection</span>
        </div>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Activity size={24} />} label="Scans Today" value={stats.scansToday} trend="+12% from yesterday" color="text-blue-600 dark:text-blue-400" />
        <StatCard icon={<AlertTriangle size={24} />} label="Threats Blocked" value={stats.threatsBlocked} trend="-3% from yesterday" color="text-red-600 dark:text-red-400" />
        <StatCard icon={<Brain size={24} />} label="Avg Confidence" value={`${stats.avgConfidence}%`} trend="+0.5% optimization" color="text-purple-600 dark:text-purple-400" />
        <StatCard icon={<CheckCircle size={24} />} label="Model Status" value={stats.modelStatus} trend="Latency: 12ms" color="text-green-600 dark:text-green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Threat Activity Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">
            <Clock size={20} className="text-gray-900 dark:text-white" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">Recent Threat Activity</h2>
          </div>
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-6 pb-2">
                {/* Timeline line */}
                {index !== activities.length - 1 && (
                  <div className="absolute top-6 left-2 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
                )}
                {/* Timeline node */}
                <div className={`absolute top-1.5 left-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
                  activity.severity === 'Critical' ? 'bg-red-500' :
                  activity.severity === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                }`}></div>
                
                <div className="bg-gray-50 dark:bg-gray-950/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{activity.type}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Source: <span className="font-semibold">{activity.source}</span></span>
                    <span className="text-gray-600 dark:text-gray-400">Status: <span className={`font-semibold ${
                      activity.status === 'Blocked' || activity.status === 'Quarantined' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                    }`}>{activity.status}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Performance */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">
            <BarChart3 size={20} className="text-gray-900 dark:text-white" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">Model Performance</h2>
          </div>
          
          <div className="flex-1 space-y-6 flex flex-col justify-center">
            {performance.map((metric) => (
              <div key={metric.metric}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{metric.metric}</span>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">{metric.value}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg flex items-start gap-3">
            <Zap size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Neural Engine Optimized</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400/80 mt-1">Latest weights deployed. Processing efficiency increased by 14%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: { icon: React.ReactNode, label: string, value: string | number, trend: string, color: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-5 dark:opacity-10 transition-transform group-hover:scale-110">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 100 })}
      </div>
      <div className={`mb-3 ${color}`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 font-mono">{value}</div>
      <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</div>
      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">{trend}</div>
    </div>
  );
}
