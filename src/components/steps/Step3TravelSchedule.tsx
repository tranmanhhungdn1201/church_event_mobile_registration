import { useFormContext, Controller } from 'react-hook-form';
import { CalendarIcon, PlaneIcon, TrainIcon, BusIcon, CarIcon, InfoIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import { useValidation } from '../../hooks/useValidation';
export const Step3TravelSchedule = () => {
  const {
    control,
    register,
    watch,
    formState: {
      errors
    }
  } = useFormContext();
  const { t } = useLanguage();
  const { getValidationMessage } = useValidation();
  const transport = watch('travelSchedule.transport');
  const noTravelInfo = watch('travelSchedule.noTravelInfo');
  return <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg flex">
        <InfoIcon className="h-5 w-5 text-[#2E5AAC] mr-3 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          {t('step3.tip')}
        </p>
      </div>
      
      {/* Checkbox for no travel info */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input 
            id="noTravelInfo" 
            type="checkbox" 
            {...register('travelSchedule.noTravelInfo')} 
            className="h-4 w-4 text-[#2E5AAC] focus:ring-[#2E5AAC] border-gray-300 rounded" 
          />
          <label htmlFor="noTravelInfo" className="ml-2 block text-sm font-medium text-gray-700">
            {t('step3.noTravelInfo')}
          </label>
        </div>
        
        {noTravelInfo && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {t('step3.noTravelInfoNote')}
            </p>
          </div>
        )}
      </div>
      {/* Travel details form - only show if noTravelInfo is not checked */}
      {!noTravelInfo && (
        <>
          <div className="space-y-2">
            <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700">
              {t('step3.arrivalDate')} ({t('common.optional')})
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Controller control={control} name="travelSchedule.arrivalDate" render={({
              field
            }) => <input type="datetime-local" id="arrivalDate" className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-11 border" value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''} onChange={e => {
              field.onChange(e.target.value ? new Date(e.target.value) : null);
            }} />} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('step3.transport')} ({t('common.optional')})
            </label>
            <div className="grid grid-cols-4 gap-2">
              <label className="flex flex-col items-center">
                <input type="radio" value="plane" {...register('travelSchedule.transport')} className="sr-only" />
                <div className={`w-full py-3 px-2 flex flex-col items-center justify-center rounded-lg cursor-pointer ${transport === 'plane' ? 'bg-[#2E5AAC] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <PlaneIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{t('step3.transportOptions.plane')}</span>
                </div>
              </label>
              <label className="flex flex-col items-center">
                <input type="radio" value="train" {...register('travelSchedule.transport')} className="sr-only" />
                <div className={`w-full py-3 px-2 flex flex-col items-center justify-center rounded-lg cursor-pointer ${transport === 'train' ? 'bg-[#2E5AAC] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <TrainIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{t('step3.transportOptions.train')}</span>
                </div>
              </label>
              <label className="flex flex-col items-center">
                <input type="radio" value="bus" {...register('travelSchedule.transport')} className="sr-only" />
                <div className={`w-full py-3 px-2 flex flex-col items-center justify-center rounded-lg cursor-pointer ${transport === 'bus' ? 'bg-[#2E5AAC] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <BusIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{t('step3.transportOptions.bus')}</span>
                </div>
              </label>
              <label className="flex flex-col items-center">
                <input type="radio" value="self" {...register('travelSchedule.transport')} className="sr-only" />
                <div className={`w-full py-3 px-2 flex flex-col items-center justify-center rounded-lg cursor-pointer ${transport === 'self' ? 'bg-[#2E5AAC] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <CarIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{t('step3.transportOptions.self')}</span>
                </div>
              </label>
            </div>
          </div>
          {transport === 'plane' && <div className="space-y-2">
              <label htmlFor="flightCode" className="block text-sm font-medium text-gray-700">
                {t('step3.flightCode')} ({t('common.optional')})
              </label>
              <input id="flightCode" type="text" {...register('travelSchedule.flightCode')} className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-11 border" placeholder={t('step3.flightCodePlaceholder')} />
            </div>}
          <div className="space-y-2">
            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
              {t('step3.returnDate')} ({t('common.optional')})
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Controller control={control} name="travelSchedule.returnDate" render={({
              field
            }) => <input type="date" id="returnDate" className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-11 border" value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} onChange={e => {
              field.onChange(e.target.value ? new Date(e.target.value) : null);
            }} />} />
            </div>
          </div>
        </>
      )}
    </div>;
};