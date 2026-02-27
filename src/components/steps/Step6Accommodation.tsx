import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { AlertCircleIcon, InfoIcon, CheckIcon, CopyIcon, ChevronDownIcon, ChevronUpIcon, DownloadIcon } from 'lucide-react';
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
  const [isTransferInfoOpen, setIsTransferInfoOpen] = useState(true);
  const [copiedItems, setCopiedItems] = useState({
    bankName: false,
    accountNumber: false,
    accountHolder: false
  });

  const stayStatus = watch('accommodation.stayStatus');
  const needAssistance = watch('accommodation.needAssistance');
  const agreeToTerms = watch('accommodation.agreeToTerms');
  const sponsorshipAmount = watch('accommodation.sponsorshipAmount') || 0;

  const handleCopy = (text: string, itemType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => ({
      ...prev,
      [itemType]: true
    }));
    setTimeout(() => {
      setCopiedItems(prev => ({
        ...prev,
        [itemType]: false
      }));
    }, 2000);
  };
  


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

      <div className="border-t border-slate-100 pt-8 space-y-6">
        {/* Sponsorship Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="sponsorshipAmount" className="text-[15px] font-bold text-slate-800">
              {t('step6.sponsorshipAmount')} <span className="text-slate-400 font-normal">({t('common.optional')})</span>
            </label>
            <p className="text-sm text-slate-600 mb-2 whitespace-pre-line">
              {t('step6.sponsorshipDescription')}
            </p>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-slate-500 font-medium">₫</span>
              </div>
              <Controller 
                control={control} 
                name="accommodation.sponsorshipAmount" 
                render={({ field }) => (
                  <input 
                    type="text" 
                    id="sponsorshipAmount" 
                    className={`${formStyles.input} pl-8 font-medium`}
                    placeholder="0" 
                    value={field.value ? new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(field.value).replace('₫', '').trim() : ''} 
                    onChange={e => {
                      // Remove non-numeric characters and parse as number
                      const value = e.target.value.replace(/[^\d]/g, '');
                      field.onChange(value ? parseInt(value, 10) : undefined);
                    }} 
                  />
                )} 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <label htmlFor="bankNote" className="text-[15px] font-bold text-slate-800">
              {t('step6.bankNote')}
            </label>
            <textarea 
              id="bankNote" 
              {...register('accommodation.bankNote')} 
              rows={2} 
              className={formStyles.textarea}
              placeholder={t('step6.bankNotePlaceholder')} 
            />
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mt-6">
            <button 
              type="button" 
              className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors" 
              onClick={() => setIsTransferInfoOpen(!isTransferInfoOpen)}
            >
              <span className='font-semibold text-slate-800'>{t('step5.bankInstructions')}</span>
              {isTransferInfoOpen ? <ChevronUpIcon className="h-5 w-5 text-slate-500" /> : <ChevronDownIcon className="h-5 w-5 text-slate-500" />}
            </button>
            
            {isTransferInfoOpen && (
              <div className="p-5 space-y-5 border-t border-slate-200">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('step5.bankSyntax')}
                </p>
                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                  <code className="block text-sm font-mono text-[#2E5AAC] break-all font-semibold">
                    Tên ACE_Tên Hội Thánh_SDT
                  </code>
                  <div className="text-sm text-slate-600 mt-2 pt-2 border-t border-slate-200">
                    Ví dụ: <code className="font-mono font-semibold text-slate-800">CaoThiThanhHuyen_DaNang_0392435683</code>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <img 
                      src="/assets/payment-qr.png" 
                      alt="Payment QR Code" 
                      className="max-w-[200px] h-auto rounded-lg"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/assets/payment-qr.png';
                      link.download = 'Church_Event_Payment_QR.png';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="mt-3 flex items-center text-sm font-medium text-[#2E5AAC] hover:text-[#254a8f] transition-colors py-2 px-4 rounded-lg hover:bg-blue-50"
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    {t('step5.downloadQR')}
                  </button>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-800">{t('step5.accountInfo')}:</p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">{t('step5.bankName')}:</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-900">{t('step5.bankNameValue')}</span>
                        <button type="button" onClick={() => handleCopy(t('step5.bankNameValue'), 'bankName')} className="ml-2 p-1.5 text-slate-400 hover:text-[#2E5AAC] hover:bg-blue-50 rounded-md transition-colors">
                          {copiedItems.bankName ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">{t('step5.accountNumber')}:</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-900">{t('step5.accountNumberValue')}</span>
                        <button type="button" onClick={() => handleCopy(t('step5.accountNumberValue'), 'accountNumber')} className="ml-2 p-1.5 text-slate-400 hover:text-[#2E5AAC] hover:bg-blue-50 rounded-md transition-colors">
                          {copiedItems.accountNumber ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">{t('step5.accountHolder')}:</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-900">
                          {t('step5.accountHolderValue')}
                        </span>
                        <button type="button" onClick={() => handleCopy(t('step5.accountHolderValue'), 'accountHolder')} className="ml-2 p-1.5 text-slate-400 hover:text-[#2E5AAC] hover:bg-blue-50 rounded-md transition-colors">
                          {copiedItems.accountHolder ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

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