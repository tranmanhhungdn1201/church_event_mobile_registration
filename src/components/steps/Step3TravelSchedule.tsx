import { useFormContext, Controller } from 'react-hook-form';
import { CalendarIcon, PlaneIcon, TrainIcon, BusIcon, CarIcon, InfoIcon, CheckIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import { formStyles } from '../../utils/styles';

export const Step3TravelSchedule = () => {
  const {
    control,
    register,
    watch,
  } = useFormContext();
  const { t } = useLanguage();
  const transport = watch('travelSchedule.transport');
  const noTravelInfo = watch('travelSchedule.noTravelInfo');

  return (
    <div className={formStyles.section}>
      <div className={formStyles.tipBox}>
        <InfoIcon className={formStyles.tipIcon} />
        <p className={formStyles.tipText}>
          {t('step3.tip')}
        </p>
      </div>
      
      {/* Checkbox for no travel info */}
      <div className="space-y-4">
        <label className={`flex items-center space-x-3 cursor-pointer group p-4 rounded-xl border transition-all duration-200 ${noTravelInfo ? 'bg-slate-50 border-slate-300 ring-1 ring-slate-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${noTravelInfo ? 'bg-slate-600 border-slate-600' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
            <input 
              id="noTravelInfo" 
              type="checkbox" 
              {...register('travelSchedule.noTravelInfo')} 
              className="sr-only" 
            />
            {noTravelInfo && <CheckIcon className="w-3.5 h-3.5 text-white" />}
          </div>
          <span className={`text-base font-medium transition-colors ${noTravelInfo ? 'text-slate-900' : 'text-slate-700'}`}>
            {t('step3.noTravelInfo')}
          </span>
        </label>
        
        {noTravelInfo && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl animate-fade-in-up">
            <p className="text-sm text-amber-900">
              {t('step3.noTravelInfoNote')}
            </p>
          </div>
        )}
      </div>
      
      {/* Travel details form - only show if noTravelInfo is not checked */}
      {!noTravelInfo && (
        <div className="space-y-6 animate-fade-in-up">
          <div>
            <label htmlFor="arrivalDate" className={formStyles.label}>
              {t('step3.arrivalDate')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-slate-400" />
              </div>
              <Controller 
                control={control} 
                name="travelSchedule.arrivalDate" 
                render={({ field }) => (
                  <input 
                    type="datetime-local" 
                    id="arrivalDate" 
                    className={`${formStyles.input} pl-10`}
                    value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''} 
                    onChange={e => {
                      field.onChange(e.target.value ? new Date(e.target.value) : null);
                    }} 
                  />
                )} 
              />
            </div>
          </div>
          
          <div>
            <label className={formStyles.label}>
              {t('step3.transport')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 'plane', icon: PlaneIcon, label: t('step3.transportOptions.plane') },
                { value: 'train', icon: TrainIcon, label: t('step3.transportOptions.train') },
                { value: 'bus', icon: BusIcon, label: t('step3.transportOptions.bus') },
                { value: 'self', icon: CarIcon, label: t('step3.transportOptions.self') },
              ].map((option) => (
                <label key={option.value} className="relative block group cursor-pointer">
                  <input 
                    type="radio" 
                    value={option.value} 
                    {...register('travelSchedule.transport')} 
                    className="peer sr-only" 
                  />
                  <div className="w-full py-3 px-2 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white transition-all duration-200 peer-checked:border-[#2E5AAC] peer-checked:bg-[#2E5AAC] peer-checked:text-white hover:border-slate-300 hover:bg-slate-50 peer-checked:hover:bg-[#2E5AAC] shadow-sm h-full">
                    <option.icon className="h-6 w-6 mb-1.5" />
                    <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {transport === 'plane' && (
            <div className="space-y-2 animate-fade-in-up">
              <label htmlFor="flightCode" className={formStyles.label}>
                {t('step3.flightCode')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
              </label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PlaneIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  id="flightCode" 
                  type="text" 
                  {...register('travelSchedule.flightCode')} 
                  className={`${formStyles.input} pl-10`}
                  placeholder={t('step3.flightCodePlaceholder')} 
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="returnDate" className={formStyles.label}>
              {t('step3.returnDate')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-slate-400" />
              </div>
              <Controller 
                control={control} 
                name="travelSchedule.returnDate" 
                render={({ field }) => (
                  <input 
                    type="date" 
                    id="returnDate" 
                    className={`${formStyles.input} pl-10`}
                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} 
                    onChange={e => {
                      field.onChange(e.target.value ? new Date(e.target.value) : null);
                    }} 
                  />
                )} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};