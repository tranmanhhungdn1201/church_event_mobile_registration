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
  onLoadDraft?: () => void;
  isLastStep?: boolean;
  maritalStatus?: string;
  church?: string;
}
import logoImg from '/assets/logo.png';

export const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  title,
  currentStep,
  totalSteps,
  progress,
  onNext,
  onBack,
  onSaveDraft,
  onLoadDraft,
  isLastStep = false,
  maritalStatus,
  church
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-2xl">
          <div className="flex items-center">
            <img 
              src={logoImg} 
              alt="IOY DNCOC Logo" 
              className="w-8 h-8 mr-3 object-contain"
            />
            <h1 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 rounded-lg hover:bg-slate-100 transition-all duration-200 text-slate-600"
              >
                <MoreVerticalIcon className="w-5 h-5" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-20 border border-slate-100 ring-1 ring-black ring-opacity-5">
                  {onLoadDraft && (
                    <button 
                      onClick={() => {
                        onLoadDraft();
                        setIsMenuOpen(false);
                      }} 
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2E5AAC] transition-colors duration-200 font-medium"
                    >
                      {t('common.loadDraft')}
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      onSaveDraft();
                      setIsMenuOpen(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2E5AAC] transition-colors duration-200 font-medium"
                  >
                    {t('common.save')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Progress indicator */}
        <div className="border-t border-slate-100">
             <StepIndicator currentStep={currentStep} totalSteps={totalSteps} progress={progress} maritalStatus={maritalStatus} church={church} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8 pb-28 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="container mx-auto flex justify-between items-center max-w-2xl">
          {currentStep > 1 ? (
            <button 
              onClick={onBack} 
              className="px-6 py-2.5 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900 text-sm"
            >
              {t('common.back')}
            </button>
          ) : (
            <div></div>
          )}
          <button 
            onClick={onNext} 
            className="px-8 py-2.5 bg-[#2E5AAC] text-white font-semibold rounded-lg shadow-sm hover:bg-[#254a8f] transform active:scale-95 transition-all duration-200 text-sm"
          >
            {isLastStep ? t('common.submit') : t('common.continue')}
          </button>
        </div>
      </footer>
    </div>
  );
};