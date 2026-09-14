import React, { useEffect, useState, useRef } from 'react';
import { Terminal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DeveloperConsole({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLog = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setLogs(prev => [...prev, customEvent.detail]);
    };

    window.addEventListener('alcatraz-log', handleLog);
    return () => window.removeEventListener('alcatraz-log', handleLog);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-96 bg-gray-950 text-green-400 font-mono text-xs shadow-2xl border-l border-gray-800 z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 text-gray-400">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Terminal size={16} /> ALCATRAZ DEV CONSOLE
            </div>
            <button onClick={onClose} className="hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <div className="text-gray-500 mb-4">
              // Explainable AI (XAI) Log Stream
              <br/>// Real-time engine reasoning output
            </div>
            {logs.map((log, i) => (
              <div key={i} className="opacity-90">
                <span className="text-gray-500 mr-2">{new Date().toISOString().split('T')[1].slice(0, -1)}</span>
                <span className={log.includes('Engine') ? 'text-blue-400' : 'text-green-400'}>{log}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
