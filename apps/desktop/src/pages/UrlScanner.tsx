import React, { useState } from 'react';
import { Globe, Shield, ShieldAlert, ShieldCheck, AlertTriangle, Search, ExternalLink, Lock, Clock, Server } from 'lucide-react';

// Known phishing TLDs and suspicious patterns
const SUSPICIOUS_TLDS = ['.xyz', '.top', '.buzz', '.click', '.link', '.info', '.gq', '.ml', '.tk', '.cf', '.ga', '.work', '.loan'];
const PHISHING_KEYWORDS = ['login', 'verify', 'secure', 'account', 'update', 'confirm', 'banking', 'paypal', 'signin', 'password', 'credential'];
const LEGIT_DOMAINS = ['google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'paypal.com', 'github.com', 'facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'youtube.com', 'netflix.com', 'spotify.com', 'adobe.com', 'dropbox.com'];

interface ScanResult {
  url: string;
  domain: string;
  protocol: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  flags: { label: string; severity: 'safe' | 'warning' | 'danger'; detail: string }[];
}

function analyzeUrl(rawUrl: string): ScanResult | null {
  try {
    let url = rawUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    const parsed = new URL(url);
    const domain = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();
    const flags: ScanResult['flags'] = [];
    let riskScore = 0;

    // Check protocol
    if (parsed.protocol === 'https:') {
      flags.push({ label: 'HTTPS', severity: 'safe', detail: 'Connection is encrypted (TLS/SSL)' });
    } else {
      flags.push({ label: 'No HTTPS', severity: 'danger', detail: 'Connection is NOT encrypted. Data can be intercepted.' });
      riskScore += 30;
    }

    // Check for IP address instead of domain
    if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
      flags.push({ label: 'IP Address', severity: 'danger', detail: 'URL uses a raw IP address instead of a domain name. Highly suspicious.' });
      riskScore += 40;
    }

    // Check TLD
    const tld = '.' + domain.split('.').pop();
    if (SUSPICIOUS_TLDS.includes(tld)) {
      flags.push({ label: 'Suspicious TLD', severity: 'warning', detail: `The TLD "${tld}" is commonly used in phishing campaigns.` });
      riskScore += 20;
    }

    // Check for lookalike domains (e.g., paypa1.com, g00gle.com)
    const lookalike = domain.replace(/1/g, 'l').replace(/0/g, 'o').replace(/5/g, 's');
    const isLookalike = lookalike !== domain && LEGIT_DOMAINS.some(d => lookalike.includes(d.split('.')[0]));
    if (isLookalike) {
      flags.push({ label: 'Lookalike Domain', severity: 'danger', detail: `This domain appears to impersonate a legitimate website using character substitution.` });
      riskScore += 40;
    }

    // Check for excessive subdomains
    const subdomainCount = domain.split('.').length - 2;
    if (subdomainCount >= 3) {
      flags.push({ label: 'Excessive Subdomains', severity: 'warning', detail: `${subdomainCount} subdomains detected. Phishing sites often use deep subdomains to hide the real domain.` });
      riskScore += 15;
    }

    // Check path for phishing keywords
    const pathKeywords = PHISHING_KEYWORDS.filter(kw => path.includes(kw));
    if (pathKeywords.length > 0) {
      flags.push({ label: 'Suspicious Path', severity: 'warning', detail: `URL path contains keywords: ${pathKeywords.join(', ')}` });
      riskScore += 10 * pathKeywords.length;
    }

    // Check for long URL (common in phishing)
    if (url.length > 100) {
      flags.push({ label: 'Very Long URL', severity: 'warning', detail: `URL is ${url.length} characters. Unusually long URLs can hide malicious destinations.` });
      riskScore += 10;
    }

    // Check for @ sign in URL
    if (url.includes('@')) {
      flags.push({ label: '@ in URL', severity: 'danger', detail: 'The "@" symbol in a URL can trick browsers into connecting to a different server.' });
      riskScore += 35;
    }

    // Known safe
    if (LEGIT_DOMAINS.includes(domain) || LEGIT_DOMAINS.some(d => domain.endsWith('.' + d))) {
      flags.push({ label: 'Known Domain', severity: 'safe', detail: 'This domain is a well-known, trusted website.' });
      riskScore = Math.max(0, riskScore - 30);
    }

    // Domain age simulation (would be real API in production)
    if (riskScore === 0) {
      flags.push({ label: 'No Issues Found', severity: 'safe', detail: 'No suspicious indicators detected in this URL.' });
    }

    riskScore = Math.min(100, riskScore);
    const riskLevel: ScanResult['riskLevel'] = riskScore >= 50 ? 'high' : riskScore >= 20 ? 'medium' : 'low';

    return { url, domain, protocol: parsed.protocol, riskLevel, riskScore, flags };
  } catch {
    return null;
  }
}

