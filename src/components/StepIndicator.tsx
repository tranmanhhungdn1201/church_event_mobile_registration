import React from 'react';
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  progress
}) => {
  return <div className="container mx-auto px-4 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-2 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <div 
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  index + 1 <= currentStep 
                    ? 'bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] text-white shadow-md' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div 
                  className={`w-3 h-0.5 mx-1 transition-all duration-300 ${
                    index + 1 < currentStep ? 'bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="bg-white px-2 py-1 rounded-full shadow-sm border border-gray-200 flex-shrink-0">
          <span className="text-xs font-semibold text-gray-600">
            {progress}%
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] h-1.5 rounded-full transition-all duration-500 ease-out shadow-sm" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>;
};