import React, { useState, useEffect } from 'react';
import { getHistory, clearHistory, HistoryItem } from '../utils/history';

export function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <p className="text-lg">No analysis history found.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis History</h1>
        <button 
          onClick={handleClear}
          className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors font-medium text-sm"
        >
          Clear History
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3 font-medium text-sm">Date</th>
              <th className="px-6 py-3 font-medium text-sm">Scenario</th>
              <th className="px-6 py-3 font-medium text-sm">Sources</th>
              <th className="px-6 py-3 font-medium text-sm">Findings</th>
              <th className="px-6 py-3 font-medium text-sm">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100 text-sm">
                <td className="px-6 py-4">{new Date(item.date).toLocaleString()}</td>
                <td className="px-6 py-4">{item.scenario}</td>
                <td className="px-6 py-4">{item.sources}</td>
                <td className="px-6 py-4">{item.findings}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.severity.toLowerCase() === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    item.severity.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {item.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
