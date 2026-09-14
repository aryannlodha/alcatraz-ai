import React, { useRef } from 'react';
import { Finding, Fact } from '@alcatraz/contracts';
import { FileText, AlertTriangle, CheckCircle, Info, Download, Volume2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportData {
  scenario: string;
  facts: Fact[];
  findings: Finding[];
  timestamp: string;
}

function severityColor(s: string): string {
  switch (s) {
    case 'high_risk': return '#dc2626';
    case 'warning': return '#f59e0b';
    case 'review': return '#3b82f6';
    default: return '#6b7280';
  }
}

export function ExportButton({ scenario, facts, findings }: { scenario: string; facts: Fact[]; findings: Finding[] }) {
  const [isExporting, setIsExporting] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleReadAloud = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    let text = `Verification report for ${scenario}. `;
    if (findings.length === 0) {
      text += "No inconsistencies detected. All facts match.";
    } else {
      text += `${findings.length} findings detected. `;
      findings.forEach((f, i) => {
        text += `Finding ${i + 1}: ${f.type.replace('_', ' ')}. ${f.explanation}. `;
      });
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Create a temporary hidden div for the report to render into
      const reportDiv = document.createElement('div');
      reportDiv.style.position = 'absolute';
      reportDiv.style.left = '-9999px';
      reportDiv.style.top = '0';
      reportDiv.style.width = '800px';
      reportDiv.style.backgroundColor = '#ffffff';
      reportDiv.style.padding = '40px';
      reportDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      const findingsHTML = findings.length > 0 ? findings.map(f => {
        const relFacts = facts.filter(fact => f.factIds.includes(fact.id));
        return `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; border-left: 4px solid ${severityColor(f.severity)}">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="background: ${severityColor(f.severity)}20; color: ${severityColor(f.severity)}; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${f.severity.replace('_', ' ')}</span>
              <span style="font-weight: 700; text-transform: uppercase; font-size: 13px;">${f.type.replace('_', ' ')} DETECTED</span>
            </div>
            <p style="color: #111; font-size: 14px; margin-bottom: 12px;">${f.explanation}</p>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px;">
              <p style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 8px;">Source Evidence</p>
              ${relFacts.map(fact => `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 4px 0;">
                  <span style="color: #374151;">${fact.sourceId}</span>
                  <code style="background: #fff; border: 1px solid #e5e7eb; padding: 2px 8px; border-radius: 4px;">${fact.attribute}: ${fact.value}</code>
                </div>
              `).join('')}
            </div>
          </div>`;
      }).join('') : '<p style="color: #6b7280; text-align: center; padding: 32px;">No inconsistencies detected.</p>';

      reportDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #111;">
          <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #000;">🛡️ ALCATRAZ AI</h1>
          <p style="font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Verification Report</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
            <p style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase;">Scenario</p>
            <p style="font-size: 16px; font-weight: 600; margin-top: 4px; color: #000;">${scenario}</p>
          </div>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
            <p style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase;">Generated</p>
            <p style="font-size: 16px; font-weight: 600; margin-top: 4px; color: #000;">${new Date().toLocaleString()}</p>
          </div>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
            <p style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase;">Facts Analyzed</p>
            <p style="font-size: 16px; font-weight: 600; margin-top: 4px; color: #000;">${facts.length}</p>
          </div>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
            <p style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase;">Findings</p>
            <p style="font-size: 16px; font-weight: 600; margin-top: 4px; color: #000;">${findings.length}</p>
          </div>
        </div>

        <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #000;">Findings</h2>
        ${findingsHTML}
        
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="font-size: 12px; color: #9ca3af;">Generated by Alcatraz AI — "Verify before you act."</p>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 4px;">All processing performed locally on-device. No data was uploaded to external servers.</p>
        </div>
      `;
      
      document.body.appendChild(reportDiv);
      
      const canvas = await html2canvas(reportDiv, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      document.body.removeChild(reportDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`alcatraz-report-${Date.now()}.pdf`);
      
    } catch (err) {
      console.error('Failed to generate PDF', err);
      // Fallback to old behavior if PDF generation fails
      alert('Failed to generate PDF. Check console.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleReadAloud}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Volume2 size={16} /> {isPlaying ? 'Stop Reading' : 'Read Aloud'}
      </button>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        <Download size={16} /> {isExporting ? 'Generating PDF...' : 'Export PDF Report'}
      </button>
    </div>
  );
}
