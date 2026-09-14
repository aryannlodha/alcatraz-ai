import React, { useState } from 'react';
import { ChevronRight, Shield, Cpu, Scale, User, X } from 'lucide-react';

const SLIDES = [
  {
    icon: <Shield size={48} className="text-gray-900 dark:text-white" />,
    title: 'Welcome to Alcatraz AI',
    subtitle: '"Verify before you act."',
    description: 'Alcatraz AI is a privacy-first verification layer. It cross-checks multiple digital sources and alerts you to inconsistencies before you submit, send, pay, or act.',
  },
  {
    icon: <Cpu size={48} className="text-gray-900 dark:text-white" />,
    title: 'AI Extracts. Rules Compare.',
    subtitle: 'Deterministic verification, not guesswork.',
    description: 'AI models extract structured facts from your documents and emails. Then, deterministic code — not AI — compares those facts and flags contradictions with source evidence.',
  },
  {
    icon: <User size={48} className="text-gray-900 dark:text-white" />,
    title: 'You Make Every Decision.',
    subtitle: 'Alcatraz never acts on your behalf.',
    description: 'We never submit forms, send emails, or make payments. We show you the evidence and let you decide. Your data is processed locally and deleted after analysis.',
  },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [slide, setSlide] = useState(0);

  const next = () => {
    if (slide < SLIDES.length - 1) {
      setSlide(s => s + 1);
    } else {
      localStorage.setItem('alcatraz-onboarded', 'true');
      onComplete();
    }
  };

  const skip = () => {
    localStorage.setItem('alcatraz-onboarded', 'true');
    onComplete();
  };

  const current = SLIDES[slide];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="flex justify-end p-4">
          <button onClick={skip} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="px-12 pb-12 pt-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-8">
            {current.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{current.title}</h2>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{current.subtitle}</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-10">{current.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === slide ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'}`}
                />
              ))}
            </div>
            
            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              {slide < SLIDES.length - 1 ? 'Next' : 'Get Started'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('alcatraz-onboarded');
  });

  return {
    showOnboarding,
    completeOnboarding: () => setShowOnboarding(false),
  };
}
