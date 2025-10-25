import React, { useState } from 'react';
import { XIcon, CheckCircleIcon, CopyIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
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
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('saveDraft.title')}</h2>
          <button onClick={onClose} className="p-1">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6">
          <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start mb-4">
            <CheckCircleIcon className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm">
              {t('saveDraft.savedMessage')}
            </p>
          </div>
          {!isSent ? <form onSubmit={handleSendEmail}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('saveDraft.emailLabel')}
              </label>
              <div className="flex gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('saveDraft.emailPlaceholder')} className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5AAC]" required />
                <button type="submit" className="bg-[#2E5AAC] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {t('saveDraft.sendButton')}
                </button>
              </div>
            </form> : <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-4">
              {t('saveDraft.sentMessage')}
            </div>}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('saveDraft.copyLabel')}
            </label>
            <div className="flex gap-2">
              <div className="flex-grow px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-500 truncate">
                https://church-anniversary.com/continue
              </div>
              <button onClick={handleCopyLink} className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                {isCopied ? t('saveDraft.copied') : <CopyIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium">
            {t('saveDraft.closeButton')}
          </button>
        </div>
      </div>
    </div>;
};