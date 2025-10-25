import { useFormContext, Controller } from 'react-hook-form';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useValidation } from '../../hooks/useValidation';
export const Step6Accommodation = () => {
  const {
    register,
    watch,
    setValue,
    formState: {
      errors
    }
  } = useFormContext();
  const { t } = useLanguage();
  const { getValidationMessage } = useValidation();
  const stayStatus = watch('accommodation.stayStatus');
  const needAssistance = watch('accommodation.needAssistance');
  const agreeToTerms = watch('accommodation.agreeToTerms');
  // Format currency
  const formatCurrency = amount => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  return <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg flex">
        <InfoIcon className="h-5 w-5 text-[#2E5AAC] mr-3 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          {t('step6.tip')}
        </p>
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {t('step6.stayStatus')} ({t('common.optional')})
        </label>
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <label className="flex-1 text-center">
            <input type="radio" value="arranged" {...register('accommodation.stayStatus')} className="sr-only" />
            <div className={`py-3 px-4 cursor-pointer ${stayStatus === 'arranged' ? 'bg-[#2E5AAC] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              {t('step6.stayOptions.arranged')}
            </div>
          </label>
          <label className="flex-1 text-center border-l border-gray-300">
            <input type="radio" value="notArranged" {...register('accommodation.stayStatus')} className="sr-only" />
            <div className={`py-3 px-4 cursor-pointer ${stayStatus === 'notArranged' ? 'bg-[#2E5AAC] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              {t('step6.stayOptions.notArranged')}
            </div>
          </label>
        </div>
      </div>
      {stayStatus === 'arranged' && <div className="space-y-2">
          <label htmlFor="accommodationInfo" className="block text-sm font-medium text-gray-700">
            {t('step6.accommodationInfo')}
          </label>
          <textarea id="accommodationInfo" {...register('accommodation.accommodationInfo')} rows={3} className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm" placeholder={t('step6.accommodationPlaceholder')} />
        </div>}
      {stayStatus === 'notArranged' && <div className="space-y-2">
          <div className="flex items-center">
            <input id="needAssistance" type="checkbox" {...register('accommodation.needAssistance')} className="h-4 w-4 text-[#2E5AAC] focus:ring-[#2E5AAC] border-gray-300 rounded" />
            <label htmlFor="needAssistance" className="ml-2 block text-sm font-medium text-gray-700">
              {t('step6.needAssistance')}
            </label>
          </div>
          {needAssistance &&           <p className="text-sm text-gray-600 mt-2 pl-6">
              {t('step6.assistanceNote')}
            </p>}
        </div>}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="sponsorshipAmount" className="block text-sm font-medium text-gray-700">
            {t('step6.sponsorshipAmount')} ({t('common.optional')})
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">₫</span>
            </div>
            <Controller control={useFormContext().control} name="accommodation.sponsorshipAmount" render={({
            field
          }) => <input type="text" id="sponsorshipAmount" className="pl-7 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-11 border" placeholder="0" value={field.value || ''} onChange={e => {
            // Remove non-numeric characters and parse as number
            const value = e.target.value.replace(/[^\d]/g, '');
            field.onChange(value ? parseInt(value, 10) : null);
          }} onBlur={e => {
            if (field.value) {
              // Format the displayed value on blur
              e.target.value = formatCurrency(field.value).replace('₫', '').trim();
            }
          }} />} />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="bankNote" className="block text-sm font-medium text-gray-700">
            {t('step6.bankNote')}
          </label>
          <textarea id="bankNote" {...register('accommodation.bankNote')} rows={2} className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm" placeholder={t('step6.bankNotePlaceholder')} />
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input id="agreeToTerms" type="checkbox" {...register('accommodation.agreeToTerms')} className="h-4 w-4 text-[#2E5AAC] focus:ring-[#2E5AAC] border-gray-300 rounded" />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
              {t('step6.agreeToTerms')}
            </label>
            <p className="text-gray-500">
              {t('step6.termsDescription')}
            </p>
          </div>
        </div>
        {errors.accommodation?.agreeToTerms && <div className="mt-2 flex items-center text-sm text-red-600">
            <AlertCircleIcon className="h-4 w-4 mr-1" />
            <span>{t('step6.termsRequired')}</span>
          </div>}
      </div>
    </div>;
};