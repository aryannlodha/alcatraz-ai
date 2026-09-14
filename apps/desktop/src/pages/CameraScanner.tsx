import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check } from 'lucide-react';
import { AnalysisState } from './AnalyzeScreen';

export function CameraScanner({ onCapture }: { onCapture: (imageSrc: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCaptured(imageSrc);
    }
  }, [webcamRef]);

  const confirm = () => {
    if (captured) {
      onCapture(captured);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm p-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
        <Camera size={16} /> Live Document Scanner
      </h3>
      
      {!captured ? (
        <div className="relative rounded-lg overflow-hidden bg-gray-950 aspect-video flex flex-col items-center justify-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: "environment" }}
          />
          <button 
            onClick={capture}
            className="absolute bottom-4 bg-white text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Capture Document
          </button>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-gray-950 aspect-video flex flex-col items-center justify-center">
          <img src={captured} alt="Captured document" className="w-full h-full object-cover opacity-90" />
          <div className="absolute bottom-4 flex gap-4">
            <button 
              onClick={() => setCaptured(null)}
              className="bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <RefreshCw size={16} /> Retake
            </button>
            <button 
              onClick={confirm}
              className="bg-green-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-green-600 flex items-center gap-2"
            >
              <Check size={16} /> Analyze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
