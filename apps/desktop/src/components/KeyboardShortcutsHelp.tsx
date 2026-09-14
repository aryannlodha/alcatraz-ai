import React from 'react';

export function KeyboardShortcutsHelp({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + U', desc: 'Navigate to upload' },
    { key: 'Ctrl + Shift + V', desc: 'Navigate to paste' },
    { key: 'Ctrl + 1/2/3', desc: 'Navigate to demo 1, 2, or 3' },
    { key: 'Esc', desc: 'Go to dashboard / close help' },
    { key: '?', desc: 'Toggle this help overlay' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold">&times;</button>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            {shortcuts.map((s, i) => (
              <li key={i} className="flex justify-between text-sm items-center">
                <span className="text-gray-600 dark:text-gray-300">{s.desc}</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded font-mono text-xs font-semibold border border-gray-200 dark:border-gray-600 shadow-sm">{s.key}</kbd>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
