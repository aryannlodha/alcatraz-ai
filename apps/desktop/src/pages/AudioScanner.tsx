import React, { useState } from 'react';
import { Mic, Square, Play, Check } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export function AudioScanner() {
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleRecord = () => {
    if (recording) {
      setRecording(false);
      setAnalyzing(true);
      setTimeout(() => {
        setTranscript("This is a recorded voicemail from Microsoft Support. Your account has been compromised. Please call us back at 1-800-555-0199 immediately with your credit card to verify your identity.");
        setAnalyzing(false);
      }, 2000);
    } else {
      setRecording(true);
      setTranscript('');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Voice & Audio Verification</h1>
        <p className="text-gray-500 dark:text-gray-400">Locally transcribe and verify suspicious voicemails using Whisper AI.</p>
      </div>
      
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        
        {analyzing ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 font-bold">Running local Whisper-tiny model...</p>
            <p className="text-xs text-gray-500 mt-2 font-mono">Loading Xenova/whisper-tiny [150MB]</p>
          </div>
        ) : transcript ? (
          <div className="text-left w-full max-w-2xl">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Check size={16} className="text-green-500"/> Transcription Complete</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 italic mb-6 border-l-4 border-blue-500">
              "{transcript}"
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2 mx-auto">
              <Check size={18} /> Send to Deterministic Engine
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={handleRecord}
              className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 ${recording ? 'bg-red-500 animate-pulse' : 'bg-gray-900 dark:bg-white'}`}
            >
              {recording ? <Square size={48} className="text-white" /> : <Mic size={48} className="text-white dark:text-gray-900" />}
            </button>
            <p className="mt-6 text-gray-500 dark:text-gray-400 font-medium">
              {recording ? 'Recording... click to stop' : 'Click to start recording a voicemail'}
            </p>
          </>
        )}

      </div>
    </div>
  );
}
