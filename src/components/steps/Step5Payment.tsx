import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { CalendarIcon, CopyIcon, CheckIcon, UploadIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import { useValidation } from '../../hooks/useValidation';
export const Step5Payment = () => {
  const {
    register,
    control,
    watch,
    formState: {
      errors
    }
  } = useFormContext();
  const { t } = useLanguage();
  const { getValidationMessage } = useValidation();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const paymentStatus = watch('payment.status');
  const handleCopy = text => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  return <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {t('step5.paymentStatus')}
        </label>
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <label className="flex-1 text-center">
            <input type="radio" value="paid" {...register('payment.status')} className="sr-only" />
            <div className={`py-3 px-4 cursor-pointer ${paymentStatus === 'paid' ? 'bg-[#2E5AAC] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              {t('step5.paymentOptions.paid')}
            </div>
          </label>
          <label className="flex-1 text-center border-l border-gray-300">
            <input type="radio" value="willPayLater" {...register('payment.status')} className="sr-only" />
            <div className={`py-3 px-4 cursor-pointer ${paymentStatus === 'willPayLater' ? 'bg-[#2E5AAC] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              {t('step5.paymentOptions.willPayLater')}
            </div>
          </label>
        </div>
      </div>
      {paymentStatus === 'paid' && <div className="space-y-2">
          <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700">
            {t('step5.transferDate')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Controller control={control} name="payment.transferDate" render={({
          field
        }) => <input type="date" id="transferDate" className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-11 border" value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} onChange={e => {
          field.onChange(e.target.value ? new Date(e.target.value) : null);
        }} />} />
          </div>
        </div>}
      <div className="border rounded-lg overflow-hidden">
        <button type="button" className="w-full flex justify-between items-center p-4 bg-gray-50" onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}>
          <span className='font-medium'>{t('step5.bankInstructions')}</span>
          {isInstructionsOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </button>
        {isInstructionsOpen && <div className="p-4 space-y-4">
            <p className="text-sm text-gray-600">
              {t('step5.bankSyntax')}
            </p>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <code className="text-sm font-mono">
                {t('step5.bankSyntax')}
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('step5.accountInfo')}:</p>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('step5.bankName')}:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">Vietcombank</span>
                    <button type="button" onClick={() => handleCopy('Vietcombank')} className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                      {isCopied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('step5.accountNumber')}:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">1023456789</span>
                    <button type="button" onClick={() => handleCopy('1023456789')} className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                      {isCopied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('step5.accountHolder')}:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      Church Anniversary
                    </span>
                    <button type="button" onClick={() => handleCopy('Church Anniversary')} className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                      {isCopied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {t('step5.uploadReceipt')} ({t('common.optional')})
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="receipt-upload" className="relative cursor-pointer rounded-md font-medium text-[#2E5AAC] hover:text-[#6AA6FF]">
                <span>{t('common.upload')} a file</span>
                <input id="receipt-upload" type="file" className="sr-only" {...register('payment.receiptImage')} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>
      </div>
    </div>;
};