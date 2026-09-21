import React, { useState } from 'react';
import { Mail, Shield, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

export function EmailHeaderAnalyzer() {
  const [headers, setHeaders] = useState('');
  const [results, setResults] = useState<any>(null);

  const parseHeaders = () => {
    if (!headers.trim()) return;
    
    // Extract basic fields
    const getField = (name: string) => {
      const match = headers.match(new RegExp(`^${name}:\\s*(.+)$`, 'im'));
      return match ? match[1].trim() : 'Missing';
    };

    const from = getField('From');
    const to = getField('To');
    const subject = getField('Subject');
    const date = getField('Date');
    const returnPath = getField('Return-Path');
    const xMailer = getField('X-Mailer');

    // Extract received chain
    const receivedRegex = /^Received:\s*(.+?(?:\n\s+.+?)*)/gm;
    const receivedChain = [];
    let match;
    while ((match = receivedRegex.exec(headers)) !== null) {
      receivedChain.push(match[1].replace(/\n\s+/g, ' ').trim());
    }

    // Extract auth results
    const authResultsMatch = headers.match(/^Authentication-Results:\s*(.+?(?:\n\s+.+?)*)/im);
    const authResults = authResultsMatch ? authResultsMatch[1].replace(/\n\s+/g, ' ') : '';
    
    const extractAuth = (mech: string) => {
      if (!authResults) return 'none';
      const regex = new RegExp(`\\b${mech}=([^\\s;]+)`);
      const m = authResults.match(regex);
      return m ? m[1].toLowerCase() : 'none';
    };

    const spf = extractAuth('spf');
    const dkim = extractAuth('dkim');
    const dmarc = extractAuth('dmarc');

    // Determine risk
    let risk = 'Low';
    if (spf === 'fail' || dkim === 'fail' || spf === 'softfail') {
      risk = 'High';
    } else if (spf === 'none' || dkim === 'none' || spf === 'missing' || dkim === 'missing') {
      risk = 'Medium';
    }

    setResults({
      from, to, subject, date, returnPath, xMailer, receivedChain, spf, dkim, dmarc, risk
    });
  };

  const renderStatusIcon = (status: string) => {
    if (status === 'pass') return <CheckCircle className="text-green-500" size={16} />;
    if (status === 'fail' || status === 'softfail') return <XCircle className="text-red-500" size={16} />;
    return <AlertTriangle className="text-yellow-500" size={16} />;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Header Analyzer</h1>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Paste Raw Email Headers
        </label>
        <textarea
          className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 dark:text-gray-300 mb-4"
          placeholder="Return-Path: <sender@example.com>&#10;Received: from...&#10;Authentication-Results: spf=pass...&#10;From: Sender <sender@example.com>"
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
        />
        <button
          onClick={parseHeaders}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Shield size={18} /> Parse Headers
        </button>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
              Basic Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 dark:text-gray-400">From</span><span className="col-span-2 font-medium dark:text-gray-200">{results.from}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 dark:text-gray-400">To</span><span className="col-span-2 font-medium dark:text-gray-200">{results.to}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 dark:text-gray-400">Subject</span><span className="col-span-2 font-medium dark:text-gray-200">{results.subject}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 dark:text-gray-400">Date</span><span className="col-span-2 font-medium dark:text-gray-200">{results.date}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 dark:text-gray-400">Return-Path</span><span className="col-span-2 font-medium dark:text-gray-200">{results.returnPath}</span></div>
              <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 dark:text-gray-400">X-Mailer</span><span className="col-span-2 font-medium dark:text-gray-200">{results.xMailer}</span></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-800 pb-2 flex justify-between items-center">
              Authentication Results
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                results.risk === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                results.risk === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {results.risk} Risk
              </span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">SPF</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm uppercase font-semibold text-gray-600 dark:text-gray-400">{results.spf}</span>
                  {renderStatusIcon(results.spf)}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">DKIM</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm uppercase font-semibold text-gray-600 dark:text-gray-400">{results.dkim}</span>
                  {renderStatusIcon(results.dkim)}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">DMARC</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm uppercase font-semibold text-gray-600 dark:text-gray-400">{results.dmarc}</span>
                  {renderStatusIcon(results.dmarc)}
                </div>
              </div>
            </div>
          </div>

          {results.receivedChain.length > 0 && (
            <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-800 pb-2 flex items-center gap-2">
                <Clock size={18} className="text-gray-500" /> Received Chain
              </h2>
              <div className="space-y-3">
                {results.receivedChain.map((chain: string, idx: number) => (
                  <div key={idx} className="text-xs font-mono p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded text-gray-600 dark:text-gray-400 break-words">
                    <span className="text-blue-500 font-bold mr-2">{idx + 1}.</span>
                    {chain}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
