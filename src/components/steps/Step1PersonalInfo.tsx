import { useFormContext } from 'react-hook-form';
import { UserIcon, PhoneIcon, MailIcon, HomeIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useValidation } from '../../hooks/useValidation';
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
  
  const churches = ['Cần Thơ', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương', 'Other'];
  const maritalStatusOptions = [
    { value: 'single', label: t('step1.maritalStatusOptions.single') },
    { value: 'married', label: t('step1.maritalStatusOptions.married') },
  ];
  return <div className="space-y-6 form-container">
      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          {t('step1.fullName')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            id="fullName" 
            type="text" 
            {...register('personalInfo.fullName')} 
            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200" 
            placeholder={t('step1.fullNamePlaceholder')} 
          />
        </div>
        {(errors.personalInfo as any)?.fullName && <p className="mt-1 text-sm text-red-600">
            {getValidationMessage((errors.personalInfo as any)?.fullName)}
          </p>}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {t('step1.gender')} <span className="text-red-500">*</span>
        </label>
        <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
          <label className="flex-1 text-center">
            <input type="radio" value="male" {...register('personalInfo.gender')} className="sr-only" />
            <div className={`py-4 px-4 cursor-pointer transition-all duration-200 ${control._formValues.personalInfo?.gender === 'male' ? 'bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              {t('common.male')}
            </div>
          </label>
          <label className="flex-1 text-center border-l-2 border-gray-200">
            <input type="radio" value="female" {...register('personalInfo.gender')} className="sr-only" />
            <div className={`py-4 px-4 cursor-pointer transition-all duration-200 ${control._formValues.personalInfo?.gender === 'female' ? 'bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              {t('common.female')}
            </div>
          </label>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          {t('step1.phoneNumber')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PhoneIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input id="phoneNumber" type="tel" {...register('personalInfo.phoneNumber')} className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200" placeholder={t('step1.phoneNumberPlaceholder')} />
        </div>
        {(errors.personalInfo as any)?.phoneNumber && <p className="mt-1 text-sm text-red-600">
            {getValidationMessage((errors.personalInfo as any)?.phoneNumber)}
          </p>}
        <p className="text-sm text-gray-500 mt-1">
          {t('step1.phoneNote')}
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('step1.email')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MailIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input id="email" type="email" {...register('personalInfo.email')} className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200" placeholder={t('step1.emailPlaceholder')} />
        </div>
        {(errors.personalInfo as any)?.email && <p className="mt-1 text-sm text-red-600">
            {getValidationMessage((errors.personalInfo as any)?.email)}
          </p>}
      </div>
      <div className="space-y-2 relative">
        <label htmlFor="church" className="block text-sm font-medium text-gray-700">
          {t('step1.church')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
            <HomeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select 
            id="church" 
            {...register('personalInfo.church')} 
            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200 appearance-none bg-white"
            style={{ 
              position: 'relative', 
              zIndex: 5,
              isolation: 'isolate'
            }}
          >
            <option value="" disabled>{t('step1.churchPlaceholder')}</option>
            {churches.map(church => <option key={church} value={church}>
                {church}
              </option>)}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
          {t('step1.maritalStatus')} <span className="text-red-500">*</span>
        </label>
        <div className="relative z-10">
          <select 
            id="maritalStatus" 
            {...register('personalInfo.maritalStatus')} 
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200 relative z-10"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <option value="" disabled>
              {t('step1.maritalStatusPlaceholder')}
            </option>
            {maritalStatusOptions.map(status => <option key={status.value} value={status.value}>
                {status.label}
              </option>)}
          </select>
        </div>
        {(errors.personalInfo as any)?.maritalStatus && <p className="mt-1 text-sm text-red-600">
            {getValidationMessage((errors.personalInfo as any)?.maritalStatus)}
          </p>}
      </div>
    </div>;
};