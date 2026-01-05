
import React, { useState, useEffect } from 'react';
import { Recipe, Ingredient } from '../types';
import { generateTTS, playPCM } from '../services/geminiService';

interface StepByStepModeProps {
  recipe: Recipe;
  onClose: () => void;
  onAddToShoppingList: (ingredient: string) => void;
  shoppingList: string[];
}

const StepByStepMode: React.FC<StepByStepModeProps> = ({ 
  recipe, 
  onClose, 
  onAddToShoppingList,
  shoppingList 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSubsFor, setShowSubsFor] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const speakStep = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioData = await generateTTS(recipe.steps[currentStep]);
      await playPCM(audioData);
    } catch (err) {
      console.error("TTS Error:", err);
    } finally {
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          <h2 className="font-bold truncate max-w-[200px] md:max-w-none">{recipe.title}</h2>
        </div>
        <div className="text-sm font-medium text-gray-500">
          Step {currentStep + 1} of {recipe.steps.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Ingredients Checklist */}
        <div className="w-full md:w-80 border-r bg-gray-50 overflow-y-auto p-6 hidden md:block">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-carrot text-emerald-500"></i>
            Ingredients
          </h3>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, idx) => {
              const inList = shoppingList.includes(ing.name);
              return (
                <li key={idx} className="flex flex-col gap-1 border-b border-gray-100 pb-2 last:border-0">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1 rounded text-emerald-500 focus:ring-emerald-500" />
                    <span className={`text-sm ${ing.isMissing ? 'text-red-600 italic font-medium' : 'text-gray-700'}`}>
                      {ing.name}
                    </span>
                  </div>
                  {ing.isMissing && (
                    <div className="ml-6 space-y-1">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onAddToShoppingList(ing.name)}
                          disabled={inList}
                          className={`text-[10px] font-bold uppercase transition-colors ${inList ? 'text-gray-400' : 'text-emerald-600 hover:text-emerald-700'}`}
                        >
                          {inList ? 'Added to List' : 'Add to Shop List'}
                        </button>
                        {ing.substitutions && ing.substitutions.length > 0 && (
                          <button 
                            onClick={() => setShowSubsFor(showSubsFor === ing.name ? null : ing.name)}
                            className="text-[10px] font-bold uppercase text-amber-600 hover:text-amber-700"
                          >
                            Substitutions
                          </button>
                        )}
                      </div>
                      
                      {showSubsFor === ing.name && ing.substitutions && (
                        <div className="bg-amber-50 p-2 rounded text-[10px] text-amber-800 animate-in fade-in slide-in-from-top-1">
                          <p className="font-bold mb-1">Try instead:</p>
                          <ul className="list-disc ml-3">
                            {ing.substitutions.map(s => <li key={s}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Side: Step Display */}
        <div className="flex-1 p-8 md:p-12 lg:p-24 flex flex-col items-center justify-center text-center relative">
          <div className="max-w-3xl space-y-12">
            <div className="relative group">
              <p className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight text-slate-900 tracking-tight">
                {recipe.steps[currentStep]}
              </p>
              
              <button 
                onClick={speakStep}
                disabled={isSpeaking}
                className={`mt-12 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${isSpeaking ? 'bg-emerald-100 text-emerald-500' : 'bg-emerald-500 text-white hover:scale-105 active:scale-95'}`}
              >
                {isSpeaking ? (
                  <div className="flex gap-1">
                    <span className="w-1 h-4 bg-emerald-500 animate-bounce"></span>
                    <span className="w-1 h-6 bg-emerald-500 animate-bounce delay-75"></span>
                    <span className="w-1 h-4 bg-emerald-500 animate-bounce delay-150"></span>
                  </div>
                ) : (
                  <i className="fa-solid fa-volume-high text-2xl"></i>
                )}
              </button>
            </div>
          </div>

          <div className="absolute bottom-32 left-8 right-8 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / recipe.steps.length) * 100}%` }}
            ></div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-between items-center">
            <button 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all ${currentStep === 0 ? 'text-gray-300' : 'text-slate-600 hover:bg-gray-100'}`}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Previous
            </button>
            
            <button 
              onClick={currentStep === recipe.steps.length - 1 ? onClose : handleNext}
              className="bg-slate-900 text-white font-bold px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:bg-slate-800 flex items-center gap-2"
            >
              {currentStep === recipe.steps.length - 1 ? 'Finish Cooking' : 'Next Step'}
              {currentStep < recipe.steps.length - 1 && <i className="fa-solid fa-arrow-right"></i>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepByStepMode;
