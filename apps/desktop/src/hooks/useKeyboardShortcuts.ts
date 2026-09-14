import { useEffect, useState } from 'react';

export function useKeyboardShortcuts(onNavigate: (tab: string) => void) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        onNavigate('upload');
      } else if (e.ctrlKey && e.shiftKey && e.code === 'KeyV') {
        e.preventDefault();
        onNavigate('paste');
      } else if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        onNavigate('demo1');
      } else if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        onNavigate('demo2');
      } else if (e.ctrlKey && e.key === '3') {
        e.preventDefault();
        onNavigate('demo3');
      } else if (e.key === 'Escape') {
        setIsHelpOpen(false);
        onNavigate('dashboard');
      } else if (e.key === '?') {
        setIsHelpOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  return { isHelpOpen, setIsHelpOpen };
}
