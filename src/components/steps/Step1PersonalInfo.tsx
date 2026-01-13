import { useFormContext, useWatch } from 'react-hook-form';
import { UserIcon, PhoneIcon, MailIcon, HomeIcon, ChevronDownIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useValidation } from '../../hooks/useValidation';
import { formStyles } from '../../utils/styles';

export const Step1PersonalInfo = () => {
  const {
    register,
    control,
    formState: {
      errors
    }
  } = useFormContext();
  const { t } = useLanguage();
  const { getValidationMessage } = useValidation();

  const selectedGender = useWatch({
    control,
    name: 'personalInfo.gender'
  });
  
  const churches = ['Cần Thơ', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương', 'Other'];
  const maritalStatusOptions = [
    { value: 'single', label: t('step1.maritalStatusOptions.single') },
    { value: 'married', label: t('step1.maritalStatusOptions.married') },
  ];

  // Helper to extract nested error safely
  const getError = (path: string) => {
    return (errors.personalInfo as any)?.[path];
  };

  return (
    <div className={formStyles.section}>
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className={formStyles.label}>
          {t('step1.fullName')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            id="fullName" 
            type="text" 
            {...register('personalInfo.fullName')} 
            className={`${formStyles.input} pl-10`}
            placeholder={t('step1.fullNamePlaceholder')} 
          />
        </div>
        {getError('fullName') && (
          <p className={formStyles.errorText}>
            {getValidationMessage(getError('fullName'))}
          </p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className={formStyles.label}>
          {t('step1.gender')} <span className="text-red-500">*</span>
        </label>
        <div className="flex rounded-lg overflow-hidden border border-slate-200 p-1 bg-slate-50 gap-1">
          <label className="flex-1 text-center cursor-pointer relative">
            <input type="radio" value="male" {...register('personalInfo.gender')} className="sr-only" />
            <div className={`py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedGender === 'male' 
                ? 'bg-white text-[#2E5AAC] shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700'
            }`}>
              {t('common.male')}
            </div>
          </label>
          <label className="flex-1 text-center cursor-pointer relative">
            <input type="radio" value="female" {...register('personalInfo.gender')} className="sr-only" />
            <div className={`py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedGender === 'female' 
                ? 'bg-white text-[#2E5AAC] shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700'
            }`}>
              {t('common.female')}
            </div>
          </label>
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phoneNumber" className={formStyles.label}>
          {t('step1.phoneNumber')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PhoneIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            id="phoneNumber" 
            type="tel" 
            {...register('personalInfo.phoneNumber')} 
            className={`${formStyles.input} pl-10`}
            placeholder={t('step1.phoneNumberPlaceholder')} 
          />
        </div>
        {getError('phoneNumber') ? (
            <p className={formStyles.errorText}>
              {getValidationMessage(getError('phoneNumber'))}
            </p>
        ) : (
          <p className="mt-1.5 text-xs text-slate-500">
            {t('step1.phoneNote')}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={formStyles.label}>
          {t('step1.email')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MailIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            id="email" 
            type="email" 
            {...register('personalInfo.email')} 
            className={`${formStyles.input} pl-10`}
            placeholder={t('step1.emailPlaceholder')} 
          />
        </div>
        {getError('email') && (
          <p className={formStyles.errorText}>
            {getValidationMessage(getError('email'))}
          </p>
        )}
      </div>

      {/* Church */}
      <div>
        <label htmlFor="church" className={formStyles.label}>
          {t('step1.church')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <HomeIcon className="h-5 w-5 text-slate-400" />
          </div>
          <select 
            id="church" 
            {...register('personalInfo.church')} 
            className={`${formStyles.input} pl-10 appearance-none`}
            style={{ backgroundImage: 'none' }}
          >
            <option value="" disabled>{t('step1.churchPlaceholder')}</option>
            {churches.map(church => (
              <option key={church} value={church}>
                {church}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <ChevronDownIcon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Marital Status */}
      <div>
        <label htmlFor="maritalStatus" className={formStyles.label}>
          {t('step1.maritalStatus')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select 
            id="maritalStatus" 
            {...register('personalInfo.maritalStatus')} 
            className={`${formStyles.input} pl-4 appearance-none`}
            style={{ backgroundImage: 'none' }}
          >
            <option value="" disabled>
              {t('step1.maritalStatusPlaceholder')}
            </option>
            {maritalStatusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
           <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <ChevronDownIcon className="w-4 h-4" />
          </div>
        </div>
        {getError('maritalStatus') && (
          <p className={formStyles.errorText}>
            {getValidationMessage(getError('maritalStatus'))}
          </p>
        )}
      </div>
    </div>
  );
};