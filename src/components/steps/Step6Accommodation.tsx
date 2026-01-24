import { useFormContext } from 'react-hook-form';
import { AlertCircleIcon, InfoIcon, CheckIcon } from 'lucide-react';
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
  const stayStatus = watch('accommodation.stayStatus');
  const needAssistance = watch('accommodation.needAssistance');
  const agreeToTerms = watch('accommodation.agreeToTerms');
  


  return (
    <div className={formStyles.section}>
      <div className={formStyles.tipBox}>
        <InfoIcon className={formStyles.tipIcon} />
        <p className={formStyles.tipText}>
          {t('step6.tip')}
        </p>
      </div>

      <div className="space-y-4">
        <label className={formStyles.label}>
          {t('step6.stayStatus')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="relative block group cursor-pointer">
            <input 
              type="radio" 
              value="arranged" 
              {...register('accommodation.stayStatus')} 
              className="peer sr-only" 
            />
            <div className="w-full py-4 px-4 text-center rounded-xl border border-slate-200 bg-white transition-all duration-200 peer-checked:border-[#2E5AAC] peer-checked:bg-[#2E5AAC] peer-checked:text-white hover:border-slate-300 hover:bg-slate-50 peer-checked:hover:bg-[#2E5AAC] shadow-sm h-full flex items-center justify-center">
              <span className="font-semibold text-sm">{t('step6.stayOptions.arranged')}</span>
            </div>
          </label>
          <label className="relative block group cursor-pointer">
            <input 
              type="radio" 
              value="notArranged" 
              {...register('accommodation.stayStatus')} 
              className="peer sr-only" 
            />
            <div className="w-full py-4 px-4 text-center rounded-xl border border-slate-200 bg-white transition-all duration-200 peer-checked:border-[#2E5AAC] peer-checked:bg-[#2E5AAC] peer-checked:text-white hover:border-slate-300 hover:bg-slate-50 peer-checked:hover:bg-[#2E5AAC] shadow-sm h-full flex items-center justify-center">
              <span className="font-semibold text-sm">{t('step6.stayOptions.notArranged')}</span>
            </div>
          </label>
        </div>
      </div>

      {stayStatus === 'arranged' && (
        <div className="space-y-2 animate-fade-in-up">
          <label htmlFor="accommodationInfo" className={formStyles.label}>
            {t('step6.accommodationInfo')}
          </label>
          <textarea 
            id="accommodationInfo" 
            {...register('accommodation.accommodationInfo')} 
            rows={3} 
            className={formStyles.textarea}
            placeholder={t('step6.accommodationPlaceholder')} 
          />
        </div>
      )}

      {stayStatus === 'notArranged' && (
        <div className="space-y-3 animate-fade-in-up">
           <label className={`flex items-start space-x-3 cursor-pointer group p-4 rounded-xl border transition-all duration-200 ${needAssistance ? 'bg-slate-50 border-slate-300 ring-1 ring-slate-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <div className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center border transition-all duration-200 ${needAssistance ? 'bg-slate-600 border-slate-600' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
              <input 
                id="needAssistance" 
                type="checkbox" 
                {...register('accommodation.needAssistance')} 
                className="sr-only" 
              />
              {needAssistance && <CheckIcon className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className={`text-sm font-medium transition-colors leading-relaxed ${needAssistance ? 'text-slate-900' : 'text-slate-700'}`}>
              {t('step6.needAssistance')}
            </span>
          </label>
          {needAssistance && (
            <div className="space-y-3 animate-fade-in-up pl-1">
              <textarea
                {...register('accommodation.assistanceDetails')}
                rows={3}
                className={formStyles.textarea}
                placeholder={t('step6.assistanceRequestPlaceholder')}
              />
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start">
                <InfoIcon className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  {t('step6.assistanceNote')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

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

        <label className={`flex items-start p-4 rounded-xl border transition-all duration-200 cursor-pointer ${agreeToTerms ? 'bg-[#2E5AAC]/5 border-[#2E5AAC]/30' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
          <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${agreeToTerms ? 'bg-[#2E5AAC] border-[#2E5AAC]' : 'bg-white border-slate-300'}`}>
            <input 
              id="agreeToTerms" 
              type="checkbox" 
              {...register('accommodation.agreeToTerms')} 
              className="sr-only" 
            />
            {agreeToTerms && <CheckIcon className="w-3.5 h-3.5 text-white" />}
          </div>
          <div className="ml-3">
            <span className={`block text-sm font-semibold transition-colors ${agreeToTerms ? 'text-[#2E5AAC]' : 'text-slate-800'}`}>
              {t('step6.agreeToTerms')}
            </span>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              {t('step6.termsDescription')}
            </p>
          </div>
        </label>
        {(errors.accommodation as any)?.agreeToTerms && (
          <div className="mt-3 flex items-center text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{t('step6.termsRequired')}</span>
          </div>
        )}
      </div>
    </div>
  );
};