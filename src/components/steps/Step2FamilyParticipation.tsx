import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { PlusIcon, MinusIcon, UserIcon, PhoneIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formStyles } from '../../utils/styles';

export const Step2FamilyParticipation = () => {
  const {
    register,
    control,
    setValue,
    getValues
  } = useFormContext();
  const { t } = useLanguage();
  
  const attendingWithSpouse = useWatch({
    control,
    name: 'familyParticipation.attendingWithSpouse'
  });
  
  const counts = useWatch({
    control,
    name: 'familyParticipation.counts'
  }) || { above11: 0, between6And11: 0, under6: 0 };

  // Sync counts to children array and total number of children
  useEffect(() => {
    const totalChildren = (counts.above11 || 0) + (counts.between6And11 || 0) + (counts.under6 || 0);
    setValue('familyParticipation.numberOfChildren', totalChildren);

    const currentChildren = getValues('familyParticipation.children') || [];
    const newChildren: any[] = [];

    // Helper to find existing child or create new one
    // We try to preserve existing data (like t-shirt preferences) if possible
    // by matching based on group
    
    // Group 1: Above 11
    const above11Children = currentChildren.filter((c: any) => c.group === 'above11');
    for (let i = 0; i < (counts.above11 || 0); i++) {
        if (i < above11Children.length) {
            newChildren.push(above11Children[i]);
        } else {
            newChildren.push({
                name: `${t('step2.ageGroups.above11')} ${i + 1}`,
                age: 12, // Default age for this group
                group: 'above11'
            });
        }
    }

    // Group 2: 6-11
    const between6And11Children = currentChildren.filter((c: any) => c.group === 'between6And11');
    for (let i = 0; i < (counts.between6And11 || 0); i++) {
        if (i < between6And11Children.length) {
            newChildren.push(between6And11Children[i]);
        } else {
            newChildren.push({
                name: `${t('step2.ageGroups.between6And11')} ${i + 1}`,
                age: 8, // Default age
                group: 'between6And11'
            });
        }
    }

    // Group 3: Under 6
    const under6Children = currentChildren.filter((c: any) => c.group === 'under6');
    for (let i = 0; i < (counts.under6 || 0); i++) {
        if (i < under6Children.length) {
            newChildren.push(under6Children[i]);
        } else {
            newChildren.push({
                name: `${t('step2.ageGroups.under6')} ${i + 1}`,
                age: 3, // Default age
                group: 'under6'
            });
        }
    }
    
    // Update the children array
    // Check if changed to avoid infinite loop
    if (JSON.stringify(newChildren) !== JSON.stringify(currentChildren)) {
        setValue('familyParticipation.children', newChildren);
    }

  }, [counts, setValue, getValues, t]);


  const updateCount = (key: 'above11' | 'between6And11' | 'under6', delta: number) => {
      const currentVal = counts[key] || 0;
      const newVal = Math.max(0, currentVal + delta);
      setValue(`familyParticipation.counts.${key}`, newVal);
  };

  return (
    <div className={formStyles.section}>
      <div className="space-y-4">
        <label className={`flex items-center space-x-3 cursor-pointer group p-4 rounded-xl border transition-all duration-200 ${attendingWithSpouse ? 'bg-slate-50 border-[#2E5AAC]/30 ring-1 ring-[#2E5AAC]/30' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${attendingWithSpouse ? 'bg-[#2E5AAC] border-[#2E5AAC]' : 'bg-white border-slate-300 group-hover:border-[#2E5AAC]'}`}>
            <input 
              id="attendingWithSpouse" 
              type="checkbox" 
              {...register('familyParticipation.attendingWithSpouse')} 
              className="sr-only" 
            />
            {attendingWithSpouse && <PlusIcon className="w-3.5 h-3.5 text-white" />}
          </div>
          <span className={`text-base font-medium transition-colors ${attendingWithSpouse ? 'text-[#2E5AAC]' : 'text-slate-700'}`}>
            {t('step2.attendingWithSpouse')}
          </span>
        </label>

        {attendingWithSpouse && (
          <div className="ml-1 pl-4 border-l-2 border-slate-100 space-y-4 animate-fade-in-up">
            <div className="space-y-4">
              <div>
                <label htmlFor="spouseName" className={formStyles.label}>
                  {t('step2.spouseName')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    id="spouseName" 
                    type="text" 
                    {...register('familyParticipation.spouseName')} 
                    className={`${formStyles.input} pl-10`}
                    placeholder={t('step2.spouseNamePlaceholder')} 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="spousePhone" className={formStyles.label}>
                  {t('step2.spousePhone')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    id="spousePhone" 
                    type="tel" 
                    {...register('familyParticipation.spousePhone')} 
                    className={`${formStyles.input} pl-10`}
                    placeholder={t('step2.spousePhonePlaceholder')} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100">
        <label className={formStyles.label}>
          {t('step2.numberOfChildren')}
        </label>
        
        {/* Above 11 */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
                <div className="font-semibold text-slate-800">{t('step2.ageGroups.above11')}</div>
            </div>
            <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <button 
                type="button" 
                onClick={() => updateCount('above11', -1)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-r border-slate-200"
                disabled={!counts.above11}
                >
                <MinusIcon className="h-4 w-4 text-slate-600" />
                </button>
                <div className="px-6 py-2 min-w-[4rem] text-center bg-white">
                <span className="text-lg font-semibold text-slate-900">
                    {counts.above11 || 0}
                </span>
                </div>
                <button 
                type="button" 
                onClick={() => updateCount('above11', 1)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 border-l border-slate-200"
                >
                <PlusIcon className="h-4 w-4 text-slate-600" />
                </button>
            </div>
        </div>

        {/* 6 - 11 */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
                <div className="font-semibold text-slate-800">{t('step2.ageGroups.between6And11')}</div>
            </div>
            <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <button 
                type="button" 
                onClick={() => updateCount('between6And11', -1)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-r border-slate-200"
                disabled={!counts.between6And11}
                >
                <MinusIcon className="h-4 w-4 text-slate-600" />
                </button>
                <div className="px-6 py-2 min-w-[4rem] text-center bg-white">
                <span className="text-lg font-semibold text-slate-900">
                    {counts.between6And11 || 0}
                </span>
                </div>
                <button 
                type="button" 
                onClick={() => updateCount('between6And11', 1)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 border-l border-slate-200"
                >
                <PlusIcon className="h-4 w-4 text-slate-600" />
                </button>
            </div>
        </div>

        {/* Under 6 */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
                <div className="font-semibold text-slate-800">{t('step2.ageGroups.under6')}</div>
            </div>
            <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <button 
                type="button" 
                onClick={() => updateCount('under6', -1)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-r border-slate-200"
                disabled={!counts.under6}
                >
                <MinusIcon className="h-4 w-4 text-slate-600" />
                </button>
                <div className="px-6 py-2 min-w-[4rem] text-center bg-white">
                <span className="text-lg font-semibold text-slate-900">
                    {counts.under6 || 0}
                </span>
                </div>
                <button 
                type="button" 
                onClick={() => updateCount('under6', 1)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 border-l border-slate-200"
                >
                <PlusIcon className="h-4 w-4 text-slate-600" />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};