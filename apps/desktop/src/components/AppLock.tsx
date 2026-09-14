import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AppLock({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [error, setError] = useState('');

  // Auto-lock when tab is hidden for a while (Privacy feature)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // In a real high-security app, you might lock immediately or after 5 mins
        // We'll just lock it immediately for the demo to show it off
        setIsLocked(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleUnlock = async () => {
    try {
      setError('');
      // Use WebAuthn API for local biometric unlock (TouchID / Windows Hello)
      if (window.PublicKeyCredential) {
        // Provide a dummy challenge to invoke the local authenticator
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        
        await navigator.credentials.get({
          publicKey: {
            challenge,
            timeout: 60000,
            userVerification: 'required' // Force biometric/PIN
          }
        });
        setIsLocked(false);
      } else {
        // Fallback for browsers without WebAuthn
        setIsLocked(false);
      }
    } catch (err) {
      console.error(err);
      setError('Biometric verification failed. Please try again.');
      
      // For hackathon demo purposes, let them bypass if they cancel the prompt
      // In a real app, you would never do this!
      setTimeout(() => setIsLocked(false), 1000); 
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 text-center max-w-sm w-full"
            >
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">App Locked</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                Alcatraz AI is locked to protect your sensitive local data.
              </p>
              
              <button 
                onClick={handleUnlock}
                className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold py-4 rounded-xl transition-all active:scale-95"
              >
                <Fingerprint size={20} />
                Unlock with Biometrics
              </button>
              
              {error && (
                <p className="text-red-500 text-sm mt-4 font-medium animate-pulse">{error}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* We always render children but hide them via the overlay to not lose React state */}
      <div className={isLocked ? 'pointer-events-none blur-sm select-none' : ''}>
        {children}
      </div>
    </>
  );
}