export function UrlScanner() {
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = () => {
    setError(null);
    if (!inputUrl.trim()) {
      setError('Please enter a URL to scan.');
      return;
    }
    const res = analyzeUrl(inputUrl);
    if (!res) {
      setError('Invalid URL. Please enter a valid web address.');
      return;
    }
    setResult(res);
  };

  const riskColors = {
    low: { bg: 'bg-green-50 dark:bg-green-950/20', border: 'border-green-200 dark:border-green-900/50', text: 'text-green-700 dark:text-green-400', bar: 'bg-green-500' },
    medium: { bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-900/50', text: 'text-amber-700 dark:text-amber-400', bar: 'bg-amber-500' },
    high: { bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-900/50', text: 'text-red-700 dark:text-red-400', bar: 'bg-red-500' },
  };

  const severityIcon = { safe: <ShieldCheck size={16} className="text-green-500" />, warning: <AlertTriangle size={16} className="text-amber-500" />, danger: <ShieldAlert size={16} className="text-red-500" /> };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">URL Threat Scanner</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Paste a URL to analyze it for phishing indicators, lookalike domains, and suspicious patterns. All checks run locally.
      </p>

      {/* URL Input */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => { setInputUrl(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            placeholder="https://example.com/login"
            className="w-full pl-11 pr-4 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
        <button
          onClick={handleScan}
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg"
        >
          <Search size={16} /> Scan
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg mb-6 border border-red-200 dark:border-red-900/40">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Risk Score Card */}
          <div className={`p-6 rounded-xl border ${riskColors[result.riskLevel].bg} ${riskColors[result.riskLevel].border}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {result.riskLevel === 'low' ? <ShieldCheck size={28} className="text-green-500" /> : result.riskLevel === 'medium' ? <AlertTriangle size={28} className="text-amber-500" /> : <ShieldAlert size={28} className="text-red-500" />}
                <div>
                  <h2 className={`text-xl font-bold ${riskColors[result.riskLevel].text}`}>
                    {result.riskLevel === 'low' ? 'Low Risk' : result.riskLevel === 'medium' ? 'Medium Risk' : 'High Risk — Likely Phishing'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">{result.domain}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-extrabold ${riskColors[result.riskLevel].text}`}>{result.riskScore}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Risk Score</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className={`h-2 rounded-full transition-all ${riskColors[result.riskLevel].bar}`} style={{ width: `${result.riskScore}%` }}></div>
            </div>
          </div>

          {/* Detailed Flags */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Scan Results ({result.flags.length} checks)</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {result.flags.map((flag, i) => (
                <div key={i} className="p-4 flex items-start gap-3">
                  {severityIcon[flag.severity]}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{flag.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{flag.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* URL Details */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">URL Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Lock size={14} /> Protocol: <span className="font-bold text-gray-900 dark:text-white">{result.protocol.replace(':', '')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Server size={14} /> Domain: <span className="font-bold text-gray-900 dark:text-white">{result.domain}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <ExternalLink size={14} /> Length: <span className="font-bold text-gray-900 dark:text-white">{result.url.length} chars</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Clock size={14} /> Scanned: <span className="font-bold text-gray-900 dark:text-white">Just now</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Example URLs */}
      {!result && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Try these examples</h3>
          <div className="space-y-2">
            {[
              { url: 'https://google.com', desc: 'Safe — well-known domain' },
              { url: 'https://paypa1-secure.com/login/verify', desc: 'Phishing — lookalike domain + suspicious path' },
              { url: 'http://192.168.1.1/admin/login', desc: 'Suspicious — raw IP, no HTTPS' },
              { url: 'https://my.super.deep.subdomain.example.xyz/confirm', desc: 'Warning — excessive subdomains + suspicious TLD' },
            ].map((ex, i) => (
              <button
                key={i}
                onClick={() => { setInputUrl(ex.url); setResult(null); }}
                className="w-full text-left px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex items-center justify-between"
              >
                <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{ex.url}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{ex.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
