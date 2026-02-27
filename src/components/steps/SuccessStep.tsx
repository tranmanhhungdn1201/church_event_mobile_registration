import { useState } from 'react';
import { CheckCircleIcon, CalendarIcon, ShareIcon, MessageCircleIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ReviewStep } from './ReviewStep';

interface SuccessStepProps {
  formData: any;
  onReset?: () => void;
}

export const SuccessStep = ({
  formData,
  onReset
}: SuccessStepProps) => {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const fullName = formData?.personalInfo?.fullName || '';

  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center animate-fade-in-up">
      <div className="rounded-full bg-green-50 p-4 w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-sm">
        <CheckCircleIcon className="h-12 w-12 text-green-500" />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
        {t('success.title')}
      </h2>
      <p className="text-slate-500 mb-10 text-lg">
        {t('success.congratulations')} {fullName && <span className="font-semibold text-slate-700">{fullName}</span>}!
      </p>
      
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center justify-center py-3 px-6 border border-slate-200 rounded-xl text-sm font-semibold text-[#2E5AAC] bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          {showDetails ? (
            <>
              {t('success.hideDetails')}
              <ChevronUpIcon className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              {t('success.reviewDetails')}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {showDetails && (
        <div className="text-left mb-8 animate-fade-in">
          <ReviewStep formData={formData} />
        </div>
      )}

      {!showDetails && (
        <>
          <div className="bg-[#2E5AAC]/5 rounded-2xl p-6 text-left border border-[#2E5AAC]/10">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center text-lg">
              <MessageCircleIcon className="h-5 w-5 mr-2.5 text-[#2E5AAC]" />
              {t('success.joinCommunity')}
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              {t('success.communityDescription')}
            </p>
            <div className="flex justify-center mt-6">
              <a
                href="https://zalo.me/g/zjqgou153"
                target="_blank"
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center bg-white py-2.5 px-6 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                {t('success.joinZalo')}
              </a>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="button"
              onClick={onReset}
              className="w-full py-3.5 px-4 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shadow-sm"
            >
              {t('success.backToHome')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};