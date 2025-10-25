import { CheckCircleIcon, CalendarIcon, ShareIcon, MessageCircleIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../../contexts/LanguageContext';
export const SuccessStep = ({
  formData
}) => {
  const { t } = useLanguage();
  // Generate a random registration code
  const registrationCode = `CA${Math.floor(10000 + Math.random() * 90000)}`;
  return <div className="max-w-md mx-auto py-12 px-4 text-center">
      <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t('success.title')}
      </h2>
      <p className="text-gray-600 mb-8">
        {t('success.congratulations')}
      </p>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <p className="text-sm text-gray-500 mb-2">{t('success.registrationCode')}</p>
        <p className="text-xl font-bold text-[#2E5AAC] mb-4">
          {registrationCode}
        </p>
        <div className="flex justify-center mb-4">
          <QRCodeSVG value={registrationCode} size={150} />
        </div>
        <p className="text-sm text-gray-600">
          {t('success.saveCode')}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button type="button" className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
          {t('common.addToCalendar')}
        </button>
        <button type="button" className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <ShareIcon className="h-5 w-5 mr-2 text-gray-500" />
          {t('common.share')}
        </button>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 text-left">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
          <MessageCircleIcon className="h-5 w-5 mr-2" />
          {t('success.joinCommunity')}
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          {t('success.communityDescription')}
        </p>
        <div className="flex space-x-3">
          <button type="button" className="flex-1 bg-white py-2 px-3 rounded border border-blue-200 text-sm font-medium text-blue-800">
            {t('success.joinZalo')}
          </button>
          <button type="button" className="flex-1 bg-white py-2 px-3 rounded border border-blue-200 text-sm font-medium text-blue-800">
            {t('success.joinTelegram')}
          </button>
        </div>
      </div>
    </div>;
};