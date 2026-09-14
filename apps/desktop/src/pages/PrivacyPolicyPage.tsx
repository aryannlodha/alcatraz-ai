import React from 'react';
import { ShieldCheck, Lock, Eye, Trash2, Server, HardDrive } from 'lucide-react';

export function PrivacyPolicyPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        Alcatraz AI is built privacy-first. Here is exactly what happens with your data.
      </p>

      <div className="space-y-6">
        <PolicySection
          icon={<HardDrive size={20} />}
          title="Local Processing by Default"
          description="All document analysis, OCR, fact extraction, and rule evaluation happens entirely on your device. When local processing is enabled, zero bytes are transmitted to any external server."
        />
        <PolicySection
          icon={<Trash2 size={20} />}
          title="Automatic Data Deletion"
          description="Uploaded files (PDFs, images) are held only in browser memory during analysis. They are never written to disk and are garbage-collected immediately after the analysis completes. No raw files are ever persisted."
        />
        <PolicySection
          icon={<Eye size={20} />}
          title="What We Store"
          description="If you enable 'Save analysis history' in Settings, we store only the structured facts and findings (not raw files) in your browser's localStorage. This data never leaves your device. You can clear it at any time."
        />
        <PolicySection
          icon={<Lock size={20} />}
          title="What We Never Do"
          items={[
            'We never submit forms, send emails, or make payments on your behalf.',
            'We never continuously capture your screen without explicit action.',
            'We never upload documents to cloud servers unless you explicitly enable cloud fallback.',
            'We never share, sell, or transmit your data to third parties.',
            'We never store passwords, credentials, or financial account numbers.',
          ]}
        />
        <PolicySection
          icon={<Server size={20} />}
          title="Cloud Fallback (Optional)"
          description="If you explicitly enable 'Allow cloud fallback' in Settings, some extraction tasks may use external AI APIs. Before any cloud request, we display a clear warning. Cloud fallback is disabled by default."
        />
        <PolicySection
          icon={<ShieldCheck size={20} />}
          title="Open Source & Auditable"
          description="Alcatraz AI is fully open-source. You can audit every line of code to verify these privacy commitments. We believe trust requires transparency."
        />
      </div>
    </div>
  );
}

function PolicySection({ icon, title, description, items }: { 
  icon: React.ReactNode; 
  title: string; 
  description?: string; 
  items?: string[] 
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-gray-700 dark:text-gray-300">{icon}</div>
        <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      )}
      {items && (
        <ul className="space-y-2 mt-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
              <span className="text-red-500 mt-1">✕</span> {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
