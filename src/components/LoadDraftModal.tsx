import React, { useState } from 'react';
import { XIcon, LoaderIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getDraftByEmail } from '../utils/api';
import type { RegistrationFormData } from './RegistrationForm';

interface LoadDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDraft: (data: RegistrationFormData) => void;
}

export const LoadDraftModal: React.FC<LoadDraftModalProps> = ({
  isOpen,
  onClose,
  onLoadDraft
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleLoadDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await getDraftByEmail(email);
      
      if (result.success && result.data) {
        // Convert API response to form data format
        const formData = convertApiDataToFormData(result.data);
        onLoadDraft(formData);
        setEmail('');
        onClose();
      } else {
        setError(result.error || t('loadDraft.notFound'));
      }
    } catch (err) {
      setError(t('loadDraft.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Convert API response data to form data format
  const convertApiDataToFormData = (apiData: any): RegistrationFormData => {
    return {
      personalInfo: apiData.personalInfo || {},
      familyParticipation: apiData.familyParticipation || {},
      travelSchedule: apiData.travelSchedule ? {
        ...apiData.travelSchedule,
        arrivalDate: apiData.travelSchedule.arrivalDate ? new Date(apiData.travelSchedule.arrivalDate) : undefined,
        returnDate: apiData.travelSchedule.returnDate ? new Date(apiData.travelSchedule.returnDate) : undefined
      } : undefined,
      packageSelection: apiData.packageSelection || {},
      payment: apiData.payment ? {
        ...apiData.payment,
        transferDate: apiData.payment.transferDate ? new Date(apiData.payment.transferDate) : undefined,
        receiptImage: apiData.payment.receiptImage || null
      } : {},
      accommodation: apiData.accommodation || {}
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('loadDraft.title')}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLoadDraft} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('loadDraft.emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('loadDraft.emailPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5AAC]"
              required
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              {t('loadDraft.description')}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-lg flex items-start">
              <AlertCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2E5AAC] text-white rounded-lg text-sm font-medium hover:bg-[#1e4a8c] flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <LoaderIcon className="w-4 h-4 animate-spin" />}
              {t('loadDraft.loadButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

