import React, { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { PlayCircle } from 'lucide-react';

export function TourGuide() {
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    return localStorage.getItem('alcatraz-tour-seen') === 'true';
  });

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '#tour-dashboard',
          popover: {
            title: 'Dashboard',
            description: 'Start your verification from here by choosing a scenario or uploading a new file.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#tour-analyze-btn',
          popover: {
            title: 'Live Analysis',
            description: 'This is where you upload documents or paste text to be verified dynamically by our AI pipeline.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#tour-privacy-badge',
          popover: {
            title: 'Privacy Guarantee',
            description: 'Watch this badge. It guarantees that your data never leaves your device unless you explicitly allow cloud fallback.',
            side: 'top',
            align: 'start'
          }
        },
        {
          popover: {
            title: 'Ready to Verify',
            description: 'Click on one of the Demo scenarios in the dashboard to see the deterministic engine in action!'
          }
        }
      ]
    });
    
    driverObj.drive();
    localStorage.setItem('alcatraz-tour-seen', 'true');
    setHasSeenTour(true);
  };

  return (
    <button
      onClick={startTour}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
    >
      <PlayCircle size={14} /> {hasSeenTour ? 'Replay Tour' : 'Start Tour'}
    </button>
  );
}
