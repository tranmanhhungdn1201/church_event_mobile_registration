import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { AlertCircleIcon, InfoIcon, CheckIcon, CopyIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formStyles } from '../../utils/styles';

export const Step6Accommodation = () => {
  const {
    register,
    watch,
    control,
    formState: {
      errors
    }
  } = useFormContext();
  const { t } = useLanguage();
  const [isTransferInfoOpen, setIsTransferInfoOpen] = useState(true);
  const [copiedItems, setCopiedItems] = useState({
    bankName: false,
    accountNumber: false,
    accountHolder: false
  });

  const stayStatus = watch('accommodation.stayStatus');
  const needAssistance = watch('accommodation.needAssistance');
  const agreeToTerms = watch('accommodation.agreeToTerms');
  const sponsorshipAmount = watch('accommodation.sponsorshipAmount') || 0;

  const handleCopy = (text: string, itemType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => ({
      ...prev,
      [itemType]: true
    }));
    setTimeout(() => {
      setCopiedItems(prev => ({
        ...prev,
        [itemType]: false
      }));
    }, 2000);
  };
  


  return (
    <div className={formStyles.section}>
      <div className="space-y-4">
        <label htmlFor="assistanceDetails" className={formStyles.label}>
          {t('step6.needAssistance')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
        </label>
        <textarea
          id="assistanceDetails"
          {...register('accommodation.assistanceDetails')}
          rows={3}
          className={formStyles.textarea}
          placeholder={t('step6.assistanceRequestPlaceholder')}
        />
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start">
          <InfoIcon className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            {t('step6.assistanceNote')}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-8 space-y-6">
        {/* Sponsorship Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="sponsorshipAmount" className={formStyles.label}>
              {t('step6.sponsorshipAmount')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
            </label>
            <p className="text-sm text-slate-600 mb-2 whitespace-pre-line">
              {t('step6.sponsorshipDescription')}
            </p>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-slate-500 font-medium">₫</span>
              </div>
              <Controller 
                control={control} 
                name="accommodation.sponsorshipAmount" 
                render={({ field }) => (
                  <input 
                    type="text" 
                    id="sponsorshipAmount" 
                    className={`${formStyles.input} pl-8 font-medium`}
                    placeholder="0" 
                    value={field.value ? new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(field.value).replace('₫', '').trim() : ''} 
                    onChange={e => {
                      // Remove non-numeric characters and parse as number
                      const value = e.target.value.replace(/[^\d]/g, '');
                      field.onChange(value ? parseInt(value, 10) : null);
                    }} 
                  />
                )} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bankNote" className={formStyles.label}>
              {t('step6.bankNote')}
            </label>
            <textarea 
              id="bankNote" 
              {...register('accommodation.bankNote')} 
              rows={2} 
              className={formStyles.textarea}
              placeholder={t('step6.bankNotePlaceholder')} 
            />
          </div>

        </div>
      </div>

      <div className="border-t border-slate-100 pt-8 space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          {t('step6.activityTip')}
        </h3>
        
        {/* Big Game */}
        <div className="space-y-3">
          <label className={formStyles.label}>
            {t('step6.bigGame')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'yes', label: t('step6.participationOptions.yes') },
              { value: 'no', label: t('step6.participationOptions.no') },
              { value: 'considering', label: t('step6.participationOptions.considering') }
            ].map((option) => (
              <label key={option.value} className="relative block group cursor-pointer">
                <input 
                  type="radio" 
                  value={option.value} 
                  {...register('accommodation.participateBigGame')} 
                  className="peer sr-only" 
                />
                <div className="w-full py-3 px-2 text-center rounded-lg border border-slate-200 bg-white transition-all duration-200 peer-checked:border-[#2E5AAC] peer-checked:bg-[#2E5AAC] peer-checked:text-white hover:border-slate-300 hover:bg-slate-50 peer-checked:hover:bg-[#2E5AAC] shadow-sm flex items-center justify-center">
                  <span className="font-semibold text-xs sm:text-sm">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Sports */}
        <div className="space-y-3">
          <label className={formStyles.label}>
            {t('step6.sports')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'yes', label: t('step6.participationOptions.yes') },
              { value: 'no', label: t('step6.participationOptions.no') },
              { value: 'considering', label: t('step6.participationOptions.considering') }
            ].map((option) => (
              <label key={option.value} className="relative block group cursor-pointer">
                <input 
                  type="radio" 
                  value={option.value} 
                  {...register('accommodation.participateSports')} 
                  className="peer sr-only" 
                />
                <div className="w-full py-3 px-2 text-center rounded-lg border border-slate-200 bg-white transition-all duration-200 peer-checked:border-[#2E5AAC] peer-checked:bg-[#2E5AAC] peer-checked:text-white hover:border-slate-300 hover:bg-slate-50 peer-checked:hover:bg-[#2E5AAC] shadow-sm flex items-center justify-center">
                  <span className="font-semibold text-xs sm:text-sm">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};