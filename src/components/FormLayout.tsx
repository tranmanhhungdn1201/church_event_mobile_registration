import React, { useState, ReactNode } from 'react';
import { StepIndicator } from './StepIndicator';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MoreVerticalIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
interface FormLayoutProps {
  children: ReactNode;
  title: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
  isLastStep?: boolean;
}
export const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  title,
  currentStep,
  totalSteps,
  progress,
  onNext,
  onBack,
  onSaveDraft,
  isLastStep = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  return <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2E5AAC] to-[#1e3a8a] rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-md">
              CA
            </div>
            <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <MoreVerticalIcon className="w-4 h-4 text-gray-600" />
              </button>
              {isMenuOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-100">
                  <button 
                    onClick={() => {
                      onSaveDraft();
                      setIsMenuOpen(false);
                    }} 
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {t('common.save')} & Continue Later
                  </button>
                </div>}
            </div>
          </div>
        </div>
        {/* Progress indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} progress={progress} />
      </header>
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          {children}
        </div>
      </main>
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-3 sm:py-4 px-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center max-w-4xl">
          {currentStep > 1 ? (
            <button 
              onClick={onBack} 
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-[#2E5AAC] font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 border border-[#2E5AAC] hover:shadow-md text-sm sm:text-base"
            >
              {t('common.back')}
            </button>
          ) : (
            <div></div>
          )}
          <button 
            onClick={onNext} 
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
          >
            {isLastStep ? t('common.submit') : t('common.continue')}
          </button>
        </div>
      </footer>
    </div>;
};