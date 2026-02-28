import { useFormContext } from 'react-hook-form';
import { InfoIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formStyles } from '../../utils/styles';

export const Step6Accommodation = () => {
  const {
    register,
  } = useFormContext();
  const { t } = useLanguage();

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



      <div className="border-t border-slate-100 pt-8 space-y-8">
        <h3 className="text-xl font-bold text-slate-800">
          {t('step6.activityTip')}
        </h3>
        
        {/* Sports */}
        <div className="space-y-4">
          <label className="block text-[16px] font-bold text-slate-800 leading-relaxed">
            {t('step6.sports')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { value: 'walk', label: t('step6.participationOptions.walk') },
              { value: 'sup', label: t('step6.participationOptions.sup') },
              { value: 'notParticipate', label: t('step6.participationOptions.notParticipate') },
              { value: 'considering', label: t('step6.participationOptions.considering') }
            ].map((option) => (
              <label key={option.value} className="relative flex group cursor-pointer h-full">
                <input 
                  type="radio" 
                  value={option.value} 
                  {...register('accommodation.participateSports')} 
                  className="peer sr-only" 
                />
                <div className="w-full py-3.5 px-4 text-center rounded-xl border border-slate-200 bg-white transition-all duration-200 peer-checked:border-[#2E5AAC] peer-checked:bg-[#2E5AAC] peer-checked:text-white hover:border-slate-300 hover:shadow-sm peer-checked:shadow-md flex items-center justify-center">
                  <span className="font-normal text-[15px]">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Big Game */}
        <div className="space-y-4 mt-8">
          <label className="block text-[16px] font-bold text-slate-800 leading-relaxed">
            {t('step6.bigGame')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { value: 'yes', label: t('step6.participationOptions.yes') },
              { value: 'no', label: t('step6.participationOptions.no') },
              { value: 'considering', label: t('step6.participationOptions.considering') }
            ].map((option) => (
              <label key={option.value} className="relative flex group cursor-pointer h-full">
                <input 
                  type="radio" 
                  value={option.value} 
                  {...register('accommodation.participateBigGame')} 
                  className="peer sr-only" 
                />
                <div className="w-full py-3.5 px-4 text-center rounded-xl border border-slate-200 bg-white transition-all duration-200 peer-checked:border-[#2E5AAC] peer-checked:bg-[#2E5AAC] peer-checked:text-white hover:border-slate-300 hover:shadow-sm peer-checked:shadow-md flex items-center justify-center">
                  <span className="font-normal text-[15px]">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Volleyball */}
        <div className="space-y-4 mt-8">
          <label className="block text-[16px] font-bold text-slate-800 leading-relaxed">
            {t('step6.volleyball')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { value: 'yes', label: t('step6.participationOptions.yes') },
              { value: 'no', label: t('step6.participationOptions.no') },
              { value: 'considering', label: t('step6.participationOptions.considering') }
            ].map((option) => (
              <label key={option.value} className="relative flex group cursor-pointer h-full">
                <input 
                  type="radio" 
                  value={option.value} 
                  {...register('accommodation.participateVolleyball')} 
                  className="peer sr-only" 
                />
                <div className="w-full py-3.5 px-4 text-center rounded-xl border border-slate-200 bg-white transition-all duration-200 peer-checked:border-[#2E5AAC] peer-checked:bg-[#2E5AAC] peer-checked:text-white hover:border-slate-300 hover:shadow-sm peer-checked:shadow-md flex items-center justify-center">
                  <span className="font-normal text-[15px]">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};