import { useEffect } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { PlusIcon, MinusIcon, UserIcon, PhoneIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formStyles } from '../../utils/styles';

export const Step2FamilyParticipation = () => {
  const {
    register,
    control,
    watch,
    setValue,
  } = useFormContext();
  const { t } = useLanguage();
  const attendingWithSpouse = watch('familyParticipation.attendingWithSpouse');
  const numberOfChildren = watch('familyParticipation.numberOfChildren');
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'familyParticipation.children'
  });

  // Sync children array with the number of children
  useEffect(() => {
    const currentChildrenCount = fields.length;
    if (numberOfChildren > currentChildrenCount) {
      // Add more children
      for (let i = currentChildrenCount; i < numberOfChildren; i++) {
        append({
          name: '',
          age: 0,
          wantsTShirt: false,
          tShirtSize: 'M'
        });
      }
    } else if (numberOfChildren < currentChildrenCount) {
      // Remove excess children
      for (let i = currentChildrenCount - 1; i >= numberOfChildren; i--) {
        remove(i);
      }
    }
  }, [numberOfChildren, fields.length, append, remove]);

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

      <div className="space-y-4 pt-6 border-t border-slate-100">
        <label className={formStyles.label}>
          {t('step2.numberOfChildren')}
        </label>
        <div className="flex items-center">
          <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <button 
              type="button" 
              onClick={() => {
                const newValue = Math.max(0, numberOfChildren - 1);
                setValue('familyParticipation.numberOfChildren', newValue);
              }} 
              className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-r border-slate-200"
              disabled={numberOfChildren === 0}
            >
              <MinusIcon className="h-4 w-4 text-slate-600" />
            </button>
            <div className="px-6 py-2 min-w-[4rem] text-center bg-white">
              <span className="text-lg font-semibold text-slate-900">
                {numberOfChildren}
              </span>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setValue('familyParticipation.numberOfChildren', numberOfChildren + 1);
              }} 
              className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 border-l border-slate-200"
            >
              <PlusIcon className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {numberOfChildren > 0 && (
        <div className="space-y-5 animate-fade-in-up">
          <div className="grid gap-x-4 gap-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-shadow relative">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                   <UserIcon className="w-16 h-16" />
                </div>
                
                <h4 className="text-sm font-bold text-[#2E5AAC] uppercase tracking-wider border-b border-slate-200 pb-2">
                  {t('step2.childName')} {index + 1}
                </h4>
                
                <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-1.5">
                    <label className={formStyles.label}>
                      {t('step2.childName')}
                    </label>
                    <input 
                      type="text" 
                      {...register(`familyParticipation.children.${index}.name`)} 
                      className={formStyles.input}
                      placeholder={t('step2.childNamePlaceholder')} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={formStyles.label}>
                      {t('step2.childAge')}
                    </label>
                    <Controller 
                      control={control} 
                      name={`familyParticipation.children.${index}.age`} 
                      render={({ field }) => (
                        <div className="flex items-center">
                          <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden w-full">
                            <button 
                              type="button" 
                              onClick={() => field.onChange(Math.max(0, field.value - 1))} 
                              className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors border-r border-slate-200"
                              disabled={field.value === 0}
                            >
                              <MinusIcon className="h-4 w-4 text-slate-600" />
                            </button>
                            <div className="px-4 py-2 flex-1 text-center bg-white">
                              <span className="text-base font-semibold text-slate-900">
                                {field.value}
                              </span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => field.onChange(Math.min(18, field.value + 1))} 
                              className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors border-l border-slate-200"
                              disabled={field.value === 18}
                            >
                              <PlusIcon className="h-4 w-4 text-slate-600" />
                            </button>
                          </div>
                        </div>
                      )} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};