import React, { useState } from 'react';
import { XIcon, LoaderIcon, AlertCircleIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getDraftByEmail } from '../utils/api';
import { formStyles } from '../utils/styles';
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
      familyParticipation: apiData.familyParticipation ? {
        ...apiData.familyParticipation,
        numberOfChildren: Number(apiData.familyParticipation.numberOfChildren || 0),
        children: Array.isArray(apiData.familyParticipation.children) 
          ? apiData.familyParticipation.children.map((child: any) => ({
              ...child,
              tShirtSize: child.tShirtSize || undefined
            }))
          : (typeof apiData.familyParticipation.children === 'object' && apiData.familyParticipation.children !== null)
            ? Object.values(apiData.familyParticipation.children).map((child: any) => ({
                ...child,
                tShirtSize: child.tShirtSize || undefined
              }))
            : [],
        spouseTShirtSize: apiData.familyParticipation.spouseTShirtSize || undefined
      } : {},
      travelSchedule: apiData.travelSchedule ? {
        ...apiData.travelSchedule,
        arrivalDate: apiData.travelSchedule.arrivalDate ? new Date(apiData.travelSchedule.arrivalDate) : undefined,
        returnDate: apiData.travelSchedule.returnDate ? new Date(apiData.travelSchedule.returnDate) : undefined
      } : undefined,
      packageSelection: apiData.packageSelection ? {
        ...apiData.packageSelection,
        wantMagazine: apiData.packageSelection.wantMagazine || false,
        magazineQuantity: apiData.packageSelection.magazineQuantity || 1
      } : {},
      payment: apiData.payment ? {
        ...apiData.payment,
        transferDate: apiData.payment.transferDate ? new Date(apiData.payment.transferDate) : undefined,
        receiptImage: apiData.payment.receiptImage || null
      } : {},
      accommodation: apiData.accommodation || {},
      isDraft: apiData.isDraft
    };
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">{t('loadDraft.title')}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLoadDraft} className="space-y-6">
          <div className="space-y-2">
            <label className={formStyles.label}>
              {t('loadDraft.emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('loadDraft.emailPlaceholder')}
              className={formStyles.input}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-slate-500">
              {t('loadDraft.description')}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-100">
              <AlertCircleIcon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className={formStyles.buttonSecondary}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className={`${formStyles.buttonPrimary} flex items-center gap-2`}
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
