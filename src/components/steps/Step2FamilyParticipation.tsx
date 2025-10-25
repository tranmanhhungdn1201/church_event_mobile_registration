import { useEffect } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { PlusIcon, MinusIcon, UserIcon, PhoneIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useValidation } from '../../hooks/useValidation';
export const Step2FamilyParticipation = () => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext();
  const { t } = useLanguage();
  const { getValidationMessage } = useValidation();
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
  return <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <input id="attendingWithSpouse" type="checkbox" {...register('familyParticipation.attendingWithSpouse')} className="h-4 w-4 text-[#2E5AAC] focus:ring-[#2E5AAC] border-gray-300 rounded" />
          <label htmlFor="attendingWithSpouse" className="ml-2 block text-sm font-medium text-gray-700">
            {t('step2.attendingWithSpouse')}
          </label>
        </div>
        {attendingWithSpouse && <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
              {t('step2.spouseInfo')}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="spouseName" className="block text-sm font-medium text-gray-700">
                  {t('step2.spouseName')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    id="spouseName" 
                    type="text" 
                    {...register('familyParticipation.spouseName')} 
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200" 
                    placeholder={t('step2.spouseNamePlaceholder')} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="spousePhone" className="block text-sm font-medium text-gray-700">
                  {t('step2.spousePhone')} <span className="text-gray-400">({t('common.optional')})</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    id="spousePhone" 
                    type="tel" 
                    {...register('familyParticipation.spousePhone')} 
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200" 
                    placeholder={t('step2.spousePhonePlaceholder')} 
                  />
                </div>
              </div>
            </div>
          </div>}
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {t('step2.numberOfChildren')}
        </label>
        <div className="flex items-center justify-center">
          <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
            <button 
              type="button" 
              onClick={() => {
                const newValue = Math.max(0, numberOfChildren - 1);
                setValue('familyParticipation.numberOfChildren', newValue);
              }} 
              className="p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={numberOfChildren === 0}
            >
              <MinusIcon className="h-4 w-4 text-gray-600" />
            </button>
            <div className="px-4 py-2 bg-white border-x border-gray-300">
              <span className="text-base font-semibold text-gray-800 min-w-[1.5rem] text-center block">
                {numberOfChildren}
              </span>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setValue('familyParticipation.numberOfChildren', numberOfChildren + 1);
              }} 
              className="p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <PlusIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      {numberOfChildren > 0 && <div className="space-y-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
            {t('step2.children')}
          </h3>
          <div className="grid gap-4 sm:gap-6">
            {fields.map((field, index) => <div key={field.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {t('step2.childName')} {index + 1}
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('step2.childName')}
                    </label>
                    <input 
                      type="text" 
                      {...register(`familyParticipation.children.${index}.name`)} 
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200" 
                      placeholder={t('step2.childNamePlaceholder')} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('step2.childAge')}
                    </label>
                    <Controller 
                      control={control} 
                      name={`familyParticipation.children.${index}.age`} 
                      render={({ field }) => (
                        <div className="flex items-center justify-center">
                          <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                            <button 
                              type="button" 
                              onClick={() => field.onChange(Math.max(0, field.value - 1))} 
                              className="p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={field.value === 0}
                            >
                              <MinusIcon className="h-4 w-4 text-gray-600" />
                            </button>
                            <div className="px-4 py-2 bg-white border-x border-gray-300">
                              <span className="text-base font-semibold text-gray-800 min-w-[1.5rem] text-center block">
                                {field.value}
                              </span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => field.onChange(Math.min(18, field.value + 1))} 
                              className="p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={field.value === 18}
                            >
                              <PlusIcon className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      )} 
                    />
                  </div>
                </div>
              </div>)}
          </div>
        </div>}
    </div>;
};