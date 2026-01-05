
import React, { useRef, useState } from 'react';

interface FridgeScannerProps {
  onScan: (base64Image: string) => void;
  isLoading: boolean;
}

const FridgeScanner: React.FC<FridgeScannerProps> = ({ onScan, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        // Remove prefix data:image/jpeg;base64,
        const rawBase64 = base64.split(',')[1];
        onScan(rawBase64);
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all ${dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300 bg-white'}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        capture="environment" 
        onChange={onFileChange} 
      />
      
      {isLoading ? (
        <div className="space-y-4 py-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Analyzing Your Fridge...</h3>
            <p className="text-gray-500 mt-2">Our AI is identifying ingredients and matching recipes.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-camera text-3xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Scan Your Fridge</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">
              Snap a photo of your open fridge to discover personalized AI-suggested recipes.
            </p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-emerald-600 transition-all active:scale-95"
          >
            Take Photo or Upload
          </button>
          <p className="text-xs text-gray-400 mt-4">Supports JPEG, PNG • Up to 10MB</p>
        </div>
      )}
    </div>
  );
};

export default FridgeScanner;
