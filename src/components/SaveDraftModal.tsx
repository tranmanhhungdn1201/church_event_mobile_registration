import React, { useState } from 'react';
import { XIcon, CheckCircleIcon, CopyIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { formStyles } from '../utils/styles';

interface SaveDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveDraftModal: React.FC<SaveDraftModalProps> = ({
  isOpen,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send a magic link email
    console.log('Sending magic link to:', email);
    setIsSent(true);
  };

  const handleCopyLink = () => {
    // In a real app, this would generate and copy a unique link
    navigator.clipboard.writeText(`https://church-anniversary.com/continue?token=${Date.now()}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">{t('saveDraft.title')}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6 space-y-6">
          <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start border border-green-100">
            <CheckCircleIcon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium leading-relaxed">
              {t('saveDraft.savedMessage')}
            </p>
          </div>
          
          {!isSent ? (
            <form onSubmit={handleSendEmail} className="space-y-3">
              <label className={formStyles.label}>
                {t('saveDraft.emailLabel')}
              </label>
              <div className="flex gap-3">
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder={t('saveDraft.emailPlaceholder')} 
                  className={`${formStyles.input} flex-grow`} 
                  required 
                />
                <button type="submit" className={`${formStyles.buttonPrimary} whitespace-nowrap px-6`}>
                  {t('saveDraft.sendButton')}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-[#2E5AAC]/5 text-[#2E5AAC] p-4 rounded-xl text-sm font-medium border border-[#2E5AAC]/10">
              {t('saveDraft.sentMessage')}
            </div>
          )}
          
          <div className="space-y-3 pt-2">
            <label className={formStyles.label}>
              {t('saveDraft.copyLabel')}
            </label>
            <div className="flex gap-3">
              <div className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 truncate font-mono select-all flex items-center">
                https://church-anniversary.com/continue
              </div>
              <button 
                onClick={handleCopyLink} 
                className="border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-slate-50 text-slate-700 transition-colors shadow-sm bg-white h-12"
              >
                {isCopied ? <span className="text-green-600 font-bold text-xs">{t('saveDraft.copied')}</span> : <CopyIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <button onClick={onClose} className={formStyles.buttonSecondary}>
            {t('saveDraft.closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};