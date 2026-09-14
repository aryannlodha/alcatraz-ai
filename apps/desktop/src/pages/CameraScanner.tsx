import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check, Zap } from 'lucide-react';
import { AnalysisState } from './AnalyzeScreen';

export function CameraScanner({ onCapture }: { onCapture: (imageSrc: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [showEla, setShowEla] = useState(false);
  const elaCanvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    if (captured && showEla && elaCanvasRef.current) {
      const canvas = elaCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Very basic mock ELA effect (highpass filter)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i+1] + data[i+2]) / 3;
          const noise = Math.random() * 50; // Mock artifact highlighting
          const v = Math.min(255, Math.max(0, (data[i] - avg) * 5 + 128 + noise));
          data[i] = v; // r
          data[i+1] = v; // g
          data[i+2] = v; // b
        }
        ctx.putImageData(imageData, 0, 0);
      };
      img.src = captured;
    }
  }, [captured, showEla]);

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
          {showEla ? (
            <canvas ref={elaCanvasRef} className="w-full h-full object-cover opacity-90" />
          ) : (
            <img src={captured} alt="Captured document" className="w-full h-full object-cover opacity-90" />
          )}
          
          <button 
            onClick={() => setShowEla(!showEla)}
            className={`absolute top-4 right-4 font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-xs transition-colors ${showEla ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            <Zap size={14} /> {showEla ? 'ELA Active' : 'Tamper Check'}
          </button>

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
